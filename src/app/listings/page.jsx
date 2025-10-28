// src/app/listings/page.jsx
"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import ApartmentCard from "../components/ApartmentCard";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";
import dbConnect from "@/lib/mongodb";
import Apartment from "@/models/Apartment";

export default function Listings() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApartments() {
      try {
        await dbConnect();
        const data = await fetch('/api/apartments');
        const allApartments = await data.json();
        setApartments(allApartments);
      } catch (error) {
        console.error('Failed to fetch apartments', error);
      } finally {
        setLoading(false);
      }
    }
    fetchApartments();
  }, []);

  const searchParams = useSearchParams();
  const search = (searchParams.get("search") || "").toLowerCase();

  const filtered = apartments.filter((apt) =>
    apt.title.toLowerCase().includes(search)
  );

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
      <section className="min-h-screen py-10 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 opacity-70"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-5">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              ABAC Bang Na Apartments
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Verified condos near Assumption University Suvarnabhumi Campus — search by name.
            </p>
          </div>

          <SearchBar />

          <p className="text-center text-gray-600 mt-6">
            {filtered.length} {filtered.length === 1 ? "apartment" : "apartments"} found for{" "}
            <span className="font-semibold">"{search || "all"}"</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <p className="text-xl text-gray-500">
                  No apartments match "<span className="font-semibold">{search}</span>".
                </p>
                <p className="text-sm text-gray-400 mt-2">Try searching "D Condo", "Landmark", or "NOP"</p>
              </div>
            ) : (
              filtered.map((apt) => <ApartmentCard key={apt._id} apt={apt} />)
            )}
          </div>
        </div>
      </section>
    </>
  );
}