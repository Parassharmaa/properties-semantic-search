import { PropertyData } from "@/types";
import jsonData from "../../../../data/data.json";
import qdrant from "@/lib/qdrant";
import OpenAI from "openai";
import { imageEncode } from "@/lib/transformer";

const openai = new OpenAI();

export async function POST(req: Request): Promise<Response> {
  const body = await req.json();

  if (body.image) {
    const imageBase64 = body.image;
    // convert base64 to blob

    const imageBlob = await fetch(imageBase64).then((res) => res.blob());

    const embedding = await imageEncode(imageBlob);

    const results = await qdrant.search("properties_images", {
      vector: embedding,
      limit: 20,
      score_threshold: 0.7,
      consistency: "majority",
    });

    const data = results?.map((item) => item.payload) as any as PropertyData[];

    return Response.json(data);
  } else if (body.query) {
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: body.query,
      encoding_format: "float",
    });

    const results = await qdrant.search("properties_oai", {
      vector: embedding.data[0].embedding,
      limit: 20,
      score_threshold: 0.2,
      consistency: "majority",
    });

    const data = results?.map((item) => item.payload) as any as PropertyData[];

    return Response.json(data);
  }

  const data = jsonData as PropertyData[];
  return Response.json(data?.slice(0, 50));
}
