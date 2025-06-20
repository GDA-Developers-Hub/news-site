import { newsService, NewsArticle } from "@/lib/newsApi";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchClient from "./SearchClient";
import SortBy from "@/components/SortBy";
import { Suspense } from "react";

export const revalidate = 3600; // Revalidate data every hour

interface SearchPageProps {
  searchParams: {
    q?: string;
    sortBy?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";
  const sortBy = searchParams.sortBy || "publishedAt";

  let initialArticles: NewsArticle[] = [];

  if (query) {
    const initialSearchResponse = await newsService.searchNews(query, sortBy);
    if (initialSearchResponse && initialSearchResponse.articles) {
      initialArticles = initialSearchResponse.articles;
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Suspense>
          <SearchClient
            initialArticles={initialArticles}
            initialQuery={query}
          />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
