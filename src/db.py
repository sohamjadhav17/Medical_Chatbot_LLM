import sqlite3
from datetime import datetime
from src.config import Config

def get_db_connection():
    conn = sqlite3.connect(Config.DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT,
        created_at TIMESTAMP
    )
    ''')
    
    # Create conversations table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        created_at TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
    ''')
    
    # Create messages table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id INTEGER,
        role TEXT,
        content TEXT,
        timestamp TIMESTAMP,
        FOREIGN KEY(conversation_id) REFERENCES conversations(id)
    )
    ''')
    
    conn.commit()
    conn.close()

def ensure_user(user_id, email=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE id = ?", (user_id,))
    if not cursor.fetchone():
        cursor.execute(
            "INSERT INTO users (id, email, created_at) VALUES (?, ?, ?)",
            (user_id, email, datetime.utcnow())
        )
        conn.commit()
    conn.close()

def create_conversation(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO conversations (user_id, created_at) VALUES (?, ?)", (user_id, datetime.utcnow()))
    conn.commit()
    conversation_id = cursor.lastrowid
    conn.close()
    return conversation_id

def get_or_create_conversation(user_id, conversation_id=None):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if conversation_id is not None:
        cursor.execute("SELECT id FROM conversations WHERE id = ? AND user_id = ?", (conversation_id, user_id))
        if cursor.fetchone():
            conn.close()
            return conversation_id
            
    # Find the most recent conversation for the user
    cursor.execute(
        "SELECT id FROM conversations WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
        (user_id,)
    )
    row = cursor.fetchone()
    if row:
        conv_id = row['id']
    else:
        cursor.execute(
            "INSERT INTO conversations (user_id, created_at) VALUES (?, ?)",
            (user_id, datetime.utcnow())
        )
        conn.commit()
        conv_id = cursor.lastrowid
        
    conn.close()
    return conv_id

def save_message(conversation_id, role, content):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO messages (conversation_id, role, content, timestamp) VALUES (?, ?, ?, ?)",
        (conversation_id, role, content, datetime.utcnow())
    )
    conn.commit()
    conn.close()

def get_chat_history(conversation_id, limit=10):
    conn = get_db_connection()
    cursor = conn.cursor()
    # Fetch last N messages and order by time ascending
    cursor.execute(
        """
        SELECT role, content FROM (
            SELECT role, content, timestamp 
            FROM messages 
            WHERE conversation_id = ? 
            ORDER BY timestamp DESC 
            LIMIT ?
        ) ORDER BY timestamp ASC
        """,
        (conversation_id, limit)
    )
    rows = cursor.fetchall()
    conn.close()
    return [{"role": row["role"], "content": row["content"]} for row in rows]
