from contextlib import asynccontextmanager
from collections import defaultdict
import asyncio
import uuid
import os
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


embedder = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

AUDIO_STORAGE_PATH = os.path.join(os.getcwd(), "audios")
os.makedirs(AUDIO_STORAGE_PATH, exist_ok=True)


def resolve_lang_code(language: str) -> str:
    """Normalizes any language name/code (e.g. 'hindi', 'Hindi', 'hi') to
    a short ISO code Google Translate accepts. Raises a clean 400 if the
    input isn't recognizable at all."""
    try:
        return langcodes.find(language).language
    except LookupError:
        raise HTTPException(status_code=400, detail=f"Unrecognized language: {language}")


def translate_if_needed(text: str, target_lang: str, source_lang: str = "en") -> str:
    """Skips the Translate API call entirely when source and target are
    the same language — Google's API rejects same-language pairs (e.g.
    en->en) as a 400 Bad Request, so this avoids that error and saves a
    network call for English-speaking users."""
    if not text:
        return text
    if target_lang == source_lang:
        return text
    return Translator(from_lang=source_lang, to_lang=target_lang).translate(text)


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with get_graph() as graph:
        app.state.graph = graph
        app.state.embedder = embedder
        yield


app = FastAPI(lifespan=lifespan)

thread_locks: dict[str, asyncio.Lock] = defaultdict(asyncio.Lock)

sp = StoragePipeline()


class StartRequest(BaseModel):
    name: str
    profession: str
    age: int
    lat: float
    long: float
    phone: str
    language: str


def extract_interrupt_question(result: dict):
    """Pulls the question out of an interrupt payload, if execution paused."""
    if "__interrupt__" in result:
        return result["__interrupt__"][0].value["question"]
    return None


@app.post("/interview/start")
async def start_interview(req: StartRequest):
    graph = app.state.graph

    thread_id = phone_to_id(req.phone)
    config = {"configurable": {"thread_id": thread_id}}

    user_language = resolve_lang_code(req.language)

    initial_state = InterviewState(
        user=UserInfo(
            name=req.name,
            profession=req.profession,
            age=req.age,
            lat=req.lat,
            long=req.long,
            language=user_language,  # store the normalized code, not raw input
        ),
    )

    result = await graph.ainvoke(initial_state, config=config)

    question = extract_interrupt_question(result)
    if question:
        translated_question = translate_if_needed(question, user_language)
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

    # remove here

    os.remove(file_path)

    lock = thread_locks[thread_id]
    async with lock:
        result = await graph.ainvoke(Command(resume=answer_text), config=config)

    question = extract_interrupt_question(result)
    if question:
        translated_question = translate_if_needed(question, user_language)
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