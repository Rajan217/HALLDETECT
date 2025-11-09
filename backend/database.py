# backend/database.py
import sqlite3
import json
from datetime import datetime

DB_PATH = "halldetect.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
      CREATE TABLE IF NOT EXISTS queries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        query TEXT,
        ai_answer TEXT,
        verification TEXT,
        timestamp TEXT
      )
    """)
    conn.commit()
    conn.close()

def save_query(query, ai_answer, verification):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("INSERT INTO queries (query, ai_answer, verification, timestamp) VALUES (?,?,?,?)",
              (query, ai_answer, json.dumps(verification), datetime.utcnow().isoformat()))
    conn.commit()
    conn.close()
