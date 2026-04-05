from google import genai
import os
from dotenv import load_dotenv
import json

load_dotenv()

class MultilingualAgent:
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    def translate(self, text: str, target_language: str, context: list = None):
        """
        Translates legal text to the target language using provided context.
        """
        
        context_str = ""
        if context:
            for i, c in enumerate(context, 1):
                context_str += f"Clause {i} ({c.get('clause_type', 'Legal')}):\n{c.get('text', '')}\n\n"

        if context_str:
            translation_section = f"LEGAL CONTEXT TO TRANSLATE:\n{context_str}"
        else:
            translation_section = f"TEXT TO TRANSLATE:\n{text}"

        prompt = f"""
You are a professional legal translator.

USER REQUEST: "{text}"
TARGET LANGUAGE: {target_language}

{translation_section}

TASKS:
1. If 'LEGAL CONTEXT' is provided, translate the specific clause(s) the user is asking for in their request.
2. If the user request is a general command (e.g., "translate this to Hindi"), translate the core legal content provided in the context.
3. If no context is provided, translate the user request itself.
4. Preserve all legal terminology and professional tone.
5. Provide a brief summary of the translated content in the target language.

Output ONLY valid JSON:
{{
  "translated_text": "...",
  "summary": "..."
}}
"""

        try:
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )

            raw = response.text.strip()
            # Remove code fences if present
            raw = raw.replace("```json", "").replace("```", "").strip()
            
            return json.loads(raw)
        except Exception as e:
            print(f"Error in MultilingualAgent: {e}")
            return {
                "translated_text": "Translation failed.",
                "summary": str(e)
            }
