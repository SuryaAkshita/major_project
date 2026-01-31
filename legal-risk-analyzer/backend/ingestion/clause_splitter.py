import re
from typing import List, Dict


def split_into_clauses(text: str) -> List[Dict[str, str]]:
    """
    Splits a legal document into clauses based on ALL CAPS headings or numbered headings.
    
    Args:
        text: The full document text to split
        
    Returns:
        A list of dictionaries, each containing:
        - clause_id: Sequential ID of the clause (starting from 1)
        - title: The detected clause title/heading
        - text: The clause content (text following the heading)
    """
    if not text or not text.strip():
        return []
    
    clauses = []
    lines = text.split('\n')
    heading_indices = []
    
    # Find all potential heading positions
    for i, line in enumerate(lines):
        stripped = line.strip()
        if not stripped:
            continue
        
        is_heading = False
        
        # 1. Entire line is ALL CAPS with at least 3 characters and contains letters
        if (len(stripped) >= 3 and 
            stripped.isupper() and 
            any(c.isalpha() for c in stripped) and
            len(stripped.split()) <= 15):  # Reasonable heading length
            is_heading = True
        
        # 2. Starts with number(s) followed by period or parenthesis
        # Examples: "1.", "2)", "1.1", "12.3.4"
        elif re.match(r'^\d+(?:\.\d+)*[\.\)]\s+[A-Z]', stripped):
            is_heading = True
        
        # 3. Starts with Roman numeral followed by period
        # Examples: "I.", "II.", "III.", "IV."
        elif re.match(r'^[IVX]+\.\s+[A-Z]', stripped):
            is_heading = True
        
        # 4. Contains common legal heading patterns
        # Examples: "ARTICLE I", "SECTION 1", "CLAUSE A", "PART II"
        elif re.search(
            r'\b(?:ARTICLE|SECTION|CLAUSE|PART|CHAPTER|APPENDIX)\s+[IVX\dA-Z]+',
            stripped,
            re.IGNORECASE
        ):
            is_heading = True
        
        if is_heading:
            heading_indices.append(i)
    
    # If no headings found, treat entire document as one clause
    if not heading_indices:
        return [{
            "clause_id": "1",
            "title": "Document",
            "text": text.strip()
        }]
    
    # Extract clauses based on heading positions
    for idx, heading_idx in enumerate(heading_indices):
        clause_id = str(idx + 1)
        title = lines[heading_idx].strip()
        
        # Determine where this clause ends (start of next clause or end of document)
        start_pos = heading_idx + 1
        if idx < len(heading_indices) - 1:
            end_pos = heading_indices[idx + 1]
        else:
            end_pos = len(lines)
        
        # Extract clause text (content following the heading)
        clause_lines = lines[start_pos:end_pos]
        clause_text = '\n'.join(clause_lines).strip()
        
        clauses.append({
            "clause_id": clause_id,
            "title": title,
            "text": clause_text
        })
    
    return clauses

