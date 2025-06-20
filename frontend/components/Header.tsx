"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Home } from "lucide-react";

const SCRAPER_API_URL = "http://localhost:8000/api";

const mainNavLinksConfig = [
  "world",
  "politics",
  "business",
  "sports",
  "entertainment",
  "technology",
];
const moreNavLinksConfig = [
  "style",
  "travel",
  "science",
  "climate",
  "weather",
  "health",
  "opinion",
];

// --- Overlay Menu Component ---
const OverlayMenu = ({
  isOpen,
  onClose,
  categories,
}: {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
}) => {
  // Effect to prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 bg-black/95 z-50 transition-transform duration-500 ease-in-out
                ${isOpen ? "transform-none" : "-translate-y-full"}`}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-50"
        aria-label="Close menu"
      >
        <div className="w-8 h-8 flex items-center justify-center">
          <span className="block w-6 h-0.5 bg-current rotate-45 absolute"></span>
          <span className="block w-6 h-0.5 bg-current -rotate-45 absolute"></span>
        </div>
      </button>

      <div className="container mx-auto px-4 pt-20 h-full overflow-y-auto">
        {/* Search Bar */}
        <div className="relative mb-12">
          <input
            type="search"
            placeholder="Search the news..."
            className="w-full bg-transparent border-b-2 border-gray-600 text-white text-2xl py-3 focus:outline-none focus:border-cnn-red"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                window.location.href = `/search?q=${e.currentTarget.value}`;
              }
            }}
          />
          <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-500" />
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Main Categories */}
          <div className="md:col-span-3">
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-widest mb-4">
              Sections
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/category/${category.toLowerCase()}`}
                  onClick={onClose}
                  className="text-white text-2xl font-bold hover:text-cnn-red transition-colors"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Filters / More */}
          <div>
            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-widest mb-4">
              More
            </h3>
            <div className="flex flex-col space-y-4">
              <Link
                href="/search?q=latest&sortBy=publishedAt"
                onClick={onClose}
                className="text-white text-lg hover:text-cnn-red transition-colors"
              >
                Sort by Newest
              </Link>
              <Link
                href="/search?q=trending&sortBy=relevancy"
                onClick={onClose}
                className="text-white text-lg hover:text-cnn-red transition-colors"
              >
                Sort by Relevancy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Header Component ---
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const moreDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch ALL categories on component mount for the full-screen overlay menu
  useEffect(() => {
    async function getCategories() {
      try {
        const res = await fetch(`${SCRAPER_API_URL}/categories`);
        if (!res.ok) return;
        const data = await res.json();
        const sortedCategories = data.categories
          .filter((cat: string) => cat !== "top-stories")
          .sort();
        setAllCategories(sortedCategories);
      } catch (error) {
        console.error("Failed to fetch categories for header:", error);
      }
    }
    getCategories();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        moreDropdownRef.current &&
        !moreDropdownRef.current.contains(event.target as Node)
      ) {
        setIsMoreDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [moreDropdownRef]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4">
          {/* Top bar */}
          <div className="flex justify-between items-center h-28 relative">
            {/* Left: Hamburger Button */}
            <button
              onClick={toggleMenu}
              className="p-2 z-50 text-gray-700"
              aria-label="Toggle Menu"
            >
              <div className="w-6 h-6 flex flex-col justify-around">
                <span
                  className={`block w-full h-0.5 bg-current transition-transform duration-300 ease-in-out ${
                    isMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                ></span>
                <span
                  className={`block w-full h-0.5 bg-current transition-opacity duration-300 ease-in-out ${
                    isMenuOpen ? "opacity-0" : ""
                  }`}
                ></span>
                <span
                  className={`block w-full h-0.5 bg-current transition-transform duration-300 ease-in-out ${
                    isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                ></span>
              </div>
            </button>

            {/* Center: Logo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Link
                href="/"
                className="text-6xl font-extrabold text-cnn-red tracking-tighter"
              >
                NEWS Portal
              </Link>
            </div>

            {/* Right: Search Icon */}
            <Link
              href="/search"
              className="p-2 text-gray-700 hover:text-cnn-red"
              aria-label="Search"
            >
              <Search className="h-6 w-6" />
            </Link>
          </div>

          {/* Bottom bar with category navigation */}
          <nav className="flex justify-center items-center py-2 border-t">
            <div className="flex items-center">
              <div className="flex items-center overflow-x-auto space-x-6 pr-6">
                <Link
                  href="/"
                  className="text-gray-700 hover:text-cnn-red transition-colors"
                  aria-label="Homepage"
                >
                  <Home className="h-5 w-5" />
                </Link>
                {mainNavLinksConfig.map((category: string) => (
                  <Link
                    key={category}
                    href={`/category/${category.toLowerCase()}`}
                    className="text-sm font-semibold text-gray-700 hover:text-cnn-red uppercase tracking-wider transition-colors whitespace-nowrap"
                  >
                    {category.toUpperCase()}
                  </Link>
                ))}
              </div>

              {/* More Dropdown */}
              {moreNavLinksConfig.length > 0 && (
                <div className="relative" ref={moreDropdownRef}>
                  <button
                    onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
                    className="flex items-center text-sm font-semibold text-gray-700 hover:text-cnn-red uppercase tracking-wider transition-colors"
                  >
                    More
                    <svg
                      className={`w-4 h-4 ml-1 transition-transform ${
                        isMoreDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>
                  {isMoreDropdownOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border">
                      <div className="py-1">
                        {moreNavLinksConfig.map((category) => (
                          <Link
                            key={category}
                            href={`/category/${category.toLowerCase()}`}
                            onClick={() => setIsMoreDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-cnn-red transition-colors"
                          >
                            {category.charAt(0).toUpperCase() +
                              category.slice(1)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      <OverlayMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        categories={allCategories}
      />
    </>
  );
}
