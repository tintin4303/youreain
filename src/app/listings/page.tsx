"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import ApartmentCard from "../components/ApartmentCard";
import Navbar from "../components/Navbar";
import { useFilters } from "../../context/FilterContext";

function ListingsContent() {
  const [apartments, setApartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { filters } = useFilters();
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

  const filtered = apartments.filter((apt) => {
    if (search && !apt.title?.toLowerCase().includes(search)) return false;
    if (filters.maxPrice !== null && apt.price > filters.maxPrice) return false;
    if (filters.bedrooms !== null && apt.bedrooms < filters.bedrooms) return false;
    if (filters.propertyType && apt.propertyType !== filters.propertyType) return false;
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
      <Navbar />
      <main className="pt-20 md:pt-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <p className="text-xl text-gray-500">No apartments match your filters.</p>
                <p className="text-sm text-gray-400 mt-2">Try adjusting price, bedrooms, or search term.</p>
              </div>
            ) : (
              filtered.map((apt) => <ApartmentCard key={apt._id} apt={apt} />)
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ListingsContent />
    </Suspense>
  );
}