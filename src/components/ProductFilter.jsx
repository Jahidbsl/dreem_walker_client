"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";

export default function ProductFilter({ categories }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [categoryId, setCategoryId] = useState(searchParams.get("category_id") || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    if (categoryId) {
      params.set("category_id", categoryId);
    } else {
      params.delete("category_id");
    }

    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center"
    >
      {/* Search input */}
      <div className="relative flex-1 min-w-0">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full border border-[var(--border-color)] bg-[var(--surface)] text-[var(--ink)] placeholder:text-[var(--muted)] pl-10 pr-4 py-2.5 rounded-lg outline-none transition-colors focus:border-[var(--accent)]"
        />
      </div>

      {/* Category select */}
      <div className="relative w-full sm:w-56">
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full appearance-none border border-[var(--border-color)] bg-[var(--surface)] text-[var(--ink)] pl-4 pr-10 py-2.5 rounded-lg outline-none transition-colors focus:border-[var(--accent)] cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none"
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="w-full sm:w-auto bg-[var(--ink)] text-[var(--surface-alt)] px-6 py-2.5 rounded-lg font-medium transition-opacity hover:opacity-85 active:scale-[0.98] whitespace-nowrap"
      >
        Apply Filter
      </button>
    </form>
  );
}