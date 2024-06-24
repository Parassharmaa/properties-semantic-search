import json
from pqdm.threads import pqdm
import requests
import os
from PIL import Image, ImageFile
import requests
from transformers import CLIPProcessor, CLIPModel
import torch
from tqdm import tqdm

ImageFile.LOAD_TRUNCATED_IMAGES = True

data = json.loads(open("../data/data.json").read())

# get all images files from the data/images
import os

files = os.listdir("../data/images")


images = [f"../data/images/{item['id']}.jpg" for item in data]


vectors = []

batch_size = 256

processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")

for i in tqdm(range(0, len(images), batch_size)):
    # get image embeddings
    imgs = [Image.open(img) for img in images[i : i + batch_size]]

    inputs = processor(images=imgs, return_tensors="pt", padding=True)

    with torch.no_grad():
        img_features = model.get_image_features(**inputs)
        # normalize the image features
        img_features /= img_features.norm(dim=-1, keepdim=True)
        # extend the list of vectors
        vectors.extend(img_features.tolist())

# save the vectors
import numpy as np

np.save("./image_vectors.npy", vectors, allow_pickle=False)
