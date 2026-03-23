import fitz  # PyMuPDF
import sys
import os

def extract_text(pdf_path, output_path):
    print(f"Extracting {pdf_path}")
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"Saved to {output_path}")

if __name__ == "__main__":
    docs_dir = r"f:\Shubham\2026\crop-satellite\refer-docs"
    pdfs = ["CROP CLASSIFICATION USING SATELLITE IMAGES FULL REPORT PDF.pdf", "CROP CLASSIFICATION USING SATELLITE IMAGES PDF.pdf"]
    for pdf in pdfs:
        in_path = os.path.join(docs_dir, pdf)
        out_path = os.path.join(docs_dir, pdf.replace(".pdf", ".txt"))
        if os.path.exists(in_path):
            extract_text(in_path, out_path)
