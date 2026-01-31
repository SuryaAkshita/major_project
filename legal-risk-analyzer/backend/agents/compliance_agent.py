from google import genai
from dotenv import load_dotenv
import os
import json

load_dotenv()

class ComplianceAgent:
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    def check(self, clause_text: str, retrieved_clauses: list):
        """
        clause_text: original clause text
        retrieved_clauses: RAG results from ClauseAgent
        """

        # Build compliance context
        compliance_context = ""
        for c in retrieved_clauses:
            compliance_context += (
                f"- Clause Type: {c['clause_type']}, "
                f"Severity: {c['severity']}\n"
            )

        prompt = f"""
You are a legal compliance expert.

Clause:
\"\"\"{clause_text}\"\"\"

Related legal patterns from similar clauses:
{compliance_context}

Tasks:
1. Identify relevant laws or regulations that may apply.
2. Assess whether the clause appears compliant, partially compliant, or non-compliant.
3. Explain the compliance concerns clearly.
4. Suggest one compliance improvement.

Output ONLY valid JSON with keys:
applicable_laws, compliance_status, explanation, recommendation
"""

        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        raw = response.text.strip()
        raw = raw.replace("```json", "").replace("```", "").strip()

        return json.loads(raw)
