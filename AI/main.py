from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langgraph.types import Command
from graphs.Interview import graph
from states.onboarding import InterviewState, UserInfo
from collections import defaultdict
import asyncio
import uuid

app = FastAPI()

# Per-thread locks: prevents two concurrent requests (e.g. a retried
# double-tap from the frontend) from invoking the same session at once.
# Different users get different locks, so this never blocks each other.
thread_locks: dict[str, asyncio.Lock] = defaultdict(asyncio.Lock)


class StartRequest(BaseModel):
    name: str
    profession: str
    age: int


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
    thread_id = str(uuid.uuid4())
    config = {"configurable": {"thread_id": thread_id}}

    initial_state = InterviewState(
        user=UserInfo(name=req.name, profession=req.profession, age=req.age),
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
    }


@app.post("/interview/answer")
async def submit_answer(req: AnswerRequest):
    config = {"configurable": {"thread_id": req.thread_id}}

    # Reject unknown/expired sessions early with a clean error
    state = await graph.aget_state(config)
    if not state.values:
        raise HTTPException(status_code=404, detail="Session not found or expired")

    lock = thread_locks[req.thread_id]
    async with lock:
        result = await graph.ainvoke(Command(resume=req.answer), config=config)

    question = extract_interrupt_question(result)
    if question:
        return {"status": "in_progress", "question": question}

    return {
        "status": "done",
        "total_score": result["total_score"],
        "skills": result.get("skills", []),
        "tools": result.get("tools", []),
    }


@app.get("/interview/{thread_id}/status")
async def get_status(thread_id: str):
    """Lets the frontend recover its place if it reloads mid-interview."""
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
    }