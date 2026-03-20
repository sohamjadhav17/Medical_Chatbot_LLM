import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

class Config:
    # NextAuth signs JWT tokens using this secret. Ensure your .env matches Next.js NEXTAUTH_SECRET.
    NEXTAUTH_SECRET = os.getenv("NEXTAUTH_SECRET", "default_secret_for_development_change_me")
    DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'chat_memory.db')
    
    # Model Config
    MODEL_NAME = os.getenv("MODEL_NAME", "gemini-2.5-flash")
    TEMPERATURE = float(os.getenv("TEMPERATURE", 0.3))
    
    # Retrieval Config
    RETRIEVAL_K = int(os.getenv("RETRIEVAL_K", 3))
    
    # Memory Config
    HISTORY_LIMIT = int(os.getenv("HISTORY_LIMIT", 10))
