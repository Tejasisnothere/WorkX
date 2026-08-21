from contextlib import asynccontextmanager
from collections import defaultdict
import asyncio
import uuid
from langchain_huggingface import HuggingFaceEmbeddings
from fastapi import FastAPI, HTTPException, BackgroundTasks, UploadFile, File, Form
from pydantic import BaseModel
from langgraph.types import Command
from utils.hasher import phone_to_id
from graphs.Interview import get_graph
from states.onboarding import InterviewState, UserInfo
from utils.translator import Translator
from pipelines.WorkerStorage import StoragePipeline
import langcodes
from utils.transcriber import Transcriber

# Fixed: HuggingFaceEmbeddings takes `model_name`, not `model` — using the
# wrong kwarg raises a validation error at import time and the whole app
# fails to start.
embedder = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

import os  # add to top-level imports

AUDIO_STORAGE_PATH = os.path.join(os.getcwd(), "audios")
os.makedirs(AUDIO_STORAGE_PATH, exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with get_graph() as graph:
        app.state.graph = graph
        app.state.embedder = embedder
        yield


app = FastAPI(lifespan=lifespan)

# Per-thread locks: prevents two concurrent requests (e.g. a retried
# double-tap from the frontend) from invoking the same session at once.
# Different users get different locks, so this never blocks each other.
thread_locks: dict[str, asyncio.Lock] = defaultdict(asyncio.Lock)

sp = StoragePipeline()


class StartRequest(BaseModel):
    # Added: `phone` and `language` were referenced below (as req.id /
    # req.language) but never declared here — FastAPI/Pydantic has no
    # attribute for undeclared fields, so this crWAashed at runtime.
    # Renamed `id` -> `phone` since it's what's actually passed into
    # phone_to_id(); using `id` was misleading.
    name: str
    profession: str
    age: int
    lat: float
    long: float
    phone: str
    language: str


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

    # thread_id is deterministic from phone number, so the same worker
    # always maps to the same LangGraph thread AND the same Qdrant point
    # id later (worker_id=req.thread_id in submit_answer). If the same
    # phone number calls /start again, this re-runs the graph from START
    # on that same thread_id, overwriting its prior progress — decide if
    # that's the behavior you want, or add a check-existing-session guard
    # here first.
    thread_id = phone_to_id(req.phone)
    config = {"configurable": {"thread_id": thread_id}}

    initial_state = InterviewState(
        user=UserInfo(
            name=req.name,
            profession=req.profession,
            age=req.age,
            lat=req.lat,
            long=req.long,
            language=langcodes.find(req.language).language,
        ),
    )

    result = await graph.ainvoke(initial_state, config=config)

    question = extract_interrupt_question(result)
    if question:
        translator = Translator(from_lang="en", to_lang=initial_state.user.language)
        translated_question = translator.translate(question)
        return {"thread_id": thread_id, "status": "in_progress", "question": translated_question}

    return {
        "thread_id": thread_id,
        "status": "done",
        "total_score": result["total_score"],
        "skills": result.get("skills", []),
        "tools": result.get("tools", []),
        "summary": result.get("summary", ""),
    }


@app.post("/interview/answer")
async def submit_answer(
    background_tasks: BackgroundTasks,
    phone: str = Form(...),
    audio: UploadFile = File(...),
):
    thread_id = phone_to_id(phone)
    graph = app.state.graph
    config = {"configurable": {"thread_id": thread_id}}

    # Reject unknown/expired sessions early with a clean error.
    state = await graph.aget_state(config)
    if not state.values:
        raise HTTPException(status_code=404, detail="Session not found or expired")

    raw_user = state.values.get("user", {})
    user_snapshot = raw_user.model_dump() if hasattr(raw_user, "model_dump") else raw_user
    user_language = user_snapshot.get("language", "en")

    # Save uploaded audio to disk under a unique name
    ext = os.path.splitext(audio.filename)[1] or ".m4a"
    unique_filename = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(AUDIO_STORAGE_PATH, unique_filename)

    with open(file_path, "wb") as f:
        f.write(await audio.read())

    # Transcribe (blocking call to Groq — push off the event loop)
    transcriber = Transcriber(filename=unique_filename)
    answer_text = await asyncio.to_thread(transcriber.transcribe)

    if not answer_text:
        raise HTTPException(status_code=422, detail="Could not transcribe audio")

    lock = thread_locks[thread_id]
    async with lock:
        result = await graph.ainvoke(Command(resume=answer_text), config=config)

    question = extract_interrupt_question(result)
    if question:
        translator = Translator(from_lang="en", to_lang=user_language)
        translated_question = translator.translate(question)
        return {"status": "in_progress", "question": translated_question}

    raw_user = result.get("user", {})
    user = raw_user.model_dump() if hasattr(raw_user, "model_dump") else raw_user

    background_tasks.add_task(
        sp.initiateVSPipeline,
        worker_id=thread_id,
        summary=result.get("summary", ""),
        skills=result.get("skills", []),
        tools=result.get("tools", []),
        profession=user.get("profession", ""),
        lat=user.get("lat", ""),
        long=user.get("long", ""),
        name=user.get("name", ""),
        score=result.get("total_score", 5),
        embedder=app.state.embedder,
    )

    background_tasks.add_task(os.remove, file_path)

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