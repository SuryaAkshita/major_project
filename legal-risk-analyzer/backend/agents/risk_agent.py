from google import genai
from dotenv import load_dotenv
import json
import os
load_dotenv()

class RiskAgent:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY not set in .env file")

        self.client = genai.Client(api_key=api_key)

    def assess(self, clause_text: str, retrieved_clauses: list):
        """
        clause_text: original clause text
        retrieved_clauses: output from ClauseAgent (RAG results)
        """

        # Build context from retrieved clauses
        risk_context = ""
        for c in retrieved_clauses:
            risk_context += (
                f"- Severity: {c['severity']}, "
                f"Clause Type: {c['clause_type']}\n"
            )

        prompt = f"""
You are a legal risk analysis expert.

Clause:
\"\"\"{clause_text}\"\"\"

Similar clauses and their risk levels:
{risk_context}

Tasks:
1. Assess the overall risk level (low, medium, high, critical).
2. Explain why this clause is risky or safe.
3. Suggest one mitigation or precaution.
In less than 100 words,
Output ONLY valid JSON with keys:
risk_level, explanation, mitigation
"""

        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        raw = response.text.strip()
        raw = raw.replace("```json", "").replace("```", "").strip()

        return json.loads(raw)
