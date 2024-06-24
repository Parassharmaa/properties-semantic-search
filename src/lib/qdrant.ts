import { QdrantClient } from "@qdrant/js-client-rest";

const qdrant = new QdrantClient({
  url: process.env.QDRANT_HOST,
  apiKey: process.env.QDRANT_KEY,
});

export default qdrant;
