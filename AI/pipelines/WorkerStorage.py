from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from pydantic import BaseModel, Field
import os
from dotenv import load_dotenv
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue
from vectorstores.qdrantvs import client
from langchain_huggingface import HuggingFaceEmbeddings

load_dotenv()

key = os.getenv("GROQ_API_KEY")
llm = ChatGroq(model="openai/gpt-oss-120b", api_key=key)


class keywordExtractor(BaseModel):
    keywords: list[str] = Field(description="Useful and crucial keywords to identify worker's qualities.")


KEYWORD_PROMPT = PromptTemplate.from_template("""
You are a keyword extractor for a worker-matching platform. Extract concrete, searchable keywords from the worker's conversation below — things a job posting would match against.

CONVERSATION
{text}

INCLUDE: tasks performed, tools/equipment used, techniques demonstrated, specialization/domain — only if explicitly stated or clearly implied.
EXCLUDE: generic words (experience, skilled), invented capabilities, personal details (name, age, location).

Keywords: 1-4 words each, lowercase, no duplicates/near-duplicates.

Return ONLY the list of keywords.
""")


class StoragePipeline:
    def __init__(self):
        pass

    def initiateVSPipeline(self, **kwargs):
        print("START OF VS PIPELINE")
        self.__dict__.update(kwargs)

        try:
            self.extractKeywords()
        except Exception as e:
            print(f"[StoragePipeline] keyword extraction failed, continuing without them: {e}")
            self.keywords = []

        try:
            self.addKeywords()
        except Exception as e:
            print(f"[StoragePipeline] addKeywords failed: {e}")

        try:
            self.upsertPayload()
        except Exception as e:
            print(f"[StoragePipeline] upsert to Qdrant failed: {e}")

    def extractKeywords(self):
        structured_llm = llm.with_structured_output(keywordExtractor)
        chain = KEYWORD_PROMPT | structured_llm

        try:
            result = chain.invoke({"text": self.summary})
            self.keywords = result.keywords  # unwrap the Pydantic model -> plain list
        except Exception as e:
            # Groq's tool-calling can flake and not call the tool at all
            # (tool_use_failed). Fall back to plain text + manual split
            # instead of losing keywords entirely.
            print(f"[StoragePipeline] structured extraction failed, falling back to raw text: {e}")
            raw_chain = KEYWORD_PROMPT | llm | StrOutputParser()
            raw_text = raw_chain.invoke({"text": self.summary})
            self.keywords = [line.strip("-• \t") for line in raw_text.split("\n") if line.strip()]

    def addKeywords(self):
        for i in self.tools:
            if i not in self.keywords:
                self.keywords.append(i)

        for i in self.skills:
            if i not in self.keywords:
                self.keywords.append(i)

    def upsertPayload(self):
        embedding = self.embedder.embed_query(self.summary)

        client.upsert(
            collection_name="workers",
            points=[
                PointStruct(
                    id=self.worker_id,
                    vector=embedding,
                    payload={
                        "name": self.name,
                        "worker_id": self.worker_id,
                        "skills": self.skills,
                        "tools": self.tools,
                        "keywords": self.keywords,
                        "profession": self.profession,
                        "geo_location": {"lon": self.long, "lat": self.lat},
                        "score": self.score,
                    }
                )
            ]
        )
        print(f"[StoragePipeline] upserted worker {self.worker_id} to Qdrant")