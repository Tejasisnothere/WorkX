from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Document
from dotenv import load_dotenv
import os


load_dotenv()

QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")


client = QdrantClient(
    url="https://28f6622d-7880-4025-a574-e176193450eb.eu-central-1-0.aws.cloud.qdrant.io",
    api_key=QDRANT_API_KEY,
    cloud_inference=True
)

# client.create_collection(
#     collection_name="workers",
#     vectors_config=VectorParams(size=384, distance=Distance.COSINE),
# )



