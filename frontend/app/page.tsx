import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import { newsService, NewsArticle } from "@/lib/newsApi";
import SortBy from "@/components/SortBy";
import { Suspense } from "react";

interface HomeProps {
  searchParams?: {
    sortBy?: string;
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const sortBy = searchParams?.sortBy || "publishedAt";
  let articles: NewsArticle[] = [];
  let fetchSource = "Scraper"; // To track the source of the data

  try {
    // 1. Attempt to fetch news from our backend scraper
    const scraperResponse = await newsService.getScrapedNews(sortBy);

    if (scraperResponse && scraperResponse.articles.length > 0) {
      articles = scraperResponse.articles;
      console.log(
        `Successfully fetched ${articles.length} articles from Scraper.`
      );
    }
    // --- DISABLED: NewsAPI Fallback ---
    // else {
    //   // 2. If scraper fails or returns no articles, fallback to NewsAPI
    //   fetchSource = "NewsAPI";
    //   console.warn(
    //     "Scraper fetch failed or returned no data. Falling back to NewsAPI."
    //   );

    //   const apiResponse = await newsService.getNewsFromApi({
    //     q: "world news", // A generic but relevant query
    //     language: "en",
    //     pageSize: 20,
    //     sortBy: "publishedAt",
    //   });
    //   articles = apiResponse.articles;
    //   console.log(
    //     `Successfully fetched ${articles.length} articles from NewsAPI.`
    //   );
    // }
  } catch (error) {
    console.error(
      "CRITICAL: Failed to fetch news from all available sources.",
      error
    );
    // The page will render an error message because the 'articles' array will be empty.
  }

  // Remove duplicate articles based on the URL to be safe
  const uniqueArticles = articles.filter(
    (article, index, self) =>
      index === self.findIndex((a) => a.url === article.url)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Top Stories
          </h1>
          <Suspense fallback={null}>
            <SortBy />
          </Suspense>
        </div>

        {uniqueArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {uniqueArticles.map((article, index) => (
              <NewsCard key={`${article.url}-${index}`} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-800">
              Could Not Load Articles
            </h2>
            <p className="text-gray-600 mt-2">
              We couldn't fetch the latest news from our primary source or our
              backup provider. Please try again later.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
