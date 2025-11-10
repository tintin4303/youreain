// src/app/listings/page.jsx
"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import ApartmentCard from "../components/ApartmentCard";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ListingsContent />
    </Suspense>
  );
}

function ListingsContent() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    maxPrice: null,
    bedrooms: null,
    propertyType: null,
    furnished: null,
  });
  const searchParams = useSearchParams();
  const search = (searchParams.get("search") || "").toLowerCase();

  useEffect(() => {
    async function fetchApartments() {
      try {
        const res = await fetch("/api/apartments");
        const data = await res.json();
        setApartments(data);
      } catch (error) {
        console.error("Failed to fetch apartments", error);
      } finally {
        setLoading(false);
      }
    }
    fetchApartments();
  }, []);

  // FILTER LOGIC – NOW ACCEPTS ALL FIELDS
  const filtered = apartments.filter((apt) => {
    // Search in title
    if (search && !apt.title?.toLowerCase().includes(search)) return false;

    // Max Price
    if (filters.maxPrice !== null && apt.price > filters.maxPrice) return false;

    // Min Bedrooms
    if (filters.bedrooms !== null && apt.bedrooms < filters.bedrooms) return false;

    // Property Type
    if (filters.propertyType && apt.propertyType !== filters.propertyType) return false;

    // Furnished
    if (filters.furnished && apt.furnished !== filters.furnished) return false;

    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass p-8 rounded-3xl">Loading apartments...</div>
      </div>
    );
  }

  return (
    <>
      {/* MAIN CONTENT – STARTS BELOW NAVBAR */}
      <main className="pt-20 md:pt-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* GRID – 2 ON MOBILE, 3 ON DESKTOP */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <p className="text-xl text-gray-500">
                  No apartments match your filters.
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Try adjusting price, bedrooms, or search term.
                </p>
              </div>
            ) : (
              filtered.map((apt) => (
                <ApartmentCard key={apt._id} apt={apt} />
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
}