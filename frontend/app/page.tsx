import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import { newsApi, NewsArticle } from "@/lib/newsApi";

export default async function Home() {
  try {
    // Fetch top headlines for the main content
    const topHeadlines = await newsApi.getTopHeadlines({
      country: "us",
      pageSize: 20,
    });

    // Fetch business news for sidebar
    const businessNews = await newsApi.getTopHeadlines({
      category: "business",
      pageSize: 5,
    });

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          {/* Featured News Section */}
          {topHeadlines.articles.length > 0 && (
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Featured News
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <NewsCard article={topHeadlines.articles[0]} featured={true} />
                {topHeadlines.articles.slice(1, 3).map((article, index) => (
                  <NewsCard key={index} article={article} />
                ))}
              </div>
            </section>
          )}

          {/* Main Content and Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Latest News
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {topHeadlines.articles.slice(3, 11).map((article, index) => (
                  <NewsCard key={index} article={article} />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Business News
                </h3>
                <div className="space-y-4">
                  {businessNews.articles.map((article, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 pb-4 last:border-b-0"
                    >
                      <h4 className="font-semibold text-sm mb-2">
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-cnn-red transition-colors"
                        >
                          {article.title}
                        </a>
                      </h4>
                      <p className="text-xs text-gray-500">
                        {article.source.name} •{" "}
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-cnn-red text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold">
              Load More News
            </button>
          </div>
        </main>

        <Footer />
      </div>
    );
  } catch (error) {
    console.error("Error fetching news:", error);
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Error Loading News
            </h1>
            <p className="text-gray-600">
              Sorry, we couldn't load the latest news. Please try again later.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
}
