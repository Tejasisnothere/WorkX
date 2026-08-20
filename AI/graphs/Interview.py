from langgraph.graph import START, END, StateGraph
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import Command, interrupt
from states.onboarding import OnBoardingState
from langchain_groq import ChatGroq
from langchain_classic.prompts import PromptTemplate
import os
from pydantic import BaseModel
from dotenv import load_dotenv
load_dotenv()

key = os.getenv("GROQ_API_KEY")
llm = ChatGroq(model="openai/gpt-oss-120b", api_key=key)
