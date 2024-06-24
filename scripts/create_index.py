from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance
from sentence_transformers import SentenceTransformer
import json
import numpy as np
import torch
import torch.backends
import torch.backends.mps
import torch.mps

model = SentenceTransformer(
    "all-mpnet-base-v2", device="mps" if torch.backends.mps.is_available() else "cpu"
)

data = json.loads(open("../data/data.json").read())


to_embed = [
    f"""About: {item['description']} Address: f{item['formatted_address']} Bedrooms: {item['bedrooms']} Bathrooms: {item['bathrooms']} Price: Pound {item['price']}"""
    for item in data
]

vectors = model.encode(
    [item for item in to_embed],
    show_progress_bar=True,
)

np.save("properties_vector.npy", vectors, allow_pickle=False)
