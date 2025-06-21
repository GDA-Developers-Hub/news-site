import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import { newsService, NewsArticle } from "@/lib/newsApi";
import SortBy from "@/components/SortBy";
import DateFilter from "@/components/DateFilter";
import { Suspense } from "react";

interface OurNewsProps {
  searchParams?: {
    sortBy?: string;
    dateRange?: string;
    from?: string;
    to?: string;
  };
}

export default async function OurNews({ searchParams }: OurNewsProps) {
  const { sortBy, dateRange, from, to } = searchParams || {};
  let articles: NewsArticle[] = [];
  let error: string | null = null;

  try {
    const response = await newsService.getScrapedNews({
      sortBy,
      dateRange,
      from,
      to,
    });

    if (response && response.articles && response.articles.length > 0) {
      articles = response.articles;
    }
  } catch (err: any) {
    console.error("Failed to fetch our news:", err);
    error = "Could not fetch articles at this time.";
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Our News
            </h1>
            <p className="text-gray-600 mt-2">
              Curated selection of the most important stories from around the
              world
            </p>
          </div>
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
            {error && (
              <div className="text-center py-16">
                <h2 className="text-2xl font-semibold text-red-600">
                  Request Failed
                </h2>
                <p className="text-gray-600 mt-2">{error}</p>
              </div>
            )}

            {!error && articles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {articles.map((article, index) => (
                  <NewsCard key={`${article.url}-${index}`} article={article} />
                ))}
              </div>
            ) : (
              !error && (
                <div className="text-center py-16">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    No Articles Found
                  </h2>
                  <p className="text-gray-600 mt-2">
                    We couldn't load our curated news at this time. Try
                    adjusting your filters.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
