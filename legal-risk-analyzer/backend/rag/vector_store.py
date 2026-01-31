import faiss
import numpy as np

class VectorStore:
    def __init__(self, dim):
        self.index = faiss.IndexFlatL2(dim)
        self.metadata = []

    def add(self, embeddings, metadata):
        self.index.add(np.array(embeddings).astype("float32"))
        self.metadata.extend(metadata)

    def search(self, query_embedding, k=5):
        distances, indices = self.index.search(
            query_embedding.reshape(1, -1).astype("float32"), k
        )
        return [self.metadata[i] for i in indices[0]]