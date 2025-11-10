"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFilters } from "../../context/FilterContext";
import { Suspense } from "react";

export default function SearchBar() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SearchBarComponent />
    </Suspense>
  );
}

function SearchBarComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") || "";
  const { filters, setFilters } = useFilters();

  const [query, setQuery] = useState(currentSearch);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [furnished, setFurnished] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync URL → input
  useEffect(() => {
    setQuery(currentSearch);
  }, [currentSearch]);

  // Sync filters → local state
  useEffect(() => {
    setMaxPrice(filters.maxPrice?.toString() || "");
    setBedrooms(filters.bedrooms?.toString() || "");
    setPropertyType(filters.propertyType || "");
    setFurnished(filters.furnished || "");
  }, [filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/listings?search=${encodeURIComponent(q)}` : "/listings");
  };

  // CLEAR WORKS 100%
  const handleClear = () => {
    setQuery("");
    setMaxPrice("");
    setBedrooms("");
    setPropertyType("");
    setFurnished("");
    router.push("/listings");
    setFilters({ maxPrice: null, bedrooms: null, propertyType: null, furnished: null });
    inputRef.current?.focus();
  };

  const applyFilter = () => {
    setFilters({
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      propertyType: propertyType || undefined,
      furnished: furnished || undefined,
    });
    setDrawerOpen(false);
  };

  const hasActiveFilter = currentSearch || maxPrice || bedrooms || propertyType || furnished;

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="flex items-center h-11 glass-search overflow-hidden">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search apartments..."
          className="w-40 md:w-56 lg:w-64 bg-transparent outline-none text-gray-800 placeholder:text-gray-600 px-4 text-sm"
        />

        <div className="flex items-center gap-1 pr-2 ml-auto">
          <button type="submit" className="glass-btn p-2">
            <Search className="w-5 h-5" />
          </button>

          <button type="button" onClick={() => setDrawerOpen(true)} className="glass-btn p-2">
            <Filter className="w-5 h-5" />
          </button>

          <AnimatePresence>
            {hasActiveFilter && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                type="button"
                onClick={handleClear}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </form>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setDrawerOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-3 right-0 w-80 h-fit z-50 glass-menu rounded-xl p-6 shadow-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Filter Apartments</h2>
                <button onClick={() => setDrawerOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <label className="block text-sm mb-2">Max Price (THB)</label>
              <input
                type="number"
                className="glass-input mb-4"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />

              <label className="block text-sm mb-2">Min Bedrooms</label>
              <input
                type="number"
                className="glass-input mb-4"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
              />

              <label className="block text-sm mb-2">Property Type</label>
              <select
                className="glass-input mb-4"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="">Any</option>
                <option value="Studio">Studio</option>
                <option value="1 Bedroom">1 Bedroom</option>
                <option value="2 Bedrooms">2 Bedrooms</option>
                <option value="3+ Bedrooms">3+ Bedrooms</option>
              </select>

              <label className="block text-sm mb-2">Furnished</label>
              <select
                className="glass-input mb-6"
                value={furnished}
                onChange={(e) => setFurnished(e.target.value)}
              >
                <option value="">Any</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>

              <button
                onClick={applyFilter}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition"
              >
                Apply Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}