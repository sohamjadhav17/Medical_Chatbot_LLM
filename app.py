from flask import Flask, request, jsonify
from src.rag_chain import rag_chain

app = Flask(__name__)

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({"error": "No 'message' field provided in request"}), 400
        
        user_message = data['message']
        chat_history_raw = data.get('chat_history', [])
        
        from langchain_core.messages import HumanMessage, AIMessage
        chat_history = []
        for msg in chat_history_raw:
            if msg.get('role') == 'user':
                chat_history.append(HumanMessage(content=msg.get('content')))
            elif msg.get('role') == 'assistant':
                chat_history.append(AIMessage(content=msg.get('content')))
        
        # Call the RAG chain
        response = rag_chain.invoke({
            "question": user_message, 
            "chat_history": chat_history
        })
        
        # Safely extract answer and sources
        answer = response.get('answer', "I don't know.")
        source_docs = response.get('context', [])
        
        # Format source documents for JSON serialization
        sources = [
            {
                "content": doc.page_content,
                "metadata": doc.metadata
            }
            for doc in source_docs
        ]
        
        return jsonify({
            "answer": answer,
            "sources": sources
        }), 200
        
    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True)