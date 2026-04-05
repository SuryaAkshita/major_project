from google import genai
import os
from dotenv import load_dotenv
from agents.clause_agent import ClauseAgent
from agents.risk_agent import RiskAgent
from agents.compliance_agent import ComplianceAgent
from agents.multilingual_agent import MultilingualAgent
import json
import re
import time

load_dotenv()

class ControllerAgent:
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

        # Initialize sub-agents
        self.clause_agent = ClauseAgent()
        self.risk_agent = RiskAgent()
        self.compliance_agent = ComplianceAgent()
        self.multilingual_agent = MultilingualAgent()

    def _detect_intent_and_language(self, user_prompt: str):
        """
        Uses Gemini to detect what the user wants and extract target language if needed.
        """
        prompt = f"""
        You are an AI intent router for a Legal Assistant. 
        Your job is to decide which tool to trigger based on the user's request.

        USER REQUEST: "{user_prompt}"

        INTENT OPTIONS:
        1. "translation": Use this if the user asks to translate, needs text in another language, or mentions a language (Telugu, Hindi, Spanish, etc.).
        2. "risk_analysis": Use this if the user specifically asks about risks, safety, or issues.
        3. "compliance_analysis": Use this if the user asks about legality, compliance, or regulations.
        4. "full_analysis": Use this if the user wants a complete analysis.
        5. "clause_analysis": Use this for general meanings, definitions, or understanding (Default).

        DEMO CONTEXT PRIORITY:
        The current demo focuses on a Master Service Agreement (MSA) between AlphaNova Technologies and Orion Healthcare.
        Key items: 1.5% late interest, 5-year confidentiality, 72h breach notification (DPDP 2023), IP ownership, 12-month liability cap.

        If intent is "translation", extract "language". Otherwise, "language" is null.

        Output ONLY a JSON object: {{"intent": "...", "language": "..."}}
        """

        try:
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            raw = response.text.strip()
            match = re.search(r'\{.*\}', raw, re.DOTALL)
            if match:
                data = json.loads(match.group())
                return data.get("intent", "clause_analysis"), data.get("language")
        except Exception as e:
            print(f"Intent detection error: {e}")
        
        # Fallback to translation if any language keywords are in text
        languages = ["telugu", "hindi", "spanish", "french", "german", "tamil", "kannada", "bengali", "marathi"]
        if any(lang in user_prompt.lower() for lang in languages) or "translate" in user_prompt.lower():
            for lang in languages:
                if lang in user_prompt.lower():
                    return "translation", lang.capitalize()
            return "translation", "English"

        return "clause_analysis", None

    def handle(self, user_prompt: str):
        """
        Main orchestration method.
        """
        try:
            start = time.perf_counter()
            intent, language = self._detect_intent_and_language(user_prompt)
            timings_ms = {}

            result = {
                "intent": intent,
                "triggered_agent": "ClauseAgent",
                "clause_analysis": None,
                "risk_analysis": None,
                "compliance_analysis": None,
                "translation": None,
                "error": None,
                "metrics": {
                    "k_value": 3,
                    "agent_timings_ms": {}
                }
            }

            # 1️⃣ Translation Flow
            if intent == "translation":
                result["triggered_agent"] = "MultilingualAgent"
                # Always get context for legal accuracy
                clause_start = time.perf_counter()
                context_output = self.clause_agent.process(user_prompt)
                timings_ms["clause_agent"] = round((time.perf_counter() - clause_start) * 1000, 2)
                translation_start = time.perf_counter()
                result["translation"] = self.multilingual_agent.translate(
                    user_prompt, 
                    language, 
                    context_output.get("retrieved_clauses", [])
                )
                timings_ms["multilingual_agent"] = round((time.perf_counter() - translation_start) * 1000, 2)
                result["metrics"]["agent_timings_ms"] = timings_ms
                result["metrics"]["total_latency_ms"] = round((time.perf_counter() - start) * 1000, 2)
                return result

            # 2️⃣ Standard Analysis Flow
            clause_start = time.perf_counter()
            clause_output = self.clause_agent.process(user_prompt)
            timings_ms["clause_agent"] = round((time.perf_counter() - clause_start) * 1000, 2)
            result["clause_analysis"] = {
                "type": clause_output.get("type", "Legal Provision"),
                "explanation": clause_output.get("explanation", "Analyzing document...")
            }
            retrieved = clause_output.get("retrieved_clauses", [])

            # 3️⃣ Advanced Triggering
            if intent in ["risk_analysis", "full_analysis"]:
                result["triggered_agent"] = "RiskAgent" if intent == "risk_analysis" else "Legal Orchestrator"
                risk_start = time.perf_counter()
                result["risk_analysis"] = self.risk_agent.assess(user_prompt, retrieved)
                timings_ms["risk_agent"] = round((time.perf_counter() - risk_start) * 1000, 2)

            if intent in ["compliance_analysis", "full_analysis"]:
                result["triggered_agent"] = "ComplianceAgent" if intent == "compliance_analysis" else "Legal Orchestrator"
                compliance_start = time.perf_counter()
                result["compliance_analysis"] = self.compliance_agent.check(user_prompt, retrieved)
                timings_ms["compliance_agent"] = round((time.perf_counter() - compliance_start) * 1000, 2)

            result["metrics"]["agent_timings_ms"] = timings_ms
            result["metrics"]["total_latency_ms"] = round((time.perf_counter() - start) * 1000, 2)
            return result

        except Exception as e:
            return {
                "error": str(e),
                "triggered_agent": "System Error",
                "intent": "error",
                "metrics": {
                    "k_value": 3,
                    "agent_timings_ms": {},
                    "total_latency_ms": None
                }
            }
