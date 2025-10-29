// src/app/components/SearchBar.jsx
"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import FilterDrawer from "./FilterDrawer";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") || "";

  const [query, setQuery] = useState(currentSearch);

  useEffect(() => {
    setQuery(currentSearch);
  }, [currentSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/listings?search=${encodeURIComponent(q)}`);
    } else {
      router.push("/listings");
    }
  };

  const handleClear = () => {
    setQuery("");
    router.push("/listings");
  };

  return (
    <div className="flex flex-col items-center gap-3 mx-auto mt-8 max-w-md w-full">
      <form onSubmit={handleSearch} className="flex-1 glass-search">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search ABAC Bang Na apartments (e.g. 'D Condo')"
          className="flex-1 bg-transparent outline-none text-gray-800 placeholder:text-gray-600 px-3"
        />
        <button
          type="submit"
          className="glass-btn text-sm px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Search
        </button>
      </form>
      <div className="flex gap-2">
        <FilterDrawer onFilter={(f) => console.log("Filters:", f)} />
        <Link
          href="/listings"
          onClick={handleClear}
          className={`rounded-full flex items-center text-sm px-5 py-2 transition-all duration-300 whitespace-nowrap ${
            currentSearch
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          style={{ pointerEvents: currentSearch ? "auto" : "none" }}
        >
          Clear
        </Link>
      </div>
    </div>
  );
}