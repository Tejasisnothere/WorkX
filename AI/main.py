from contextlib import asynccontextmanager
from collections import defaultdict
import asyncio
import uuid
from langchain_huggingface import HuggingFaceEmbeddings
from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from langgraph.types import Command

from graphs.Interview import get_graph
from states.onboarding import InterviewState, UserInfo

from pipelines.WorkerStorage import StoragePipeline

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with get_graph() as graph:
        app.state.graph = graph
        app.state.embedder = HuggingFaceEmbeddings(model="all-MiniLM-L6-v2")
        yield


app = FastAPI(lifespan=lifespan)

# Per-thread locks: prevents two concurrent requests (e.g. a retried
# double-tap from the frontend) from invoking the same session at once.
# Different users get different locks, so this never blocks each other.
thread_locks: dict[str, asyncio.Lock] = defaultdict(asyncio.Lock)

sp = StoragePipeline()


class StartRequest(BaseModel):
    name: str
    profession: str
    age: int
    lat: float
    long: float


class AnswerRequest(BaseModel):
    thread_id: str
    answer: str


def extract_interrupt_question(result: dict):
    """Pulls the question out of an interrupt payload, if execution paused."""
    if "__interrupt__" in result:
        return result["__interrupt__"][0].value["question"]
    return None


@app.post("/interview/start")
async def start_interview(req: StartRequest):
    graph = app.state.graph

    # This thread_id is the key everything else hangs off of: pass it in
    # config on every future call for this session, and AsyncPostgresSaver
    # will load/save that exact conversation's state in Postgres under it.
    thread_id = req.id
    config = {"configurable": {"thread_id": thread_id}}

    initial_state = InterviewState(
        user=UserInfo(
            name=req.name,
            profession=req.profession,
            age=req.age,
            lat=req.lat,
            long=req.long,
            language=req.language
        ),
    )

    result = await graph.ainvoke(initial_state, config=config)

    question = extract_interrupt_question(result)
    if question:
        return {"thread_id": thread_id, "status": "in_progress", "question": question}

    return {
        "thread_id": thread_id,
        "status": "done",
        "total_score": result["total_score"],
        "skills": result.get("skills", []),
        "tools": result.get("tools", []),
        "summary": result.get("summary", ""),
    }


@app.post("/interview/answer")
async def submit_answer(req: AnswerRequest, background_tasks: BackgroundTasks):
    graph = app.state.graph
    config = {"configurable": {"thread_id": req.thread_id}}

    # Reject unknown/expired sessions early with a clean error.
    # Since state now lives in Postgres, this also works after a server
    # restart — the thread_id from /interview/start remains valid.
    state = await graph.aget_state(config)
    if not state.values:
        raise HTTPException(status_code=404, detail="Session not found or expired")

    lock = thread_locks[req.thread_id]
    async with lock:
        result = await graph.ainvoke(Command(resume=req.answer), config=config)

    question = extract_interrupt_question(result)
    if question:
        return {"status": "in_progress", "question": question}

    # `user` may come back as either a nested dict or an actual UserInfo
    # Pydantic instance depending on LangGraph's serialization — normalize
    # to a dict either way so .get(...) always works.
    raw_user = result.get("user", {})
    user = raw_user.model_dump() if hasattr(raw_user, "model_dump") else raw_user

    background_tasks.add_task(
        sp.initiateVSPipeline,
        worker_id=req.thread_id,    # replace with user id
        summary=result.get("summary", ""),
        skills=result.get("skills", []),
        tools=result.get("tools", []),
        profession=user.get("profession", ""),
        lat=user.get("lat", ""),
        long=user.get("long", ""),
        name=user.get("name", ""),
        score=result.get("total_score", 5),
        embedder=app.state.embedder
    )

    return {
        "status": "done",
        "total_score": result["total_score"],
        "skills": result.get("skills", []),
        "tools": result.get("tools", []),
        "summary": result.get("summary", ""),
    }


@app.get("/interview/{thread_id}/status")
async def get_status(thread_id: str):
    """Lets the frontend recover its place if it reloads mid-interview."""
    graph = app.state.graph
    config = {"configurable": {"thread_id": thread_id}}
    state = await graph.aget_state(config)

    if not state.values:
        raise HTTPException(status_code=404, detail="Session not found")

    if state.next:  # graph is paused, waiting on an interrupt
        return {"status": "in_progress", "question": state.values.get("question")}

    return {
        "status": "done",
        "total_score": state.values.get("total_score"),
        "skills": state.values.get("skills", []),
        "tools": state.values.get("tools", []),
        "summary": state.values.get("summary", ""),
    }





if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)