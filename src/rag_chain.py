import os
from dotenv import load_dotenv
from src.helper import download_hugging_face_embeddings
from src.prompt import contextualize_q_prompt, qa_prompt
from langchain_community.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain

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

# 5. Construct Conversational RAG Components
history_aware_retriever = create_history_aware_retriever(
    llm, retriever, contextualize_q_prompt
)

question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)

rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

# Testing the chain if run as a script
if __name__ == "__main__":
    test_query = "What are the common symptoms of allergies?"
    print(f"Testing Conversational RAG Chain with query: '{test_query}'...")
    response = rag_chain.invoke({"question": test_query, "chat_history": []})
    print("Answer:", response["answer"])
    print(f"Retrieved {len(response['context'])} documents.")
