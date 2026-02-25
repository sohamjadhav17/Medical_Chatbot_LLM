import os
from dotenv import load_dotenv
from src.helper import download_hugging_face_embeddings
from src.prompt import system_prompt
from langchain_community.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

# Load environment variables
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(env_path)

# Determine the base directory and index location
base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
faiss_dir = os.path.join(base_dir, 'faiss_index')

# 1. Load Embeddings
embeddings = download_hugging_face_embeddings()

# 2. Load the FAISS Index
vector_store = FAISS.load_local(
    faiss_dir, 
    embeddings, 
    allow_dangerous_deserialization=True
)

# 3. Create Retriever
retriever = vector_store.as_retriever(search_kwargs={"k": 3})

# 4. Initialize Gemini LLM
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0.3
)

# 5. Define Prompt Template
prompt = ChatPromptTemplate.from_template(system_prompt)

# 6. Helper function to format documents
def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

# 7. Construct the LCEL RAG Chain
rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

# Testing the chain if run as a script
if __name__ == "__main__":
    test_query = "What is the candidate's name?"
    print(f"Testing RAG Chain with query: '{test_query}'...")
    print("Answer:", rag_chain.invoke(test_query))
