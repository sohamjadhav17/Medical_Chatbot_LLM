import fitz  # PyMuPDF

pdf_path = r'd:\Soham_Jadhav\Medical_Chatbot_LLM\data\Soham_resume.pdf'

try:
    doc = fitz.open(pdf_path)
    print(f"Total pages: {len(doc)}")
    for i in range(min(10, len(doc))):
        text = doc[i].get_text()
        print(f"Page {i} text length: {len(text)}")
        if len(text) > 0:
            print(f"Page {i} snippet: {text[:100].strip()}")
    doc.close()
except Exception as e:
    print(f"Error: {e}")
