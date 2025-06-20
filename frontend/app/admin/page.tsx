"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AdminPage() {
  const [aiStatus, setAiStatus] = useState<any>(null);
  const [categorizationResult, setCategorizationResult] = useState<any>(null);
  const [scrapingResult, setScrapingResult] = useState<any>(null);
  const [initialCategorizationResult, setInitialCategorizationResult] =
    useState<any>(null);
  const [categoryStats, setCategoryStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAIStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/api/ai/status");
      const data = await response.json();
      setAiStatus(data);
    } catch (err) {
      setError("Failed to check AI status");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const triggerCategorization = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/api/ai/categorize", {
        method: "POST",
      });
      const data = await response.json();
      setCategorizationResult(data);
      // Refresh category stats after categorization
      fetchCategoryStats();
    } catch (err) {
      setError("Failed to trigger categorization");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const triggerScrapingWithAI = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/api/scrape-with-ai", {
        method: "POST",
      });
      const data = await response.json();
      setScrapingResult(data);
      // Refresh category stats after scraping
      fetchCategoryStats();
    } catch (err) {
      setError("Failed to trigger scraping with AI");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const triggerInitialCategorization = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:8000/api/trigger-initial-categorization",
        {
          method: "POST",
        }
      );
      const data = await response.json();
      setInitialCategorizationResult(data);
      // Refresh category stats after categorization
      fetchCategoryStats();
    } catch (err) {
      setError("Failed to trigger initial categorization");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryStats = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/categories/stats"
      );
      const data = await response.json();
      setCategoryStats(data);
    } catch (err) {
      console.error("Failed to fetch category stats:", err);
    }
  };

  useEffect(() => {
    fetchCategoryStats();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

          {/* AI Status Section */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">
              AI Categorization Status
            </h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={checkAIStatus}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? "Checking..." : "Check AI Status"}
              </button>
              {aiStatus && (
                <div
                  className={`px-3 py-1 rounded text-sm ${
                    aiStatus.ai_available
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {aiStatus.message}
                </div>
              )}
            </div>
          </div>

          {/* Category Statistics */}
          {categoryStats && (
            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Category Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white p-4 rounded">
                  <div className="text-2xl font-bold text-blue-600">
                    {categoryStats.total_articles}
                  </div>
                  <div className="text-sm text-gray-600">Total Articles</div>
                </div>
                <div className="bg-white p-4 rounded">
                  <div className="text-2xl font-bold text-green-600">
                    {categoryStats.ai_categorized_count}
                  </div>
                  <div className="text-sm text-gray-600">AI Categorized</div>
                </div>
                <div className="bg-white p-4 rounded">
                  <div className="text-2xl font-bold text-purple-600">
                    {categoryStats.ai_categorized_percentage}%
                  </div>
                  <div className="text-sm text-gray-600">AI Coverage</div>
                </div>
              </div>
              <div className="bg-white p-4 rounded">
                <h3 className="font-semibold mb-2">Category Distribution:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  {Object.entries(categoryStats.categories).map(
                    ([category, count]) => (
                      <div key={category} className="flex justify-between">
                        <span className="capitalize">{category}:</span>
                        <span className="font-semibold">{count}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {/* AI Categorization Section */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">
              AI News Categorization
            </h2>
            <p className="text-gray-600 mb-4">
              Use AI to automatically categorize news articles. Choose from the
              options below:
            </p>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={triggerInitialCategorization}
                  disabled={loading || (aiStatus && !aiStatus.ai_available)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Categorize Existing Articles"}
                </button>
                <button
                  onClick={triggerCategorization}
                  disabled={loading || (aiStatus && !aiStatus.ai_available)}
                  className="bg-cnn-red text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Re-categorize All Articles"}
                </button>
                <button
                  onClick={triggerScrapingWithAI}
                  disabled={loading || (aiStatus && !aiStatus.ai_available)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Scrape & Categorize with AI"}
                </button>
              </div>

              <div className="text-sm text-gray-500">
                <p>
                  <strong>Categorize Existing Articles:</strong> AI-categorize
                  articles that haven't been categorized yet
                </p>
                <p>
                  <strong>Re-categorize All Articles:</strong> Re-categorize all
                  articles with AI (overwrites existing categories)
                </p>
                <p>
                  <strong>Scrape & Categorize with AI:</strong> Scrape fresh
                  news and categorize with AI
                </p>
              </div>
            </div>

            {initialCategorizationResult && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                <h3 className="font-semibold text-blue-800">
                  Initial Categorization Complete
                </h3>
                <p className="text-blue-700">
                  {initialCategorizationResult.message}
                </p>
                <div className="mt-2 text-sm text-blue-600">
                  <p>
                    Total articles: {initialCategorizationResult.total_articles}
                  </p>
                  <p>
                    AI categorized:{" "}
                    {initialCategorizationResult.ai_categorized_count}
                  </p>
                  <p>
                    Newly categorized:{" "}
                    {initialCategorizationResult.newly_categorized}
                  </p>
                </div>
              </div>
            )}

            {categorizationResult && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                <h3 className="font-semibold text-green-800">
                  Categorization Complete
                </h3>
                <p className="text-green-700">{categorizationResult.message}</p>
                <div className="mt-2 text-sm text-green-600">
                  <p>Total articles: {categorizationResult.total_articles}</p>
                  <p>
                    AI categorized: {categorizationResult.ai_categorized_count}
                  </p>
                </div>
              </div>
            )}

            {scrapingResult && (
              <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded">
                <h3 className="font-semibold text-purple-800">
                  Scraping with AI Complete
                </h3>
                <p className="text-purple-700">{scrapingResult.message}</p>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded mb-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
