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
        ("human", "{input}"),
    ]
)

qa_system_prompt = (
    "You are a highly professional and conservative medical assistant. "
    "Use the following pieces of retrieved medical context to answer the user's question. "
    "If you don't know the answer or if the context does not contain the answer, explicitly state that you don't know and do not hallucinate or guess. "
    "\n\nCRITICAL RULES:"
    "\n1. Never provide an official medical diagnosis or prescribe treatments."
    "\n2. Always strongly advise the user to consult a certified doctor or healthcare professional."
    "\n3. Structure your response clearly using bullet points and sections if the information is dense."
    "\n4. Add a bolded '**Disclaimer:**' at the very end of your response, reiterating the need to consult a physician for proper medical advice."
    "\n\nContext:"
    "\n{context}"
)

qa_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", qa_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
)
