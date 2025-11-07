// src/app/listings/page.jsx
"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import ApartmentCard from "../components/ApartmentCard";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

export default function Listings() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ maxPrice: null, bedrooms: null });

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

  // APPLY SEARCH + PRICE + BEDROOMS FILTER
  const filtered = apartments.filter((apt) => {
    // Search by title
    if (search && !apt.title.toLowerCase().includes(search)) return false;

    // Max Price
    if (filters.maxPrice && apt.price > filters.maxPrice) return false;

    // Min Bedrooms
    if (filters.bedrooms && apt.bedrooms < filters.bedrooms) return false;

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
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
        <SignedIn>
          <Suspense fallback={<div>Loading...</div>}>
      <Navbar />
      <section className="min-h-screen py-10 px-6 relative">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-5">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              ABAC Bang Na Apartments
            </h1>
          </div>

          {/* SEARCH + FILTERS */}
          <SearchBar onFilter={setFilters} />

          <p className="text-center text-gray-600 mt-6">
            {filtered.length} {filtered.length === 1 ? "apartment" : "apartments"} found
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
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
              filtered.map((apt) => <ApartmentCard key={apt._id} apt={apt} />)
            )}
          </div>
        </div>
      </section>
      </Suspense>
      </SignedIn>
    </>
  );
}