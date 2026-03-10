import fitz  # PyMuPDF
import sys
import io

# Set stdout to use UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def extract_page_text(pdf_path, page_num):
    try:
        # Open the PDF file
        doc = fitz.open(pdf_path)
        
        # Check if the page number is within range
        if page_num < 1 or page_num > len(doc):
            return f"Error: Page number {page_num} is out of range. The PDF has {len(doc)} pages."
        
        # Get the specific page (zero-indexed)
        page = doc[page_num - 1]
        
        # Extract text from the page
        text = page.get_text()
        
        if not text.strip():
            return f"Page {page_num} seems to be an image or contains no text."
            
        return text
    except Exception as e:
        return f"An error occurred: {str(e)}"

if __name__ == "__main__":
    pdf_file = r"d:\App\Oncampus\빅데이터 엑셀_optimize.pdf"
    
    for target_page in range(8, 26):
        print(f"--- Page {target_page} ---")
        result = extract_page_text(pdf_file, target_page)
        print(result)
        print("\n")



