/**
 * @file News API and Scraper Service
 *
 * This file provides an interface for fetching news from both the external NewsAPI.org
 * and our internal Python-based scraping service. It is designed to prioritize
 * the scraped data and use NewsAPI as a fallback.
 */

const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
const NEWS_API_URL = 'https://newsapi.org/v2';
const SCRAPER_API_URL = 'http://localhost:8000/api'; // Our Python backend

export interface NewsArticle {
  title: string;
  description: string | null;
  url: string;
  imageUrl: string | null;
  publishedAt?: string; // Optional as scraped data might not have it
  source: {
    name: string;
  };
  category?: string; // Add category to the interface
}

export interface NewsApiResponse {
  articles: NewsArticle[];
  totalResults?: number;
  notFound?: boolean; // Flag to indicate if the category was not found
}

// Internal helper to transform data from different sources into a consistent format
const transformApiArticle = (article: any): NewsArticle => ({
  title: article.title,
  description: article.description,
  url: article.url,
  imageUrl: article.urlToImage,
  publishedAt: article.publishedAt,
  source: {
    name: article.source.name,
  },
});

const transformScrapedArticle = (article: any): NewsArticle => ({
  title: article.title,
  description: article.description,
  url: article.url,
  imageUrl: article.imageUrl, // Note the different field name
  publishedAt: article.publishedAt, // Pass through publishedAt
  source: {
    name: article.source, // Simpler source field
  },
  category: article.category, // Pass through category
});


/**
 * Primary method to fetch news from our backend scraper.
 * This is a general-purpose fetcher, but typically you'll use a more specific function.
 */
async function getScrapedNews(sortBy: string = 'publishedAt'): Promise<NewsApiResponse> {
  try {
    const response = await fetch(`${SCRAPER_API_URL}/news?sort_by=${sortBy}`);
    if (!response.ok) {
      throw new Error(`Scraper API responded with status: ${response.status}`);
    }
    const data = await response.json();
    
    // The scraper returns a direct array
    const articles = data.map(transformScrapedArticle);

    return { articles, totalResults: articles.length };
  } catch (error) {
    console.error("Failed to fetch from scraper API:", error);
    // Return an empty array on failure so the caller can decide to fallback.
    return { articles: [], totalResults: 0 };
  }
}

/**
 * Fetches ALL scraped news from our backend for client-side search.
 * This is intended for pages that need the full dataset.
 */
async function getAllScrapedNews(sortBy: string = 'publishedAt'): Promise<NewsApiResponse> {
  try {
    // Corrected endpoint from /news/all to /news
    const response = await fetch(`${SCRAPER_API_URL}/news?sort_by=${sortBy}`);
    if (!response.ok) {
      throw new Error(`Scraper API responded with status: ${response.status}`);
    }
    const data = await response.json();
    // The scraper returns a direct array
    const articles = data.map(transformScrapedArticle);
    return { articles, totalResults: articles.length };
  } catch (error) {
    console.error("Failed to fetch all news from scraper API:", error);
    return { articles: [], totalResults: 0 };
  }
}

/**
 * Fetches news for a specific category from our backend scraper.
 */
async function getNewsByCategory(category: string, sortBy: string = 'publishedAt'): Promise<NewsApiResponse> {
  try {
    const response = await fetch(`${SCRAPER_API_URL}/news/category/${category}?sort_by=${sortBy}`);
    
    // Explicitly handle 404 from the API
    if (response.status === 404) {
      return { articles: [], totalResults: 0, notFound: true };
    }

    if (!response.ok) {
      throw new Error(`Scraper API responded with status: ${response.status} for category ${category}`);
    }
    const data = await response.json();
    // The scraper returns a direct array
    const articles = data.map(transformScrapedArticle);
    return { articles, totalResults: articles.length };
  } catch (error) {
    console.error(`Failed to fetch category ${category} from scraper API:`, error);
    return { articles: [], totalResults: 0 };
  }
}

/**
 * Searches for news articles using our backend scraper.
 * @param query - The search term.
 * @param sortBy - The sorting method ('publishedAt' or 'relevancy').
 */
async function searchNews(query: string, sortBy: string = 'publishedAt'): Promise<NewsApiResponse> {
  if (!query) {
    return { articles: [], totalResults: 0 };
  }
  try {
    const response = await fetch(`${SCRAPER_API_URL}/search?q=${encodeURIComponent(query)}&sort_by=${sortBy}`);
    if (!response.ok) {
      throw new Error(`Scraper API search responded with status: ${response.status}`);
    }
    const data = await response.json();
    // The scraper returns a direct array
    const articles = data.map(transformScrapedArticle);
    return { articles, totalResults: articles.length };
  } catch (error) {
    console.error(`Failed to search news from scraper API:`, error);
    return { articles: [], totalResults: 0 };
  }
}

// --- DISABLED: NewsAPI Fallback ---
// The following functions call the external NewsAPI.org service.
// They are temporarily disabled to rely solely on the internal scraper.

// /**
//  * Secondary method to fetch news from the external NewsAPI.org.
//  * This can be used as a fallback.
//  * @param params - Query parameters for the NewsAPI request.
//  */
// async function getNewsFromApi(params: Record<string, string | number>): Promise<NewsApiResponse> {
//   if (!NEWS_API_KEY) {
//     throw new Error('NewsAPI key is not configured. Please check your .env.local file.');
//   }

//   const query = new URLSearchParams({ ...params, apiKey: NEWS_API_KEY } as any).toString();
//   const url = `${NEWS_API_URL}/everything?${query}`;

//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(`NewsAPI Error: ${errorData.message || response.statusText}`);
//     }
//     const data = await response.json();
//     return {
//       articles: data.articles.map(transformApiArticle),
//       totalResults: data.totalResults
//     };
//   } catch (error) {
//     console.error("Failed to fetch from NewsAPI:", error);
//     throw error; // Re-throw to be handled by the caller
//   }
// }

// /**
//  * Fetches sources from NewsAPI. Kept for search filtering functionality.
//  */
// async function getSources(params: Record<string, string> = {}) {
//     if (!NEWS_API_KEY) throw new Error('NewsAPI key not found');
//     const query = new URLSearchParams({ ...params, apiKey: NEWS_API_KEY }).toString();
//     const res = await fetch(`${NEWS_API_URL}/top-headlines/sources?${query}`);
//     if (!res.ok) throw new Error('Failed to fetch sources');
//     return res.json();
// }


export const newsService = {
  getScrapedNews,
  getAllScrapedNews,
  getNewsByCategory,
  searchNews,
  // getNewsFromApi,
  // getSources,
}; 