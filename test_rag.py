from src.rag_chain import rag_chain
from langchain_core.messages import HumanMessage, AIMessage

def main():
    print("--- Medical Chatbot (Conversational Output) ---")
    print("Type 'exit' or 'quit' to stop.")
    
    chat_history = []
    
    while True:
        user_input = input("\nYou: ")
        
        if user_input.lower() in ['exit', 'quit']:
            break
            
        if not user_input.strip():
            continue
            
        print("\nBot is thinking...")
        try:
            response = rag_chain.invoke({
                "question": user_input, 
                "chat_history": chat_history
            })
            
            ai_message = response["answer"]
            print(f"\nBot: {ai_message}")
            
            # Print sources securely handling unicode
            print("\n--- Source Documents Debug ---")
            for i, doc in enumerate(response['context']):
                safe_text = doc.page_content[:200].encode('ascii', 'ignore').decode('ascii')
                print(f"Doc {i+1}: {safe_text}...\n")
            print("------------------------------")
            
            # Extend history so the bot context-remembers!
            chat_history.extend([
                HumanMessage(content=user_input),
                AIMessage(content=ai_message)
            ])
            
        except Exception as e:
            print(f"\nError: {e}")

if __name__ == "__main__":
    main()
