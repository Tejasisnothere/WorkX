from pydantic import BaseModel, Field
from langchain_core.output_parsers import StrOutputParser
from langgraph.graph import StateGraph, START, END
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import PromptTemplate
from states.onboarding import InterviewState
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import interrupt, Command
from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv
load_dotenv()

key = os.getenv("GROQ_API_KEY")
llm = ChatGroq(model="openai/gpt-oss-120b", api_key=key)


class Evaluator(BaseModel):
    score: float = Field(description="Float score from 1-10 based on how good the user's response to the question is.")


class TechnicalSkills(BaseModel):
    skills: list[str] = Field(description="List of skills that user knows.")
    tools: list[str] = Field(description="List of tools used by user.")


async def ask_question(state: InterviewState):

    prompt = PromptTemplate.from_template("""
You are an onboarding interviewer for a local employment-matching platform. Your job is to ask ONE natural, conversational question that uncovers the worker's real work experience — what they've done, how they did it, and what they're capable of — so they can be matched to suitable jobs.

WORKER
Name: {name}
Profession: {profession}
Age: {age}

CONVERSATION SO FAR
{messages}

HOW TO CHOOSE THE NEXT QUESTION
1. Read the conversation and find the most recent specific thing the worker mentioned (a task, tool, job, or skill).
2. Ask a follow-up that digs deeper into that specific thing — not a generic question.
3. If nothing specific has come up yet, ask about their most recent job: what they actually did day to day.
4. Never re-ask something already answered or already known (name, age, profession, location, etc.).
5. Prioritize whatever best reveals: tasks they can do independently, tools/equipment they've used, methods or techniques, problems they've solved, and hands-on strengths.

STYLE
- Simple, everyday language — no corporate or technical jargon.
- Short: one sentence, one question.
- Sounds like a real person asking, not a form.

OUTPUT
Return ONLY the question text itself.
No quotation marks, no numbering, no "Question:" prefix, no explanation, no alternatives.
""")
    chain = prompt | llm | StrOutputParser()
    question = await chain.ainvoke({
        "messages": state.messages,
        "profession": state.user.profession,
        "age": state.user.age,
        "name": state.user.name
    })

    return {
        "question": question,
        "messages": [AIMessage(content=question)]
    }


async def get_answer(state: InterviewState):
    """
    Pauses graph execution here. Whatever is passed to
    Command(resume=...) on the next invoke becomes `answer`.
    """
    answer = interrupt({"question": state.question})

    return {
        "answer": answer,
        "messages": [HumanMessage(content=answer)]
    }


async def evaluate_answer(state: InterviewState):

    answer = state.answer
    question = state.question
    evaluator_prompt = PromptTemplate.from_template("""
You are an onboarding evaluator agent. Your task is to score the user's answer based on relevance and accuracy.
Question: {question}
\n
Answer: {answer}
""")

    structured_llm = llm.with_structured_output(Evaluator)
    chain = evaluator_prompt | structured_llm
    score = await chain.ainvoke({
        "answer": answer,
        "question": question
    })

    passes = state.passes + 1

    return {
        "inst_score": score.score,
        "total_score": state.total_score + score.score,
        "passes": passes
    }


def check_passes(state: InterviewState):
    if state.passes >= 3:
        return "end"
    return "continue"


async def gather_tech_knowledge(state: InterviewState):
    """
    Runs once, after the interview loop ends, extracting a structured
    skills/tools summary from the full conversation transcript.
    """
    prompt = PromptTemplate.from_template("""
You are supposed to extract technical skills and tools that the user knows or has used, based on their answers below. Only include things they actually mentioned — do not invent anything.

CONVERSATION
{text}
""")
    structured_llm = llm.with_structured_output(TechnicalSkills)
    chain = prompt | structured_llm
    result = await chain.ainvoke({"text": state.messages})

    return {
        "skills": result.skills,
        "tools": result.tools
    }


builder = StateGraph(InterviewState)

builder.add_node("ask_question", ask_question)
builder.add_node("get_answer", get_answer)
builder.add_node("evaluate_answer", evaluate_answer)
builder.add_node("gather_tech_knowledge", gather_tech_knowledge)

builder.add_edge(START, "ask_question")
builder.add_edge("ask_question", "get_answer")
builder.add_edge("get_answer", "evaluate_answer")

builder.add_conditional_edges(
    "evaluate_answer",
    check_passes,
    {
        "continue": "ask_question",
        "end": "gather_tech_knowledge"
    }
)
builder.add_edge("gather_tech_knowledge", END)

checkpointer = MemorySaver()
graph = builder.compile(checkpointer=checkpointer)