from qdrant_client import QdrantClient
from qdrant_client.models import Distance, PointStruct, VectorParams
from dotenv import load_dotenv
import os
import cohere
import requests
import trafilatura
import xml.etree.ElementTree as ET

load_dotenv()

qdrant_url = os.getenv("QDRANT_URL")
qdrant_api_key = os.getenv("QDRANT_API_KEY")
sitemap_url = "https://rag-robotics-hackathon.vercel.app/sitemap.xml"  # works only with deployed url
cohere_api_key = os.getenv("COHERE_API_KEY")
qdrant_collection_name = os.getenv("QDRANT_COLLECTION_NAME")

cohere_client = cohere.Client(cohere_api_key)
embed_model = "embed-english-v3.0"

# Connection with Qdrant Cloud
qdrant = QdrantClient(url=qdrant_url, api_key=qdrant_api_key)
print("qdrant:", qdrant)

# ------------------------------------- Extract URLs from sitemap -------------------------------------
def get_all_urls(sitemap_url):
    xml = requests.get(sitemap_url).text
    root = ET.fromstring(xml)

    urls = []
    for child in root:
        loc_tag = child.find("{http://www.sitemaps.org/schemas/sitemap/0.9}loc")
        if loc_tag is not None:
            urls.append(loc_tag.text)

    print("\nFOUND URLS:")
    for u in urls:
        print(" -", u)

    return urls


# ------------------------------------- Step 2 — Download page + extract text -------------------------------------
def extract_text_from_url(url):
    html = requests.get(url).text
    text = trafilatura.extract(html)

    if not text:
        print("[WARNING] No text extracted from:", url)

    return text


# ------------------------------------- Step 3 — Chunk the text -------------------------------------
def chunk_text(text, max_chars=4000):
    chunks = []
    while len(text) > max_chars:
        split_pos = text[:max_chars].rfind(". ")
        if split_pos == -1:
            split_pos = max_chars
        chunks.append(text[:split_pos])
        text = text[split_pos:]
    chunks.append(text)
    return chunks


# -------------------------------------
# Step 4 — Create embedding
# -------------------------------------
def embed(text):
    response = cohere_client.embed(
        model=embed_model,
        input_type="search_query",  # Use search_query for queries
        texts=[text],
    )
    return response.embeddings[0]  # Return the first embedding


# -------------------------------------
# Step 5 — Store in Qdrant
# -------------------------------------
def create_collection():
    print("\nCreating Qdrant collection...")
    if not qdrant.collection_exists(qdrant_collection_name):
        qdrant.create_collection(
            collection_name=qdrant_collection_name,
            vectors_config=VectorParams(
                size=1024,  # Cohere embed-english-v3.0 dimension
                distance=Distance.COSINE,
            ),
        )
        print("Collection created:", qdrant_collection_name)


def save_chunk_to_qdrant(chunk, chunk_id, url):
    vector = embed(chunk)

    qdrant.upsert(
        collection_name=qdrant_collection_name,
        points=[
            PointStruct(
                id=chunk_id,
                vector=vector,
                payload={"url": url, "text": chunk, "chunk_id": chunk_id},
            )
        ],
    )


# ------------------------------------- MAIN INGESTION PIPELINE -------------------------------------
def ingest_book():
    urls = get_all_urls(sitemap_url)

    create_collection()

    global_id = 1

    for url in urls:
        print("\nProcessing:", url)
        text = extract_text_from_url(url)

        if not text:
            continue

        chunks = chunk_text(text)

        for ch in chunks:
            save_chunk_to_qdrant(ch, global_id, url)
            print(f"Saved chunk {global_id}")
            global_id += 1

    print("\n✔️ Ingestion completed!")
    print("Total chunks stored:", global_id - 1)


ingest_book()

# ----------------------------------- this file will run to ingest the data ONLY ONCE -----------------------------------
