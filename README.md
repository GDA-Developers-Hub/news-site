# NEWS Portal

A modern news aggregation platform with AI-powered categorization, built with Next.js frontend and Python FastAPI backend.

## Features

- **AI-Powered News Categorization**: Uses ChatGPT to automatically categorize articles into intelligent categories
- **Real-time News Scraping**: Scrapes CNN for the latest news articles
- **Article Sorting**: Sort articles by relevance, newest, or oldest on the homepage, category pages, and search results
- **Smart Search**: Backend-powered search with instant results
- **Dynamic Category Pages**: Dedicated pages for each news category
- **Advanced Navigation**: The header displays a fixed set of categories (`World`, `Politics`, `Business`, `Sports`, `Entertainment`, `Technology`) and places additional topics like `Style`, `Travel`, `Health`, and more into a "More" dropdown menu.
- **Responsive Design**: Modern, mobile-friendly interface
- **Admin Dashboard**: Manage AI categorization and view statistics

## AI Categories

The system automatically categorizes articles into these intelligent categories:

- **World**: International news and global affairs
- **Politics**: Political news and government affairs
- **Business**: Business, economy, and financial news
- **Sports**: Sports news and athletic events
- **Entertainment**: Movies, TV, music, and celebrity news
- **Technology**: Tech industry and innovation
- **Style**: Fashion, design, and lifestyle
- **Travel**: Travel news, guides, and destinations
- **Science**: Scientific discoveries and research
- **Climate**: News and information about climate change
- **Weather**: Weather forecasts and natural events
- **Health**: Healthcare and medical news
- **Opinion**: Editorial content and opinion pieces
- **Crime**: Crime and legal news
- **Education**: Educational news and academic affairs
- **Environment**: Environmental news and conservation
- **General**: General news and miscellaneous content

## Setup

### Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- OpenAI API key

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd news
```

2. **Setup Backend**

```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Configure AI Categorization**
   Create a `.env` file in the `backend` directory:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-3.5-turbo
   ```

4. **Setup Frontend**
   ```bash
   cd ../frontend
npm install
```

### Running the Application

1. **Start the Backend**

```bash
   cd backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   uvicorn main:app --reload
   ```

   The backend will automatically categorize existing articles on startup if AI is available.

2. **Start the Frontend**

   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Application**
   - Main site: http://localhost:3000
   - Admin dashboard: http://localhost:3000/admin
   - API documentation: http://localhost:8000/docs

## Admin Dashboard

Visit `/admin` to access the admin dashboard where you can:

- **Check AI Status**: Verify that AI categorization is working
- **View Statistics**: See category distribution and AI coverage
- **Categorize Articles**:
  - Categorize existing uncategorized articles
  - Re-categorize all articles with AI
  - Scrape fresh news and categorize with AI
- **Monitor Progress**: Track categorization progress and results

## API Endpoints

### News Endpoints

- `GET /api/news` - Get top stories
- `GET /api/news/all` - Get all articles
- `GET /api/news/category/{category}` - Get articles by category
- `GET /api/search?q={query}` - Search articles

All news-serving endpoints accept an optional `sortBy` query parameter (`relevance`, `newest`, `oldest`).

### AI Categorization Endpoints

- `GET /api/ai/status` - Check AI service status
- `POST /api/ai/categorize` - Categorize all articles
- `POST /api/ai/categorize-single` - Categorize single article
- `POST /api/ai/suggest-categories` - Get category suggestions
- `POST /api/scrape-with-ai` - Scrape and categorize with AI
- `POST /api/trigger-initial-categorization` - Categorize uncategorized articles

### Statistics Endpoints

- `GET /api/categories` - Get all available categories
- `GET /api/categories/stats` - Get category statistics

## Automatic Categorization

The system automatically categorizes articles in several ways:

1. **Startup Categorization**: When the backend starts, it automatically categorizes any uncategorized articles
2. **Scraping with AI**: New articles are automatically categorized when scraped
3. **Manual Trigger**: Use the admin dashboard to trigger categorization manually

## Architecture

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: FastAPI with Python
- **AI**: OpenAI GPT-3.5-turbo for intelligent categorization
- **Data Storage**: JSON file-based storage
- **Scraping**: BeautifulSoup for web scraping

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [NewsAPI.org](https://newsapi.org/) for providing the news data
- [CNN](https://edition.cnn.com) for design inspiration
- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
