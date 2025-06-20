"use client";

import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import Link from "next/link";

const categories = [
  { name: "World", href: "/" },
  { name: "Politics", href: "/category/politics" },
  { name: "Business", href: "/category/business" },
  { name: "Health", href: "/category/health" },
  { name: "Entertainment", href: "/category/entertainment" },
  { name: "Style", href: "/category/style" },
  { name: "Travel", href: "/category/travel" },
  { name: "Sports", href: "/category/sports" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button (Left) */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
              aria-label="Open menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Logo (Center on Mobile, Left on Desktop) */}
          <div className="flex-1 flex justify-center md:justify-start">
            <Link href="/" className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-cnn-red">NEWS</h1>
              <span className="text-gray-600 hidden md:block">Portal</span>
            </Link>
          </div>

          {/* Desktop Navigation (Hidden on Mobile) */}
          <nav className="hidden md:flex items-center space-x-6">
            {categories.map((category) => (
              <a
                key={category.name}
                href={category.href}
                className="text-gray-700 hover:text-cnn-red font-medium transition-colors duration-200"
              >
                {category.name}
              </a>
            ))}
          </nav>

          {/* Search Icon (Right) */}
          <div className="flex-1 flex justify-end">
            <Link href="/search" className="p-2" aria-label="Search">
              <Search className="h-6 w-6 text-gray-700 hover:text-cnn-red" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="md:hidden border-t border-gray-200">
          <ul className="flex flex-col items-start p-4 space-y-4">
            {categories.map((category) => (
              <li key={category.name}>
                <a
                  href={category.href}
                  className="text-gray-700 hover:text-cnn-red font-medium transition-colors duration-200"
                >
                  {category.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
