"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

const sortOptions = [
  { label: "Newest", value: "publishedAt" },
  { label: "Relevance", value: "relevancy" },
];

export default function SortBy() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSortBy = searchParams.get("sortBy") || "publishedAt";

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortBy = e.target.value;
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (newSortBy === "relevancy") {
      current.delete("sortBy");
    } else {
      current.set("sortBy", newSortBy);
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  return (
    <div className="mb-8 max-w-xs">
      <label
        htmlFor="sort-by"
        className="block text-sm font-bold text-gray-800 mb-2"
      >
        Sort By
      </label>
      <select
        id="sort-by"
        value={currentSortBy}
        onChange={handleSortChange}
        className="block w-full px-4 py-2 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
