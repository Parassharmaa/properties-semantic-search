import json
from pqdm.threads import pqdm
import requests
import os

data = json.loads(open("../data/data.json").read())


images = [f"{item['id']}_{i}" for item in data for i in item["images"].split(",")[:1]]

os.makedirs("../data/images", exist_ok=True)

image_dir = "../data/images"


def download_image(image):
    try:
        id, url = image.split("_")
        response = requests.get(url)
        file_name = url.split("/")[-1]
        with open(f"{image_dir}/{id}_{file_name}", "wb") as f:
            f.write(response.content)
    except Exception as e:
        print("Retrying", e)
        download_image(image)


pqdm(images, download_image, n_jobs=500)
