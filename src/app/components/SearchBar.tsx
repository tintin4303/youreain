// src/app/components/SearchBar.jsx
"use client";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="relative">
      <div className="flex items-center h-12 glass-search overflow-hidden">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search apartments..."
          className="flex-1 bg-transparent outline-none text-gray-800 placeholder:text-gray-600 px-4 text-sm"
        />
        <div className="flex items-center gap-1 pr-2">
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                type="button"
                onClick={handleClear}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}