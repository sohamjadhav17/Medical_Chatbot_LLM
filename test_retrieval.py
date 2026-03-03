from src.rag_chain import rag_chain

def test_query(query_type, query_text):
    print(f"\n[{query_type}]")
    print(f"Query: '{query_text}'")
    response = rag_chain.invoke(query_text)
    print(f"Answer: {response['answer']}")
    print(f"Answers retrieved: {len(response['source_documents'])}")
    if response['source_documents']:
        safe_text = response['source_documents'][0].page_content[:150].replace('\n', ' ').encode('ascii', 'ignore').decode('ascii')
        print(f"Top Source Snippet: {safe_text}...")
    print("-" * 50)

if __name__ == "__main__":
    print("=== Phase 1: Retrieval Testing ===")
    
    # 1. Exact query retrieval
    test_query(
        "Exact Query",
        "What are the common symptoms of allergies?"
    )
    
    # 2. Similar wording retrieval
    test_query(
        "Similar Wording",
        "Could you list the symptoms someone might have if they get an allergic reaction?"
    )
    
    # 3. Out-of-context handling
    test_query(
        "Out of Context",
        "Who won the 2022 FIFA World Cup?"
    )
