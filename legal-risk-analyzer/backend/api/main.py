from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agents.controller_agent import ControllerAgent
from ingestion.pdf_parser import extract_text_from_pdf
from ingestion.docx_parser import extract_text_from_docx


app = FastAPI(title="Legal Risk Analyzer API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize controller once
controller_agent = ControllerAgent()


# ---------- MODELS ----------
class AnalyzeRequest(BaseModel):
    text: str


# ---------- ROUTES ----------

@app.get("/")
async def root():
    return {"status": "Legal Risk Analyzer API running"}


@app.post("/analyze")
async def analyze_text(req: AnalyzeRequest):
    """
    Analyze or translate pasted text using ControllerAgent
    """
    try:
        result = controller_agent.handle(req.text)
        return result
    except Exception as e:
        return {"error": str(e)}


@app.post("/analyze-upload")
async def analyze_upload(file: UploadFile = File(...)):
    """
    Analyze or translate uploaded PDF or DOCX
    """
    try:
        content = await file.read()

        if file.filename.lower().endswith(".pdf"):
            text = extract_text_from_pdf(content)
        elif file.filename.lower().endswith(".docx"):
            text = extract_text_from_docx(content)
        else:
            return {"error": "Unsupported file type. Upload PDF or DOCX only."}

        result = controller_agent.handle(text)
        return result
    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
