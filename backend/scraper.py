import requests
from bs4 import BeautifulSoup
import json
import re
from typing import List, Dict, Any
from ai_categorizer import get_ai_categorizer
import datetime
import database
import threading

# The base URL for CNN to resolve relative links
CNN_BASE_URL = "https://www.cnn.com"

# Define the categories and their corresponding paths on CNN's website
CATEGORIES = {
    'world': '/world',
    'politics': '/politics',
    'business': '/business',
    'sports': '/sport',
    'entertainment': '/entertainment',
    'technology': '/tech',
    'style': '/style',
    'travel': '/travel',
    'science': '/science',
    'climate': '/climate',
    'weather': '/weather',
    'health': '/health'
}

def get_article_details(article_url: str) -> Dict[str, Any]:
    """
    Fetches an article page and extracts the main image and description.
    """
    print(f"  -> Fetching details for {article_url}")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    details = {'imageUrl': None, 'description': None}
    try:
        response = requests.get(article_url, headers=headers, timeout=10)
        response.raise_for_status()
        article_soup = BeautifulSoup(response.content, 'html.parser')
        
        # --- Find Image ---
        # CNN often wraps the main image in a picture element within a container
        # that has 'image' in its class name. This is a more robust selector.
        image_container = article_soup.find(class_=re.compile(r'image__container'))
        if image_container:
            image_tag = image_container.find('img')
            if image_tag and image_tag.get('src'):
                details['imageUrl'] = image_tag['src']

        # --- Find Description ---
        # The first paragraph of text is usually a good summary.
        first_paragraph = article_soup.find('p', class_=re.compile(r'paragraph'))
        if first_paragraph:
            details['description'] = first_paragraph.get_text(strip=True)

    except requests.RequestException as e:
        print(f"    -> Error fetching article details for {article_url}: {e}")
    
    return details

def scrape_cnn_page(url: str, category: str, conn) -> List[Dict[str, Any]]:
    """
    Scrapes a single CNN page (e.g., a category page) for articles.

    Args:
        url: The full URL of the page to scrape.
        category: The category name to tag the articles with.

    Returns:
        A list of scraped article data.
    """
    print(f"Scraping {category} from {url}...")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Error fetching {url}: {e}")
        return []

    soup = BeautifulSoup(response.content, 'html.parser')
    page_articles = []
    
    # --- Filter for new articles before detailed scraping ---
    article_links = soup.select('a[data-link-type="article"]')
    new_article_urls = []
    for link in article_links:
        href = link.get('href')
        if not href or not href.startswith('/'):
            continue
        full_url = CNN_BASE_URL + href
        if not database.article_exists(full_url, conn):
            new_article_urls.append((full_url, link))
    
    print(f"Found {len(article_links)} links, {len(new_article_urls)} are new for category '{category}'.")

    # --- Scrape details for new articles only ---
    for full_url, link in new_article_urls:
        headline_element = link.find('span', class_='container__headline-text')
        headline = headline_element.get_text(strip=True) if headline_element else "Title not found"

        if headline == "Title not found" or len(headline) < 20:
            continue
        
        article_details = get_article_details(full_url)

        if article_details.get('imageUrl'):
            article_data = {
                'title': headline,
                'url': full_url,
                'source': 'CNN',
                'category': category,
                'imageUrl': article_details.get('imageUrl'),
                'description': article_details.get('description'),
                'publishedAt': datetime.datetime.now(datetime.timezone.utc).isoformat()
            }
            page_articles.append(article_data)
        else:
            print(f"  -> Skipping article, no image found: {headline}")
        
    return page_articles


def run_full_scrape(use_ai_categorization: bool = False):
    """
    Runs the scraper for all defined categories and saves the combined results to the database.
    """
    print("Starting full CNN scrape for all categories...")
    
    conn = database.get_db_connection()
    all_new_articles = []

    try:
        # First, scrape the homepage for top stories
        homepage_articles = scrape_cnn_page(CNN_BASE_URL, 'top-stories', conn)
        all_new_articles.extend(homepage_articles)

        # Then, scrape each category page
        for category, path in CATEGORIES.items():
            category_url = CNN_BASE_URL + path
            category_articles = scrape_cnn_page(category_url, category, conn)
            all_new_articles.extend(category_articles)
        
        # Create a final list with no duplicates
        final_unique_articles = list({article['url']: article for article in all_new_articles}.values())
        print(f"\nTotal new unique articles to process: {len(final_unique_articles)}")

        if not final_unique_articles:
            print("No new articles found. Scrape complete.")
            return

        # Apply AI categorization if requested
        if use_ai_categorization:
            print("Applying AI categorization to new articles...")
            ai_categorizer = get_ai_categorizer()
            if ai_categorizer:
                try:
                    final_unique_articles = ai_categorizer.categorize_articles_batch(final_unique_articles)
                except Exception as e:
                    print(f"Error during AI categorization: {e}")
            else:
                print("AI categorizer not available.")
        
        # Add all new articles to the database in a single transaction
        database.add_article_batch(final_unique_articles, conn)
        print(f"Successfully added {len(final_unique_articles)} new articles to the database.")

    except Exception as e:
        print(f"An error occurred during the scrape process: {e}")
    finally:
        conn.close()
        print("Scrape process finished.")


def run_scrape_in_background():
    """Wrapper to run the scrape function in a background thread."""
    print("Triggering background scrape...")
    scraper_thread = threading.Thread(target=run_full_scrape, args=(True,))
    scraper_thread.daemon = True # Allows main program to exit even if thread is running
    scraper_thread.start()


if __name__ == "__main__":
    database.init_db()
    # Enable AI categorization by default
    run_full_scrape(use_ai_categorization=True) 