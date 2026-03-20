from flask import Flask, request, jsonify
from src.rag_chain import rag_chain
from src.db import init_db, ensure_user, get_or_create_conversation, create_conversation, save_message, get_chat_history
from src.auth_middleware import token_required
from src.config import Config
from langchain_core.messages import HumanMessage, AIMessage
import time
import logging

# Configure basic logging for metrics and errors
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Initialize database tables
init_db()

@app.route('/chat', methods=['POST'])
@token_required
def chat(user_id, user_email):
    try:
        data = request.get_json()
        if not data:
            logger.warning(f"Empty payload from user {user_id}")
            return jsonify({"error": "Empty payload provided"}), 400
            
        user_message = data.get('message', '').strip()
        if not user_message:
            logger.warning(f"Empty message from user {user_id}")
            return jsonify({"error": "No 'message' field provided or message is empty"}), 400
        
        # Conversation switching support
        client_conv_id = data.get('conversation_id')
        new_conv = data.get('new_conversation', False)
        
        try:
            # Ensure user exists in our DB
            ensure_user(user_id, user_email)
            if new_conv:
                conversation_id = create_conversation(user_id)
            else:
                conversation_id = get_or_create_conversation(user_id, client_conv_id)
            
            # Fetch last N messages for context using config metric
            chat_history_raw = get_chat_history(conversation_id, limit=Config.HISTORY_LIMIT)
        except Exception as db_err:
            logger.error(f"Database error for user {user_id}: {db_err}")
            return jsonify({"error": "Failed to access conversation history."}), 500
        
        # Convert DB roles to LangChain models
        chat_history = []
        for msg in chat_history_raw:
            if msg['role'] == 'user':
                chat_history.append(HumanMessage(content=msg['content']))
            elif msg['role'] == 'assistant':
                chat_history.append(AIMessage(content=msg['content']))
        
        logger.info(f"User {user_id} - Conv {conversation_id} - Query: {user_message[:50]}...")
        
        start_time = time.time()
        
        # Call the RAG chain
        try:
            response = rag_chain.invoke({
                "input": user_message, 
                "chat_history": chat_history
            })
        except Exception as llm_err:
            logger.error(f"LLM/RAG error for user {user_id}: {llm_err}")
            return jsonify({"error": "Failed to generate answer from the AI model."}), 500
            
        end_time = time.time()
        response_time = round(end_time - start_time, 2)
        
        # Safely extract answer and sources
        answer = response.get('answer', "I don't know.")
        source_docs = response.get('context', [])
        
        logger.info(f"User {user_id} - Conv {conversation_id} - ResponseTime: {response_time}s")
        
        # Store user message and bot answer in DB
        try:
            save_message(conversation_id, 'user', user_message)
            save_message(conversation_id, 'assistant', answer)
        except Exception as db_err:
            logger.error(f"Failed to save messages for user {user_id}: {db_err}")
        
        # Format source documents for JSON serialization
        sources = [
            {"content": doc.page_content, "metadata": doc.metadata}
            for doc in source_docs
        ]
        
        return jsonify({
            "answer": answer,
            "sources": sources,
            "conversation_id": conversation_id,
            "response_time_seconds": response_time
        }), 200
        
    except Exception as e:
        logger.error(f"Unexpected error processing request: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True)