from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import json
from typing import List, Dict, Any, Optional
import os
import uvicorn
import database
from scraper import run_scrape_in_background, CATEGORIES
from ai_categorizer import get_ai_categorizer

# --- App Initialization ---
app = FastAPI()

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Server Startup Event ---
@app.on_event("startup")
async def startup_event():
    """
    On server startup, initialize the database and trigger an initial scrape.
    """
    print("Server starting up...")
    database.init_db()
    
    # Delete the old JSON file if it exists to avoid confusion
    if os.path.exists("news_data.json"):
        os.remove("news_data.json")
        print("Removed obsolete news_data.json file.")

    run_scrape_in_background()

# --- API Endpoints ---

@app.get("/api/news", response_model=List[Dict[str, Any]])
async def get_all_news(
    sort_by: Optional[str] = Query('publishedAt', enum=['publishedAt', 'publishedAt_asc', 'relevancy']),
    from_date: Optional[str] = None,
    to_date: Optional[str] = None
):
    """
    Endpoint to get all news articles from the database.
    """
    try:
        articles = database.get_articles(sort_by=sort_by, from_date=from_date, to_date=to_date)
        return articles
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@app.get("/api/news/category/{category_name}", response_model=List[Dict[str, Any]])
async def get_news_by_category(
    category_name: str, 
    sort_by: Optional[str] = Query('publishedAt', enum=['publishedAt', 'publishedAt_asc', 'relevancy']),
    from_date: Optional[str] = None,
    to_date: Optional[str] = None
):
    """
    Endpoint to get news articles for a specific category from the database.
    """
    if category_name.lower() not in CATEGORIES and category_name.lower() != 'top-stories':
        raise HTTPException(status_code=404, detail="Category not found.")
    
    try:
        articles = database.get_articles_by_category(
            category=category_name.lower(), 
            sort_by=sort_by, 
            from_date=from_date, 
            to_date=to_date
        )
        if not articles:
             # Return empty list instead of 404, as category is valid but might have no articles yet
            return []
        return articles
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@app.get("/api/search", response_model=List[Dict[str, Any]])
async def search_news(
    q: str, 
    sort_by: Optional[str] = Query('publishedAt', enum=['publishedAt', 'publishedAt_asc', 'relevancy']),
    from_date: Optional[str] = None,
    to_date: Optional[str] = None
):
    """
    Endpoint to search for news articles by a query string from the database.
    """
    if not q:
        raise HTTPException(status_code=400, detail="Search query cannot be empty.")
    try:
        articles = database.search_articles(
            query=q, 
            sort_by=sort_by,
            from_date=from_date,
            to_date=to_date
        )
        return articles
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@app.get("/api/categories")
async def get_categories():
    """
    Returns the list of predefined static categories.
    """
    # Includes 'top-stories' for completeness, even if not in the main config
    all_categories = ["top-stories"] + list(CATEGORIES.keys())
    return {"categories": sorted(list(set(all_categories)))}

@app.post("/api/scrape-and-categorize", status_code=202)
async def trigger_scrape_and_categorize():
    """
    Triggers a new background scrape of all categories.
    """
    print("Scrape and categorize endpoint triggered.")
    run_scrape_in_background()
    return {"message": "Scraping and categorization process initiated in the background."}

@app.get("/api/ai-status")
async def ai_status():
    """
    Checks if the AI categorizer is properly configured.
    """
    ai_categorizer = get_ai_categorizer()
    is_configured = ai_categorizer is not None and ai_categorizer.is_configured()
    return {"is_configured": is_configured}

# --- Main Execution ---
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 