import os

folders = [
    "legal-risk-analyzer/backend/api",
    "legal-risk-analyzer/backend/agents",
    "legal-risk-analyzer/backend/ingestion",
    "legal-risk-analyzer/backend/rag",
    "legal-risk-analyzer/backend/models",
    "legal-risk-analyzer/backend/services",
    "legal-risk-analyzer/backend/config",

    "legal-risk-analyzer/frontend/legal-ui/public",
    "legal-risk-analyzer/frontend/legal-ui/src/pages",
    "legal-risk-analyzer/frontend/legal-ui/src/components",
    "legal-risk-analyzer/frontend/legal-ui/src/api",
]

files = [
    "legal-risk-analyzer/backend/api/main.py",

    "legal-risk-analyzer/backend/agents/__init__.py",
    "legal-risk-analyzer/backend/agents/controller_agent.py",
    "legal-risk-analyzer/backend/agents/clause_agent.py",
    "legal-risk-analyzer/backend/agents/risk_agent.py",
    "legal-risk-analyzer/backend/agents/compliance_agent.py",
    "legal-risk-analyzer/backend/agents/multilingual_agent.py",

    "legal-risk-analyzer/backend/ingestion/__init__.py",
    "legal-risk-analyzer/backend/ingestion/pdf_parser.py",
    "legal-risk-analyzer/backend/ingestion/docx_parser.py",
    "legal-risk-analyzer/backend/ingestion/clause_splitter.py",

    "legal-risk-analyzer/backend/rag/__init__.py",
    "legal-risk-analyzer/backend/rag/embeddings.py",
    "legal-risk-analyzer/backend/rag/indexer.py",
    "legal-risk-analyzer/backend/rag/retriever.py",

    "legal-risk-analyzer/backend/models/__init__.py",
    "legal-risk-analyzer/backend/models/clause.py",
    "legal-risk-analyzer/backend/models/risk.py",
    "legal-risk-analyzer/backend/models/response.py",

    "legal-risk-analyzer/backend/services/__init__.py",
    "legal-risk-analyzer/backend/services/file_service.py",
    "legal-risk-analyzer/backend/services/agent_service.py",

    "legal-risk-analyzer/backend/config/settings.py",
    "legal-risk-analyzer/backend/requirements.txt",
    "legal-risk-analyzer/backend/README.md",

    "legal-risk-analyzer/frontend/legal-ui/src/App.jsx",
    "legal-risk-analyzer/frontend/legal-ui/src/main.jsx",
    "legal-risk-analyzer/frontend/legal-ui/src/index.css",

    "legal-risk-analyzer/frontend/legal-ui/index.html",
    "legal-risk-analyzer/frontend/legal-ui/package.json",
    "legal-risk-analyzer/frontend/legal-ui/vite.config.js",

    "legal-risk-analyzer/.gitignore",
    "legal-risk-analyzer/README.md",
]

for folder in folders:
    os.makedirs(folder, exist_ok=True)

for file in files:
    if not os.path.exists(file):
        open(file, "w").close()

print("✅ Legal Risk Analyzer folder structure created successfully.")