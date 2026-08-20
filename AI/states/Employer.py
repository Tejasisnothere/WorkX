from typing import Annotated, Optional
from pydantic import BaseModel, Field
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage


class SearchQuery(BaseModel):
    """Structured query built from the employer's conversation."""
    search_text: str = ""          
    profession: str = ""           
    keywords: list[str] = []       
    radius_km: float = 10.0        


class WorkerResult(BaseModel):
    worker_id: str
    name: str
    profession: str
    score: float


class EmployerState(BaseModel):
    employer_id: str
    lat: float
    long: float

    messages: Annotated[list[BaseMessage], add_messages] = []

    question: str = ""
    answer: str = ""

    query: SearchQuery = SearchQuery()
    eval_passed: bool = False
    eval_feedback: str = ""
    attempts: int = 0

    results: list[WorkerResult] = []