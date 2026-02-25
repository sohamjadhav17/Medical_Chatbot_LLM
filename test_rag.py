from src.rag_chain import rag_chain

def main():
    print("--- Medical Chatbot (Resume Testing Phase) ---")
    print("Type 'exit' or 'quit' to stop.")
    
    while True:
        user_input = input("\nYou: ")
        
        if user_input.lower() in ['exit', 'quit']:
            break
            
        if not user_input.strip():
            continue
            
        print("\nBot is thinking...")
        try:
            response = rag_chain.invoke(user_input)
            print(f"\nBot: {response}")
        except Exception as e:
            print(f"\nError: {e}")

if __name__ == "__main__":
    main()
