import axios from 'axios';

//newsapi
const NEWSAPI_KEY = '8d500dfc964a4a52a337be5fc21f00dd';
const NEWSAPI_BASE_URL = 'https://newsapi.org/v2';

export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export interface SourcesResponse {
  status: string;
  sources: Array<{
    id: string;
    name: string;
    description: string;
    url: string;
    category: string;
    language: string;
    country: string;
  }>;
}

class NewsAPI {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getTopHeadlines(params: {
    country?: string;
    category?: string;
    sources?: string;
    q?: string;
    pageSize?: number;
    page?: number;
  } = {}): Promise<NewsResponse> {
    const response = await axios.get(`${NEWSAPI_BASE_URL}/top-headlines`, {
      params: {
        ...params,
        apiKey: this.apiKey,
      },
    });
    return response.data;
  }

  async getEverything(params: {
    q?: string;
    sources?: string;
    domains?: string;
    from?: string;
    to?: string;
    language?: string;
    sortBy?: 'relevancy' | 'popularity' | 'publishedAt';
    pageSize?: number;
    page?: number;
  } = {}): Promise<NewsResponse> {
    const response = await axios.get(`${NEWSAPI_BASE_URL}/everything`, {
      params: {
        ...params,
        apiKey: this.apiKey,
      },
    });
    return response.data;
  }

  async getSources(params: {
    category?: string;
    language?: string;
    country?: string;
  } = {}): Promise<SourcesResponse> {
    const response = await axios.get(`${NEWSAPI_BASE_URL}/sources`, {
      params: {
        ...params,
        apiKey: this.apiKey,
      },
    });
    return response.data;
  }

  // Get world news by aggregating from multiple countries
  async getWorldNews(pageSize: number = 20): Promise<NewsResponse> {
    const countries = ['us', 'gb', 'ca', 'au', 'in', 'de', 'fr', 'jp', 'br', 'mx'];
    const allArticles: NewsArticle[] = [];

    try {
      // Fetch news from multiple countries
      const promises = countries.map(country => 
        this.getTopHeadlines({
          country,
          pageSize: Math.ceil(pageSize / countries.length),
        }).catch(error => {
          console.error(`Error fetching news for ${country}:`, error);
          return { status: 'error', articles: [] };
        })
      );

      const results = await Promise.all(promises);
      
      // Combine all articles
      results.forEach(result => {
        if (result.status === 'ok' && result.articles) {
          allArticles.push(...result.articles);
        }
      });

      // Sort by publication date (newest first)
      allArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

      // Remove duplicates based on title
      const uniqueArticles = allArticles.filter((article, index, self) => 
        index === self.findIndex(a => a.title === article.title)
      );

      return {
        status: 'ok',
        totalResults: uniqueArticles.length,
        articles: uniqueArticles.slice(0, pageSize),
      };
    } catch (error) {
      console.error('Error fetching world news:', error);
      return {
        status: 'error',
        totalResults: 0,
        articles: [],
      };
    }
  }
}

export const newsApi = new NewsAPI(NEWSAPI_KEY); 