import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import { newsApi, NewsArticle } from "@/lib/newsApi";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: { category: string };
}

const validCategories = [
  "world",
  "politics",
  "business",
  "technology",
  "health",
  "entertainment",
  "sports",
  "science",
];

// Categories that use special NewsAPI methods
const specialCategories = ["world"];

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = params.category.toLowerCase();

  if (!validCategories.includes(category)) {
    notFound();
  }

  try {
    let articles: NewsArticle[] = [];
    let totalResults = 0;

    // Use special NewsAPI methods for world category
    if (specialCategories.includes(category)) {
      let categoryNews;

      switch (category) {
        case "world":
          categoryNews = await newsApi.getWorldNews(20);
          break;
        default:
          throw new Error(`Unknown category: ${category}`);
      }

      articles = categoryNews.articles;
      totalResults = categoryNews.totalResults;
    } else {
      // Use standard NewsAPI for other categories
      const categoryNews = await newsApi.getTopHeadlines({
        category: category as any,
        country: "us",
        pageSize: 20,
      });

      articles = categoryNews.articles;
      totalResults = categoryNews.totalResults;
    }

    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {categoryTitle} News
            </h1>
            <p className="text-gray-600">
              Latest {categoryTitle.toLowerCase()} news and updates
              {totalResults > 0 && ` (${totalResults} articles found)`}
            </p>
          </div>

          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article: NewsArticle, index: number) => (
                <NewsCard key={index} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No news available
              </h2>
              <p className="text-gray-600">
                No {categoryTitle.toLowerCase()} news articles are currently
                available.
              </p>
            </div>
          )}
        </main>

        <Footer />
      </div>
    );
  } catch (error) {
    console.error("Error fetching category news:", error);
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Error Loading News
            </h1>
            <p className="text-gray-600">
              Sorry, we couldn't load the category news. Please try again later.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}
