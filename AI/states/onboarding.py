from typing import Annotated, Optional
from pydantic import BaseModel, Field
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage


class UserInfo(BaseModel):
    name: str
    profession: str
    age: int


class InterviewState(BaseModel):
    user: UserInfo
    messages: Annotated[list[BaseMessage], add_messages] = []
    question: str = ""
    answer: str = ""
    inst_score: float = 0
    total_score: float = 0
    passes: int = 0
    skills: list[str] = []
    tools: list[str] = []

    summary: str=""