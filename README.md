# Property Search App
Search using natural language or image for properties in the UK.


### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.


### Create Search Index

```bash
cd scripts/

python3 create_index_oai.py

python3 create_image_index.py

python3 save_vector_db.py <collection_name> <index_path> # e.g. python3 save_vector_db.py properties_oai properties_vector_oai.npy
```


