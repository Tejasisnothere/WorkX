import os
from pathlib import Path
from contextlib import asynccontextmanager

from pydantic import BaseModel, Field
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
from langgraph.types import interrupt, Command
from dotenv import load_dotenv

from states.Employer import EmployerState, SearchQuery, WorkerResult
from vectorstores.qdrantvs import client as qdrant_client
from main import embedder  # shared, loaded-once HuggingFaceEmbeddings instance

from qdrant_client.models import Filter, FieldCondition, MatchValue, GeoRadius, GeoPoint

load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")

key = os.getenv("GROQ_API_KEY")
llm = ChatGroq(model="openai/gpt-oss-120b", api_key=key)

DB_URI = os.getenv("DATABASE_URL")
if not DB_URI:
    raise RuntimeError(
        "DATABASE_URL is not set. Check that a .env file exists at the "
        "project root with a DATABASE_URL=... line."
    )

MAX_ATTEMPTS = 3


class EvalResult(BaseModel):
    passes: bool = Field(description="Whether the query captures the employer's actual hiring need.")
    feedback: str = Field(description="If it fails, a short note on what's missing or unclear — used to ask a targeted follow-up question.")


# ---------------------------------------------------------------------------
# Nodes
# ---------------------------------------------------------------------------

async def build_query(state: EmployerState):
    """
    Converts the conversation so far (starting with the employer's initial
    need, plus any clarifying follow-up) into a structured search query.
    """
    prompt = PromptTemplate.from_template("""
You are a search-query builder for a worker-hiring platform. Based on the conversation below, build a structured search query that will be used to find matching workers.

CONVERSATION
{messages}

FIELDS
- search_text: a rich natural-language description of the work needed and the ideal worker's capabilities — this is embedded and matched semantically, so include relevant detail.
- profession: the single job category/profession that best fits (e.g. "Electrician"), or empty string if unclear.
- keywords: short, concrete searchable terms (tasks, tools, techniques) mentioned or clearly implied — 1-4 words each, lowercase.
- radius_km: how far the employer seems willing to search, in kilometers. Default to 10 if not mentioned.

Only include what's actually stated or clearly implied. Do not invent details.
""")
    structured_llm = llm.with_structured_output(SearchQuery)
    chain = prompt | structured_llm

    try:
        query = await chain.ainvoke({"messages": state.messages})
    except Exception as e:
        # Groq tool-calling can occasionally fail to call the tool at all.
        # Fall back to a minimal query from raw conversation text instead
        # of crashing the whole intake flow.
        print(f"[EmployerQuery] structured query build failed, using fallback: {e}")
        raw_text = "\n".join(m.content for m in state.messages if hasattr(m, "content"))
        query = SearchQuery(search_text=raw_text)

    return {"query": query}


async def evaluate_query(state: EmployerState):
    prompt = PromptTemplate.from_template("""
You are an evaluator checking whether a search query correctly captures an employer's hiring need.

CONVERSATION
{messages}

BUILT QUERY
search_text: {search_text}
profession: {profession}
keywords: {keywords}

Does this query accurately and specifically reflect what the employer is looking for? Fail it if it's vague, generic, missing an obvious detail the employer stated, or doesn't match the profession/skills mentioned.
""")
    structured_llm = llm.with_structured_output(EvalResult)
    chain = prompt | structured_llm

    try:
        result = await chain.ainvoke({
            "messages": state.messages,
            "search_text": state.query.search_text,
            "profession": state.query.profession,
            "keywords": state.query.keywords,
        })
    except Exception as e:
        print(f"[EmployerQuery] evaluator failed, defaulting to pass: {e}")
        result = EvalResult(passes=True, feedback="")

    return {
        "eval_passed": result.passes,
        "eval_feedback": result.feedback,
        "attempts": state.attempts + 1,
    }


def check_eval(state: EmployerState):
    if state.eval_passed:
        return "search"
    if state.attempts >= MAX_ATTEMPTS:
        # Give up refining after 3 tries — proceed with whatever we have
        # rather than looping forever or blocking the employer.
        return "search"
    return "clarify"


