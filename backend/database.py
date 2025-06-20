import sqlite3
from typing import Dict, Any, List, Optional

DB_FILE = "news.db"

def get_db_connection():
    """Creates a connection to the SQLite database."""
    conn = sqlite3.connect(DB_FILE, check_same_thread=False)
    conn.row_factory = sqlite3.Row 
    return conn

def init_db():
    """Initializes the database and creates the articles table if it doesn't exist."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            url TEXT NOT NULL UNIQUE,
            source TEXT,
            category TEXT,
            imageUrl TEXT,
            description TEXT,
            publishedAt TEXT NOT NULL,
            ai_categorized BOOLEAN DEFAULT 0
        )
    ''')
    conn.commit()
    conn.close()
    print("Database initialized successfully.")

def article_exists(url: str, conn: Optional[sqlite3.Connection] = None) -> bool:
    """Checks if an article with the given URL already exists in the database."""
    close_conn = False
    if conn is None:
        conn = get_db_connection()
        close_conn = True
    
    cursor = conn.cursor()
    cursor.execute("SELECT 1 FROM articles WHERE url = ?", (url,))
    exists = cursor.fetchone() is not None
    
    if close_conn:
        conn.close()
        
    return exists

def add_article_batch(articles: List[Dict[str, Any]], conn: sqlite3.Connection):
    """Adds a batch of articles to the database, ignoring duplicates."""
    cursor = conn.cursor()
    
    articles_to_insert = []
    for article in articles:
        articles_to_insert.append((
            article.get('title'),
            article.get('url'),
            article.get('source'),
            article.get('category'),
            article.get('imageUrl'),
            article.get('description'),
            article.get('publishedAt')
        ))

    try:
        cursor.executemany('''
            INSERT OR IGNORE INTO articles (title, url, source, category, imageUrl, description, publishedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', articles_to_insert)
        conn.commit()
    except sqlite3.IntegrityError as e:
        print(f"An integrity error occurred during batch insert: {e}")
        conn.rollback()

def dict_from_row(row: sqlite3.Row) -> Dict[str, Any]:
    """Converts a sqlite3.Row object to a dictionary."""
    if not row:
        return {}
    return dict(row)

def get_articles(sort_by: str = 'publishedAt', limit: int = 100) -> List[Dict[str, Any]]:
    """Retrieves all articles from the database, with sorting."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    order_clause = 'ORDER BY publishedAt DESC'
    if sort_by == 'relevancy': # Basic relevancy - could be improved
        order_clause = 'ORDER BY title'
        
    cursor.execute(f"SELECT * FROM articles {order_clause} LIMIT ?", (limit,))
    articles = [dict_from_row(row) for row in cursor.fetchall()]
    conn.close()
    return articles

def get_articles_by_category(category: str, sort_by: str = 'publishedAt', limit: int = 100) -> List[Dict[str, Any]]:
    """Retrieves articles for a specific category, with sorting."""
    conn = get_db_connection()
    cursor = conn.cursor()

    order_clause = 'ORDER BY publishedAt DESC'
    if sort_by == 'relevancy':
        order_clause = 'ORDER BY title'

    cursor.execute(f"SELECT * FROM articles WHERE category = ? {order_clause} LIMIT ?", (category, limit))
    articles = [dict_from_row(row) for row in cursor.fetchall()]
    conn.close()
    return articles

def search_articles(query: str, sort_by: str = 'publishedAt', limit: int = 100) -> List[Dict[str, Any]]:
    """Searches for articles by title or description."""
    conn = get_db_connection()
    cursor = conn.cursor()

    order_clause = 'ORDER BY publishedAt DESC'
    if sort_by == 'relevancy': # When searching, relevancy is more complex. FTS5 would be better.
        order_clause = 'ORDER BY title'

    search_query = f"%{query}%"
    cursor.execute(f"""
        SELECT * FROM articles 
        WHERE title LIKE ? OR description LIKE ?
        {order_clause}
        LIMIT ?
    """, (search_query, search_query, limit))
    articles = [dict_from_row(row) for row in cursor.fetchall()]
    conn.close()
    return articles 