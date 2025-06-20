import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import { newsService, NewsArticle } from "@/lib/newsApi";
import { notFound } from "next/navigation";
import SortBy from "@/components/SortBy";
import DateFilter from "@/components/DateFilter";
import { Suspense } from "react";

// The CATEGORY_MAP is now used just for display capitalization, if needed.
const CATEGORY_MAP: { [key: string]: string } = {
  world: "World",
  politics: "Politics",
  business: "Business",
  sports: "Sports",
  entertainment: "Entertainment",
  technology: "Technology",
  style: "Style",
  travel: "Travel",
  science: "Science",
  climate: "Climate",
  weather: "Weather",
  health: "Health",
  opinion: "Opinion",
  general: "General",
  crime: "Crime",
  education: "Education",
  environment: "Environment",
};

interface CategoryPageProps {
  params: {
    category: string;
  };
  searchParams: {
    sortBy?: string;
    dateRange?: string;
    from?: string;
    to?: string;
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const category = params.category.toLowerCase();

  const { sortBy, dateRange, from, to } = searchParams;

  const categoryName =
    CATEGORY_MAP[category] ||
    category.charAt(0).toUpperCase() + category.slice(1);
  let articles: NewsArticle[] = [];
  let error: string | null = null;

  try {
    const response = await newsService.getNewsByCategory(category, {
      sortBy,
      dateRange,
      from,
      to,
    });

    // Check if we have articles in the response
    if (response && response.articles && response.articles.length > 0) {
      articles = response.articles;
    } else {
      // Handle the case where the category is valid but has no articles.
      // We don't want a 404 page, just a message.
      console.log(`No articles found for category: ${category}`);
    }
  } catch (err: any) {
    console.error(
      `CRITICAL: Failed to fetch news for category ${category}:`,
      err
    );
    error = "Could not fetch articles for this category from any source.";
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {categoryName}
          </h1>
          <div className="flex space-x-4">
            <Suspense fallback={null}>
              <SortBy />
            </Suspense>
          </div>
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
                    There are currently no articles available for this category.
                    Try adjusting your filters.
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
