"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NewsArticle } from "@/lib/newsApi";
import NewsCard from "@/components/NewsCard";
import SortBy from "@/components/SortBy";
import { Search } from "lucide-react";

function SearchComponent({
  initialArticles,
  initialQuery,
}: {
  initialArticles: NewsArticle[];
  initialQuery: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const articles = initialArticles; // Articles are now passed directly from the server component

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div>
      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for articles..."
          className="w-full text-2xl p-4 pr-16 border-b-2 border-gray-300 focus:border-cnn-red focus:outline-none"
        />
        <button
          type="submit"
          className="absolute right-0 top-0 h-full px-6 text-cnn-red"
          aria-label="Search"
        >
          <Search className="h-7 w-7" />
        </button>
      </form>

      {/* Sort By Dropdown - only show if there is a query */}
      {initialQuery && (
        <div className="flex justify-end">
          <SortBy />
        </div>
      )}

      {/* Results */}
      {initialQuery ? (
        <>
          <div className="mb-4 text-gray-600">
            Displaying {articles.length > 0 ? "1-" : ""}
            {articles.length} results for{" "}
            <span className="font-bold">"{initialQuery}"</span>
          </div>
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {articles.map((article, index) => (
                <NewsCard key={`${article.url}-${index}`} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold">No Results Found</h2>
              <p className="text-gray-500 mt-2">
                We couldn't find anything matching your search.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold">Search the News Portal</h2>
          <p className="text-gray-500 mt-2">
            Enter a term above to get started.
          </p>
        </div>
      )}
    </div>
  );
}

// Wrap the component in Suspense as it uses useSearchParams, although we now mostly rely on props
export default function SearchClient({
  initialArticles,
  initialQuery,
}: {
  initialArticles: NewsArticle[];
  initialQuery: string;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchComponent
        initialArticles={initialArticles}
        initialQuery={initialQuery}
      />
    </Suspense>
  );
}
