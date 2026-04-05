import os
import json
from dotenv import load_dotenv
from rag.rag_pipeline import build_vector_store
from rag.retriever import Retriever
from google import genai

load_dotenv()


class ClauseAgent:
    def __init__(self):
        # Load API key
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY not set in .env file")
        
        # Build RAG components ONCE
        self.vector_store = build_vector_store()
        self.retriever = Retriever(self.vector_store)
        
        # Gemini client with API key
        self.client = genai.Client(api_key=api_key)
    
    def process(self, clause_text: str):
        # 1️⃣ Retrieve similar clauses
        similar_clauses = self.retriever.retrieve(clause_text, k=3)
        
        # Format retrieved clauses for prompt
        retrieved_context = ""
        for idx, c in enumerate(similar_clauses, start=1):
            retrieved_context += (
                f"{idx}. Clause Type: {c['clause_type']}\n"
                f"   Text: {c['text']}\n"
                f"   Severity: {c['severity']}\n\n"
            )
        
        # 2️⃣ Build Gemini prompt
        prompt = f"""
You are a legal AI assistant.

User Clause:
\"\"\"{clause_text}\"\"\"

Here are similar clauses from a legal dataset:
{retrieved_context}

Tasks:
1. Identify the clause type.
2. Provide a clear, human-readable explanation of the clause.
3. Output ONLY valid JSON with keys: type, explanation.
"""
        
        try:
            
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            
            # 4️⃣ Parse Gemini response safely
            raw_text = response.text.strip()
            
            # Remove code fences if present
            if raw_text.startswith("```"):
                raw_text = raw_text.strip()
                if raw_text.startswith("```json"):
                    raw_text = raw_text[7:]
                elif raw_text.startswith("```"):
                    raw_text = raw_text[3:]
                if raw_text.endswith("```"):
                    raw_text = raw_text[:-3]
                raw_text = raw_text.strip()
            
            data = json.loads(raw_text)
            
            return {
                "type": data["type"],
                "explanation": data["explanation"],
                "retrieved_clauses": [
                    {
                        "id": c["id"],
                        "clause_type": c["clause_type"],
                        "severity": c["severity"],
                        "text": c["text"]
                    } for c in similar_clauses
                ]
            }
        
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON from Gemini: {e}")
            print(f"Raw output was: {raw_text}")
            raise
        except Exception as e:
            print(f"Error calling Gemini API: {e}")
            raise