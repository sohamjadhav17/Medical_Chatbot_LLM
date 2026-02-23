from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from typing import List
from langchain_core.documents import Document

# Extract text from pdf
def load_pdf_files(data_path: str):
    loader = DirectoryLoader(
        data_path,
        glob="*.pdf",
        loader_cls=PyPDFLoader
    )
    documents = loader.load()
    return documents

# Chunking logic
def text_split(docs: List[Document]):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500, # Increased slightly for better context
        chunk_overlap=50
    )
    return text_splitter.split_documents(docs)

# Download embeddings
def download_hugging_face_embeddings():
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        encode_kwargs={"normalize_embeddings": True}
    )
    return embeddings
