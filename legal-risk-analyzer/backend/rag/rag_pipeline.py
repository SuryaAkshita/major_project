from rag.data_loader import load_clauses
from rag.embedder import embed_texts
from rag.vector_store import VectorStore

def build_vector_store():
    clauses = load_clauses()
    texts = [c["text"] for c in clauses]

    embeddings = embed_texts(texts)
    store = VectorStore(dim=len(embeddings[0]))
    store.add(embeddings, clauses)

    return store