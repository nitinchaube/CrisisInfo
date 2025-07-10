import chromadb
from uuid import uuid4
import json
from sentence_transformers import SentenceTransformer
import os
import threading

# Global model instance to prevent multiple downloads
_model_instance = None
_model_lock = threading.Lock()

def get_model():
    """Get or create the global model instance"""
    global _model_instance
    if _model_instance is None:
        with _model_lock:
            if _model_instance is None:
                print("Loading sentence transformer model...")
                _model_instance = SentenceTransformer('all-MiniLM-L6-v2')
                print("Model loaded successfully")
    return _model_instance

class RAGBackend:
    def __init__(self, json_path="events.json", db_path="./chroma_db", collection_name="events"):
        self.json_path = json_path
        self.db_path = db_path
        self.collection_name = collection_name

        # Use lazy loading for model
        self._model = None
        self.similarity_threshold = 0.6  # Adjust as needed

        # Loading document store
        self.documents = self.load_or_create_json_store()

        # Initializing Chroma DB
        client = chromadb.PersistentClient(path="./chroma_db")
        self.collection = client.get_or_create_collection("events")

    @property
    def model(self):
        """Lazy load the model only when needed"""
        if self._model is None:
            self._model = get_model()
        return self._model

    def load_or_create_json_store(self):
        if os.path.exists(self.json_path):
            with open(self.json_path, "r") as f:
                return json.load(f)
        else:
            with open(self.json_path, "w") as f:
                json.dump([],f)
            return []
        
    def save_json_store(self):
        with open(self.json_path, "w") as f:
            json.dump(self.documents, f, indent=2)

    def add_document(self, event: dict):
        doc_id = str(uuid4())
        event["id"] = doc_id

        self.documents.append(event)
        self.save_json_store()

        summary = event.get("summary", "")
        self.collection.add(documents=[summary], ids=[doc_id])
        return doc_id

    def update_document(self, doc_id, new_event: dict):
        found = False
        for i, doc in enumerate(self.documents):
            if doc["id"] == doc_id:
                self.documents[i] = {**new_event, "id": doc_id}
                found = True
                break

        if not found:
            return False

        self.save_json_store()

        summary = new_event.get("summary", "")
        self.collection.update(ids=[doc_id], documents=[summary])
        return True
    
    def delete_document(self, doc_id):
        before = len(self.documents)
        self.documents = [doc for doc in self.documents if doc["id"]!=doc_id]
        after = len(self.documents)
        if before == after:
            return False
        
        self.save_json_store()
        self.collection.delete(ids=[doc_id])
        return True
    
    def search_similar_event(self, summary, top_k=1):
        embedding = self.model.encode(summary)
        results = self.collection.query(query_embeddings=[embedding], n_results=top_k)
        ids = results.get("ids", [[]])[0]
        distances = results.get("distances", [[]])[0]
        if ids and distances:
            return {"id": ids[0], "distance": distances[0]}
        return None

    def process_event(self, event: dict):
        if isinstance(event, str):
            try:
                event = json.loads(event)
                print(type(event))
            except json.JSONDecodeError:
                raise ValueError("Invalid JSON string passed to process_event")
        summary = event.get("summary", "")
        if not summary:
            raise ValueError("Event must include a summary field")

        result = self.search_similar_event(summary, top_k=1)
        print("result found:", result)

        if result and result["distance"] < self.similarity_threshold:
            self.update_document(result["id"], event)
            return {"action": "updated", "id": result["id"], "distance": result["distance"]}
        else:
            new_id = self.add_document(event)
            return {"action": "added", "id": new_id}