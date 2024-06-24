from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance
import dotenv
import numpy as np
import json

dotenv.load_dotenv()

import os

import sys

if __name__ == "__main__":

    client = QdrantClient(os.getenv("QDRANT_HOST"), api_key=os.getenv("QDRANT_KEY"))
    # get the collection name from the command line

    collection_name = sys.argv[1]
    index_path = sys.argv[2]

    if client.collection_exists(collection_name):
        client.delete_collection(collection_name)

    vectors = np.load(index_path)

    client.create_collection(
        collection_name,
        vectors_config=VectorParams(size=vectors.shape[1], distance=Distance.COSINE),
    )

    payload = json.load(open("../data/data.json"))

    client.upload_collection(
        collection_name=collection_name,
        vectors=vectors,
        payload=payload,
        ids=None,
        batch_size=256,
    )