async def ask_clarifying_question(state: EmployerState):
    """
    Only reached when evaluate_query rejects the current query and attempts
    remain — asks ONE targeted follow-up to fill the specific gap the
    evaluator flagged.
    """
    prompt = PromptTemplate.from_template("""
You are an intake assistant for a worker-hiring platform. The search query built so far doesn't fully capture what the employer needs. Ask ONE natural follow-up question that fills the specific gap below.

CONVERSATION SO FAR
{messages}

WHAT'S MISSING OR UNCLEAR
{feedback}

STYLE
- Simple, everyday language.
- Short: one sentence, one question.

OUTPUT
Return ONLY the question text itself. No quotes, no numbering, no prefix.
""")
    chain = prompt | llm | StrOutputParser()
    question = await chain.ainvoke({
        "messages": state.messages,
        "feedback": state.eval_feedback,
    })

    return {
        "question": question,
        "messages": [AIMessage(content=question)]
    }


async def get_answer(state: EmployerState):
    """Pauses graph execution. Command(resume=...) supplies the answer."""
    answer = interrupt({"question": state.question})
    return {
        "answer": answer,
        "messages": [HumanMessage(content=answer)]
    }


async def search_qdrant(state: EmployerState):
    embedding = embedder.embed_query(state.query.search_text)

    must_conditions = []
    if state.query.profession:
        must_conditions.append(
            FieldCondition(key="profession", match=MatchValue(value=state.query.profession))
        )
    must_conditions.append(
        FieldCondition(
            key="geo_location",
            geo_radius=GeoRadius(
                center=GeoPoint(lon=state.long, lat=state.lat),
                radius=state.query.radius_km * 1000,  # km -> meters
            )
        )
    )

    try:
        hits = qdrant_client.search(
            collection_name="workers",
            query_vector=embedding,
            query_filter=Filter(must=must_conditions),
            limit=10,
        )
        results = [
            WorkerResult(
                worker_id=str(hit.id),
                name=hit.payload.get("name", ""),
                profession=hit.payload.get("profession", ""),
                score=hit.score,
            )
            for hit in hits
        ]
    except Exception as e:
        print(f"[EmployerQuery] Qdrant search failed: {e}")
        results = []

    return {"results": results}


# ---------------------------------------------------------------------------
# Graph
# ---------------------------------------------------------------------------
#
# START -> build_query -> evaluate_query -> [search | clarify]
#                                clarify -> ask_clarifying_question -> get_answer -> build_query (loop)
#
# The employer's *initial* need (sent in the first POST, along with
# employer_id) is what seeds `messages` before the graph even runs, so the
# very first pass goes straight into build_query — no generic opening
# question is asked, since the employer already stated what they want.

builder = StateGraph(EmployerState)

builder.add_node("build_query", build_query)
builder.add_node("evaluate_query", evaluate_query)
builder.add_node("ask_clarifying_question", ask_clarifying_question)
builder.add_node("get_answer", get_answer)
builder.add_node("search_qdrant", search_qdrant)

builder.add_edge(START, "build_query")
builder.add_edge("build_query", "evaluate_query")

builder.add_conditional_edges(
    "evaluate_query",
    check_eval,
    {
        "clarify": "ask_clarifying_question",
        "search": "search_qdrant",
    }
)

builder.add_edge("ask_clarifying_question", "get_answer")
builder.add_edge("get_answer", "build_query")
builder.add_edge("search_qdrant", END)


# ---------------------------------------------------------------------------
# Postgres-backed async checkpointer (Aiven) — same pattern as the worker
# interview graph. thread_id is generated by the caller and reused across
# every subsequent call for that same employer search session.
# ---------------------------------------------------------------------------

@asynccontextmanager
async def get_graph():
    async with AsyncPostgresSaver.from_conn_string(DB_URI) as checkpointer:
        await checkpointer.setup()
        yield builder.compile(checkpointer=checkpointer)