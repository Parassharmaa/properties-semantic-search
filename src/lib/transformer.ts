import {
  pipeline,
  AutoProcessor,
  CLIPVisionModelWithProjection,
  RawImage,
} from "@xenova/transformers";

export async function sentenceTransformerEncode(sentence: string) {
  const extractor = await pipeline(
    "feature-extraction",
    "Xenova/all-mpnet-base-v2"
  );

  const features = await extractor(sentence, {
    pooling: "mean",
    normalize: true,
  });

  // convert to array of numbers
  return Array.from(features.data);
}

export async function imageEncode(imageBlob: Blob): Promise<number[]> {
  const processor = await AutoProcessor.from_pretrained(
    "Xenova/clip-vit-base-patch32"
  );

  const model = await CLIPVisionModelWithProjection.from_pretrained(
    "Xenova/clip-vit-base-patch32"
  );

  const image = await RawImage.fromBlob(imageBlob);

  const image_inputs = await processor(image);

  const { image_embeds } = await model(image_inputs);

  return Array.from(image_embeds.data);
}
