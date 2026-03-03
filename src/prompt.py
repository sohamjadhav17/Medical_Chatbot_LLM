from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

contextualize_q_system_prompt = (
    "Given a chat history and the latest user question "
    "which might reference context in the chat history, "
    "formulate a standalone question which can be understood "
    "without the chat history. Do NOT answer the question, "
    "just reformulate it if needed and otherwise return it as is."
)

contextualize_q_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", contextualize_q_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{question}"),
    ]
)

qa_system_prompt = (
    "You are a professional medical assistant. "
    "Use the following pieces of retrieved medical context to answer the user's question. "
    "If you don't know the answer or if the context does not contain the answer, say that you don't know and do not hallucinate or make up information. "
    "Always advise the user to consult a doctor or healthcare professional for a proper medical diagnosis. "
    "Use three sentences maximum and keep the answer concise."
    "\n\n"
    "{context}"
)

qa_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", qa_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{question}"),
    ]
)
