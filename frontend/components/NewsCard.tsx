"use client";

import { format } from "date-fns";
import { Calendar, User, Camera } from "lucide-react";
import { NewsArticle } from "@/lib/newsApi";
import Image from "next/image";
import Link from "next/link";

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
}

export default function NewsCard({ article, featured = false }: NewsCardProps) {
  const { title, description, url, imageUrl, source, publishedAt } = article;
  const date = publishedAt
    ? new Date(publishedAt).toLocaleDateString()
    : "Date not available";

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
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
    >
      <div className="relative h-48 w-full">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <Camera className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col h-full">
        <h3 className="font-bold mb-2 text-gray-800 text-lg leading-tight">
          {title}
        </h3>
        {description && (
          <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>
        )}
        <div className="flex justify-between items-center text-xs text-gray-500 mt-auto pt-4">
          <span className="truncate pr-4">{source.name}</span>
          <span className="flex-shrink-0">{date}</span>
        </div>
      </div>
    </Link>
  );
}
