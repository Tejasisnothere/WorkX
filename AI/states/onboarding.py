from typing import List, Annotated
from pydantic import BaseModel
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage
from pydantic import Field


class UserDetails(BaseModel):
    name: str
    lat: float
    long: float
    age: int
    language: str
    profession: str


class OnboardingState(BaseModel):
    messages: Annotated[list[BaseMessage], add_messages] = Field(default_factory=list)
    profile: UserDetails
    language: str


class InterviewState(BaseModel):
    passes: int
    total_score: int
    inst_score: int
    question: str
    answer: str
    messages: Annotated[list[BaseMessage], add_messages] = Field(default_factory=list)
    summary: str






