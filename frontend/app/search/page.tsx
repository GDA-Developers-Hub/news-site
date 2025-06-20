"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import { newsApi, NewsArticle } from "@/lib/newsApi";
import { Search, Filter, X as XIcon } from "lucide-react";

type SearchType = "Everything" | "Stories" | "Videos" | "Photos";
type Source = { id: string; name: string };
type SortOption = "relevancy" | "publishedAt";

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const [query, setQuery] = useState(searchParams.q || "");
  const [activeSearchType, setActiveSearchType] =
    useState<SearchType>("Everything");
  const [sortBy, setSortBy] = useState<SortOption>("publishedAt");
  const [searchResults, setSearchResults] = useState<{
    articles: NewsArticle[];
    totalResults: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showFilters, setShowFilters] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [sourceSearch, setSourceSearch] = useState("");

  const handleSearch = async (
    searchQuery: string,
    sourcesToSearch: string[],
    newSortBy: SortOption
  ) => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    setLoading(true);
    setError(null);
    const url = new URL(window.location.href);
    url.searchParams.set("q", searchQuery);
    url.searchParams.set("sortBy", newSortBy);
    if (sourcesToSearch.length > 0) {
      url.searchParams.set("sources", sourcesToSearch.join(","));
    } else {
      url.searchParams.delete("sources");
    }
    window.history.pushState({}, "", url);

    try {
      const params: any = { q: searchQuery, pageSize: 20, sortBy: newSortBy };
      if (sourcesToSearch.length > 0) {
        params.sources = sourcesToSearch.join(",");
      }
      const results = await newsApi.getEverything(params);
      setSearchResults(results);
    } catch (err: any) {
      setError(err.message || "An error occurred while searching");
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSources = async () => {
      try {
        const response = await newsApi.getSources({ language: "en" });
        setSources(response.sources);
      } catch (e) {
        console.error("Failed to fetch sources", e);
      }
    };
    fetchSources();

    const urlSources = new URLSearchParams(window.location.search).get(
      "sources"
    );
    if (urlSources) {
      setSelectedSources(urlSources.split(","));
    }
  }, []);

  useEffect(() => {
    if (searchParams.q) {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const urlSources = urlSearchParams.get("sources");
      const urlSort = urlSearchParams.get("sortBy") as SortOption | null;
      const initialSortBy = urlSort || "publishedAt";

      setSortBy(initialSortBy);
      handleSearch(
        searchParams.q,
        urlSources ? urlSources.split(",") : [],
        initialSortBy
      );
    }
  }, []);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query, selectedSources, sortBy);
  };

  const handleSourceChange = (sourceId: string) => {
    setSelectedSources((prev) =>
      prev.includes(sourceId)
        ? prev.filter((id) => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleSortChange = (newSortBy: SortOption) => {
    setSortBy(newSortBy);
    if (query.trim() && searchResults) {
      handleSearch(query, selectedSources, newSortBy);
    }
  };

  const filteredSources = useMemo(
    () =>
      sources.filter((source) =>
        source.name.toLowerCase().includes(sourceSearch.toLowerCase())
      ),
    [sources, sourceSearch]
  );

  const getSourceName = (id: string) =>
    sources.find((s) => s.id === id)?.name || id;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Search Input Section */}
        <div className="max-w-3xl mx-auto my-8">
          <form onSubmit={onSearchSubmit} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
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
        </div>

        {/* Quick Filters */}
        <div className="flex justify-center items-center space-x-8 border-b mb-8">
          {(["Everything", "Stories", "Videos", "Photos"] as SearchType[]).map(
            (type) => (
              <button
                key={type}
                onClick={() => setActiveSearchType(type)}
                disabled={type === "Videos" || type === "Photos"}
                className={`py-2 text-lg font-semibold border-b-4 transition-colors
                ${
                  activeSearchType === type
                    ? "border-cnn-red text-black"
                    : "border-transparent text-gray-500"
                }
                ${
                  type === "Videos" || type === "Photos"
                    ? "cursor-not-allowed opacity-50"
                    : "hover:text-black"
                }`}
                title={
                  type === "Videos" || type === "Photos"
                    ? "This filter is not currently supported"
                    : `Search for ${type}`
                }
              >
                {type}
              </button>
            )
          )}
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center space-x-2 text-gray-600 hover:text-black"
            aria-label="Open filters"
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Selected Source Filters */}
        {selectedSources.length > 0 && (
          <div className="max-w-3xl mx-auto mb-4 flex flex-wrap gap-2 items-center">
            <span className="text-sm font-semibold">Sources:</span>
            {selectedSources.map((sourceId) => (
              <div
                key={sourceId}
                className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm"
              >
                <span>{getSourceName(sourceId)}</span>
                <button
                  onClick={() => handleSourceChange(sourceId)}
                  className="ml-2"
                  aria-label={`Remove ${getSourceName(sourceId)} filter`}
                >
                  <XIcon className="h-4 w-4 text-gray-500 hover:text-black" />
                </button>
              </div>
            ))}
            <button
              onClick={() => setSelectedSources([])}
              className="text-sm text-cnn-red hover:underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Filter Panel (Modal) */}
        {showFilters && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-bold">Filter by Source</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  aria-label="Close filter panel"
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="p-4">
                <input
                  type="text"
                  placeholder="Search for a source..."
                  value={sourceSearch}
                  onChange={(e) => setSourceSearch(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md mb-4"
                />
              </div>
              <div className="p-4 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredSources.map((source) => (
                    <div key={source.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={source.id}
                        checked={selectedSources.includes(source.id)}
                        onChange={() => handleSourceChange(source.id)}
                        className="h-4 w-4 rounded border-gray-300 text-cnn-red focus:ring-cnn-red"
                      />
                      <label
                        htmlFor={source.id}
                        className="ml-2 text-sm text-gray-700 cursor-pointer"
                      >
                        {source.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 border-t mt-auto">
                <button
                  onClick={() => {
                    handleSearch(query, selectedSources, sortBy);
                    setShowFilters(false);
                  }}
                  className="w-full bg-cnn-red text-white py-2 px-4 rounded-md hover:bg-red-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cnn-red mx-auto mb-4"></div>
            <p className="text-gray-600">Searching for articles...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Search Error
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
          </div>
        )}

        {/* Results */}
        {!loading && searchResults && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Displaying 1-{searchResults.articles.length} results out of{" "}
                {searchResults.totalResults} for{" "}
                <span className="font-bold">{query}</span>
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Sorting by</span>
                <button
                  onClick={() => handleSortChange("publishedAt")}
                  className={`px-4 py-1 rounded-md text-sm font-semibold transition-colors ${
                    sortBy === "publishedAt"
                      ? "bg-black text-white"
                      : "bg-white text-black border border-gray-400 hover:bg-gray-100"
                  }`}
                >
                  Newest
                </button>
                <button
                  onClick={() => handleSortChange("relevancy")}
                  className={`px-4 py-1 rounded-md text-sm font-semibold transition-colors ${
                    sortBy === "relevancy"
                      ? "bg-black text-white"
                      : "bg-white text-black border border-gray-400 hover:bg-gray-100"
                  }`}
                >
                  Relevancy
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.articles.map((article, index) => (
                <NewsCard key={index} article={article} />
              ))}
            </div>
          </div>
        )}

        {/* Initial State */}
        {!loading && !searchResults && !searchParams.q && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700">
              Search the News Portal
            </h2>
            <p className="text-gray-500 mt-2">
              Enter a term above to get started.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
