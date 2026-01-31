from google import genai
import os
from dotenv import load_dotenv
import json

load_dotenv()

class MultilingualAgent:
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    def translate(self, text: str, target_language: str):
        """
        Translates legal text to the target language.
        """
        prompt = f"""
You are a professional legal translator.

Text to translate:
\"\"\"{text}\"\"\"

Target Language: {target_language}

Tasks:
1. Translate the legal text accurately while preserving legal terminology and context.
2. Provide a brief summary of the translated text in the target language.
3. Output ONLY valid JSON with keys: translated_text, summary.
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
