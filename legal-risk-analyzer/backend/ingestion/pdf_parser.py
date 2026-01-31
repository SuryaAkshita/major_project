import re
import io
from typing import Union
from PyPDF2 import PdfReader


def extract_text_from_pdf(file: Union[bytes, io.BytesIO, str]) -> str:
    # Handle different input types
    if isinstance(file, str):
        # File path
        with open(file, 'rb') as f:
            pdf_reader = PdfReader(f)
            text = _extract_text_from_reader(pdf_reader)
    elif isinstance(file, bytes):
        # Raw bytes
        pdf_file = io.BytesIO(file)
        pdf_reader = PdfReader(pdf_file)
        text = _extract_text_from_reader(pdf_reader)
    else:
        # File-like object (e.g., BytesIO from UploadFile)
        pdf_reader = PdfReader(file)
        text = _extract_text_from_reader(pdf_reader)
    
    # Clean the text and remove page numbers
    cleaned_text = _remove_page_numbers(text)
    
    return cleaned_text


def _extract_text_from_reader(pdf_reader: PdfReader) -> str:
    """Extracts text from all pages of a PDF reader."""
    text_parts = []
    
    for page in pdf_reader.pages:
        try:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
        except Exception:
            # Skip pages that can't be extracted
            continue
    
    return '\n'.join(text_parts)


def _remove_page_numbers(text: str) -> str:
    """
    Removes page numbers from extracted text.
    Page numbers are typically:
    - Standalone numbers at the start/end of lines
    - Patterns like "Page X" or "Page X of Y"
    - Numbers in headers/footers (often on their own lines)
    """
    if not text:
        return text
    
    lines = text.split('\n')
    cleaned_lines = []
    
    for line in lines:
        stripped = line.strip()
        
        # Skip lines that are likely page numbers
        if _is_page_number(stripped):
            continue
        
        cleaned_lines.append(line)
    
    # Join lines back together
    cleaned_text = '\n'.join(cleaned_lines)
    
    # Remove common page number patterns that might appear mid-text
    # Pattern: "Page X" or "Page X of Y"
    cleaned_text = re.sub(r'\bPage\s+\d+\s+(?:of\s+\d+)?\b', '', cleaned_text, flags=re.IGNORECASE)
    
    # Clean up multiple consecutive newlines
    cleaned_text = re.sub(r'\n{3,}', '\n\n', cleaned_text)
    
    # Remove leading/trailing whitespace
    cleaned_text = cleaned_text.strip()
    
    return cleaned_text


def _is_page_number(line: str) -> bool:
    """
    Determines if a line is likely a page number.
    
    Page numbers are typically:
    - Single numbers (1-9999 range is reasonable)
    - "Page X" patterns
    - "Page X of Y" patterns
    - Roman numerals (I, II, III, etc.) - less common but possible
    """
    if not line:
        return False
    
    # Single number (common page number format)
    if re.match(r'^\d{1,4}$', line):
        return True
    
    # Roman numeral page numbers (I, II, III, IV, etc.)
    if re.match(r'^[IVX]+$', line, re.IGNORECASE):
        return True
    
    # "Page X" or "Page X of Y" pattern
    if re.match(r'^(?:Page\s+)?\d+\s*(?:of\s+\d+)?$', line, re.IGNORECASE):
        return True
    
    # Very short lines with just a number and minimal text (e.g., "- 1 -", "1/10")
    if re.match(r'^[\-\s]*\d+[\s/\-]*\d*[\s\-]*$', line):
        return True
    
    return False

