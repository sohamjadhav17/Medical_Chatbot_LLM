from src.helper import load_pdf_files, text_split, download_hugging_face_embeddings
from langchain_community.vectorstores import FAISS
from dotenv import load_dotenv
import os

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

# Determine the base directory (outside src)
base_dir = os.path.join(os.path.dirname(__file__), '..')
data_dir = os.path.join(base_dir, 'data')
faiss_dir = os.path.join(base_dir, 'faiss_index')

# Step 1: Load Data
print("Loading PDF files...")
extracted_data = load_pdf_files(data_dir)

# Step 2: Split Data into Chunks
print("Splitting data into chunks...")
text_chunks = text_split(extracted_data)

# Step 3: Download Embeddings
print("Downloading embeddings...")
embeddings = download_hugging_face_embeddings()

# Step 4: Create and Save FAISS Index
print("Creating FAISS index...")
vector_store = FAISS.from_documents(text_chunks, embeddings)
vector_store.save_local(faiss_dir)

print(f"FAISS index saved successfully at '{faiss_dir}'")


