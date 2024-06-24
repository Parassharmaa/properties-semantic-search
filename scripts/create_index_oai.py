from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance
from sentence_transformers import SentenceTransformer
import json
import numpy as np
from tqdm import tqdm
import torch.backends
import torch.backends.mps
import torch.mps
from openai import OpenAI
import os

import dotenv

dotenv.load_dotenv()

client = OpenAI()


data = json.loads(open("../data/data.json").read())


to_embed = [
    f"""About: {item['description']} Address: f{item['formatted_address']} Bedrooms: {item['bedrooms']} Bathrooms: {item['bathrooms']} Price: Pound {item['price']}"""
    for item in data
]

vectors = []


batch_size = 2048
for i in tqdm(range(0, len(to_embed), batch_size)):
    batch = to_embed[i : i + batch_size]
    response = client.embeddings.create(input=batch, model="text-embedding-3-small")
    vectors.extend([r.embedding for r in response.data])

np.save("properties_vector_oai.npy", vectors, allow_pickle=False)
