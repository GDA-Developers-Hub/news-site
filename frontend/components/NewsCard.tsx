"use client";

import { format } from "date-fns";
import { Calendar, User } from "lucide-react";
import { NewsArticle } from "@/lib/newsApi";

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
}

export default function NewsCard({ article, featured = false }: NewsCardProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "Unknown date";
    }
  };

  const getCategoryClass = (sourceName: string) => {
    const categories: { [key: string]: string } = {
      business: "category-business",
      technology: "category-technology",
      sports: "category-sports",
      entertainment: "category-entertainment",
      health: "category-health",
      science: "category-science",
    };

    const lowerSource = sourceName.toLowerCase();
    for (const [category, className] of Object.entries(categories)) {
      if (lowerSource.includes(category)) {
        return className;
      }
    }
    return "category-business"; // default
  };

  return (
    <article
      className={`news-card ${featured ? "col-span-full md:col-span-2" : ""}`}
    >
      <div className="relative">
        <img
          src={
            article.urlToImage ||
            "https://via.placeholder.com/400x250?text=No+Image"
          }
          alt={article.title}
          className={`news-card-image ${featured ? "h-64" : "h-48"}`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://via.placeholder.com/400x250?text=No+Image";
          }}
        />
        {featured && (
          <div className="absolute top-4 left-4">
            <span className="bg-cnn-red text-white px-3 py-1 rounded-full text-sm font-semibold">
              FEATURED
            </span>
          </div>
        )}
      </div>

      <div className="news-card-content">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`category-badge ${getCategoryClass(
              article.source.name
            )}`}
          >
            {article.source.name}
          </span>
        </div>

        <h3 className={`news-title ${featured ? "text-xl" : "text-lg"}`}>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cnn-red transition-colors duration-200"
          >
            {article.title}
          </a>
        </h3>

        {article.description && (
          <p className="news-description">{article.description}</p>
        )}

        <div className="news-meta">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(article.publishedAt)}</span>
          </div>
          {article.author && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{article.author}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
