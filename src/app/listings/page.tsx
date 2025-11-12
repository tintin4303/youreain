// src/app/listings/page.tsx
"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import ApartmentCard from "../components/ApartmentCard";
import { useFilters } from "../../context/FilterContext";
import SearchBar from "../components/SearchBar";
import { useUser } from "@clerk/nextjs";
import { Heart, Zap, Dumbbell, Utensils, Waves, Car } from "lucide-react";

function ListingsContent() {
  const [apartments, setApartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loadingFavorites, setLoadingFavorites] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const { filters, setFilters } = useFilters();
  const { isSignedIn } = useUser();

  // Close sidebar if clicked outside (mobile only)
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    if (filterOpen) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterOpen]);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const res = await fetch("/api/apartments");
        const data = await res.json();
        setApartments(data);
      } catch (error) {
        console.error("Failed to fetch apartments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApartments();
  }, []);

  useEffect(() => {
    if (!isSignedIn) {
      setFavorites(new Set());
      return;
    }

    const fetchFavorites = async () => {
      try {
        const res = await fetch("/api/favorites");
        if (res.ok) {
          const data = await res.json();
          setFavorites(new Set(data.map((f: any) => f._id || f.apartmentId)));
        }
      } catch (err) {
        console.error("Failed to load favorites:", err);
      }
    };
    fetchFavorites();
  }, [isSignedIn]);

  const toggleFavorite = async (apartmentId: string) => {
    if (!isSignedIn) return;

    const wasFavorited = favorites.has(apartmentId);
    const newFavorites = new Set(favorites);
    if (wasFavorited) newFavorites.delete(apartmentId);
    else newFavorites.add(apartmentId);
    setFavorites(newFavorites);
    setLoadingFavorites((prev) => new Set(prev).add(apartmentId));

    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apartmentId }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setFavorites(favorites);
      }
    } catch {
      setFavorites(favorites);
    } finally {
      setLoadingFavorites((prev) => {
        const next = new Set(prev);
        next.delete(apartmentId);
        return next;
      });
    }
  };

  const filtered = apartments.filter((apt) => {
    if (searchQuery && !apt.title?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filters.maxPrice !== null && apt.price > filters.maxPrice) return false;
    if (filters.bedrooms !== null && apt.bedrooms < filters.bedrooms) return false;
    if (filters.propertyType && apt.propertyType !== filters.propertyType) return false;
    if (filters.furnished && apt.furnished !== filters.furnished) return false;
    if (filters.maxElectricity !== null && apt.electricityRate > filters.maxElectricity) return false;
    if (filters.kitchen && !apt.kitchen) return false;
    if (filters.gym && !apt.gym) return false;
    if (filters.swimmingPool && !apt.swimmingPool) return false;
    if (filters.campusVan && !apt.campusVan) return false;
    if (filters.showFavorites && !favorites.has(apt._id)) return false;
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
    <main className="pt-20 min-h-screen flex relative">
      {/* Background overlay for mobile */}
      {filterOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setFilterOpen(false)}
        />
      )}

      {/* Sidebar Filters */}
      <div
        ref={sidebarRef}
        className={`
          fixed top-20 bottom-0 left-0 w-72 overflow-y-auto z-40
          transform transition-transform duration-300
          ${filterOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          backdrop-blur-xl border-r border-neutral-300/40 p-6
        `}
      >
        {/* 🔥 your original sidebar content untouched */}
        <div className="my-6">
          <SearchBar onSearch={setSearchQuery} />
        </div>

        {isSignedIn && (
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.showFavorites || false}
                onChange={(e) => setFilters({ ...filters, showFavorites: e.target.checked })}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="flex items-center gap-2">
                Favorites
              </span>
            </label>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Max Price (THB)</label>
          <input
            type="number"
            value={filters.maxPrice || ""}
            onChange={(e) =>
              setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : null })
            }
            placeholder="e.g. 30000"
            className="w-full glass-input px-4 py-2 rounded-xl"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Max Electricity Rate (฿/unit)</label>
          <input
            type="number"
            value={filters.maxElectricity || ""}
            onChange={(e) =>
              setFilters({
                ...filters,
                maxElectricity: e.target.value ? Number(e.target.value) : null,
              })
            }
            placeholder="e.g. 5.5"
            step="0.1"
            className="w-full glass-input px-4 py-2 rounded-xl"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Min Bedrooms</label>
          <select
            value={filters.bedrooms || ""}
            onChange={(e) =>
              setFilters({ ...filters, bedrooms: e.target.value ? Number(e.target.value) : null })
            }
            className="w-full glass-input px-4 py-2 rounded-xl"
          >
            <option value="">Any</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3+</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Property Type</label>
          <select
            value={filters.propertyType || ""}
            onChange={(e) => setFilters({ ...filters, propertyType: e.target.value || null })}
            className="w-full glass-input px-4 py-2 rounded-xl"
          >
            <option value="">Any</option>
            <option value="Studio">Studio</option>
            <option value="1 Bedroom">1 Bedroom</option>
            <option value="2 Bedrooms">2 Bedrooms</option>
            <option value="3+ Bedrooms">3+ Bedrooms</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Furnished</label>
          <select
            value={filters.furnished || ""}
            onChange={(e) => setFilters({ ...filters, furnished: e.target.value || null })}
            className="w-full glass-input px-4 py-2 rounded-xl"
          >
            <option value="">Any</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div className="mb-6 space-y-3">
          <p className="text-sm font-medium">Amenities</p>
          {[
            { key: "kitchen", icon: <Utensils className="w-4 h-4" />, label: "Kitchen" },
            { key: "gym", icon: <Dumbbell className="w-4 h-4" />, label: "Gym" },
            { key: "swimmingPool", icon: <Waves className="w-4 h-4" />, label: "Swimming Pool" },
            { key: "campusVan", icon: <Car className="w-4 h-4" />, label: "Campus Van" },
          ].map(({ key, icon, label }) => (
            <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={!!filters[key]}
                onChange={(e) => setFilters({ ...filters, [key]: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              {icon}
              <span>{label}</span>
            </label>
          ))}
        </div>

        <button
          onClick={() => {
            setFilters({
              maxPrice: null,
              bedrooms: null,
              propertyType: null,
              furnished: null,
              showFavorites: false,
              kitchen: false,
              gym: false,
              swimmingPool: false,
              campusVan: false,
              maxElectricity: null,
            });
            setSearchQuery("");
          }}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl font-medium transition"
        >
          Clear All Filters
        </button>
      </div>

      {/* Toggle Button for mobile */}
      <button
        onClick={() => setFilterOpen(!filterOpen)}
        className="md:hidden fixed top-24 left-3 z-50 bg-indigo-500 text-white p-2 rounded-full shadow-lg"
      >
        {filterOpen ? "←" : "→"}
      </button>

      {/* Apartment Grid */}
      <div className="flex-1 md:ml-80 overflow-y-auto min-h-screen transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">
              {filtered.length} Apartment{filtered.length !== 1 ? "s" : ""}
            </h1>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500">No apartments match your filters.</p>
              <p className="text-sm text-gray-400 mt-2">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((apt) => {
                const isFavorited = favorites.has(apt._id);
                const isLoading = loadingFavorites.has(apt._id);
                return (
                  <ApartmentCard
                    key={apt._id}
                    apt={{ ...apt, isFavorited, loading: isLoading }}
                    onToggleFavorite={toggleFavorite}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ListingsContent />
    </Suspense>
  );
}
