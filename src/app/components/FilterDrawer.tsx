// src/app/components/FilterDrawer.jsx
"use client";
import { useState } from "react";
import { Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FilterDrawer({ onFilter }) {
  const [open, setOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");

  const applyFilter = () => {
    onFilter({
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
    });
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="glass-btn flex items-center gap-2 px-4 py-2 rounded-full text-gray-700"
      >
        <Filter className="w-5 h-5" /> Filter
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 w-80 h-full z-50 bg-white dark:bg-slate-900 p-6 shadow-xl"
            >
            <div className="flex flex-col justify-end  h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Filter Apartments</h2>
                <button onClick={() => setOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <label className="block text-sm mb-2">Max Price ($)</label>
              <input
                type="number"
                className="glass-input mb-4"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />

              <label className="block text-sm mb-2">Bedrooms</label>
              <input
                type="number"
                className="glass-input mb-6"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
              />

              <button
                onClick={applyFilter}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition"
              >
                Apply Filters
              </button>
            </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
