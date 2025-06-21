import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import { newsService, NewsArticle } from "@/lib/newsApi";
import SortBy from "@/components/SortBy";
import DateFilter from "@/components/DateFilter";
import { Suspense } from "react";

interface HomeProps {
  searchParams?: {
    sortBy?: string;
    dateRange?: string;
    from?: string;
    to?: string;
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const { sortBy, dateRange, from, to } = searchParams || {};
  let articles: NewsArticle[] = [];

  try {
    const scraperResponse = await newsService.getScrapedNews({
      sortBy,
      dateRange,
      from,
      to,
    });

    if (scraperResponse && scraperResponse.articles.length > 0) {
      articles = scraperResponse.articles;
    }
  } catch (error) {
    console.error(
      "CRITICAL: Failed to fetch news from all available sources.",
      error
    );
  }

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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            <Suspense fallback={null}>
              <DateFilter />
            </Suspense>
          </aside>
          <div className="md:col-span-3">
            {uniqueArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
                  We couldn't fetch the latest news. Try adjusting your filters
                  or check back later.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
