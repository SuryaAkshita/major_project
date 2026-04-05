import json
from pathlib import Path

# Get the directory where this file is located
BASE_DIR = Path(__file__).parent.parent
DATA_PATH = BASE_DIR / "data" / "cuad.json"
DEMO_DATA_PATH = BASE_DIR / "data" / "demo_msa.json"

def load_clauses():
    all_clauses = []
    
    # Load main dataset
    if DATA_PATH.exists():
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            all_clauses.extend(data["clauses"])
            
    # Load demo dataset
    if DEMO_DATA_PATH.exists():
        with open(DEMO_DATA_PATH, "r", encoding="utf-8") as f:
            demo_data = json.load(f)
            all_clauses.extend(demo_data["clauses"])
            
    if not all_clauses:
        raise FileNotFoundError("No clause data found in data directory.")
        
    return all_clauses