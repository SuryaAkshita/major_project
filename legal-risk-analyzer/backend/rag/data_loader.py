import json
from pathlib import Path

# Get the directory where this file is located
BASE_DIR = Path(__file__).parent.parent
DATA_PATH = BASE_DIR / "data" / "cuad.json"

def load_clauses():
    if not DATA_PATH.exists():
        raise FileNotFoundError(f"Data file not found at {DATA_PATH}")
    
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data["clauses"]