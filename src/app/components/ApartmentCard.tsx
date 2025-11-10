// src/app/components/ApartmentCard.jsx
"use client";
import { useState, useEffect } from "react";
import ApartmentModal from "./ApartmentModal";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useUser } from "@clerk/nextjs";

const DEFAULT_IMAGE =
  "https://res.cloudinary.com/demo/image/upload/v1317847384/sample.jpg";

export default function ApartmentCard({ apt }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, isSignedIn } = useUser();

  const previewImage =
    Array.isArray(apt.images) && apt.images[0] ? apt.images[0] : DEFAULT_IMAGE;

  // CHECK ON MOUNT
  useEffect(() => {
    if (!isSignedIn || !apt._id) {
      setIsFavorited(false);
      return;
    }

    let isMounted = true;

    const checkFavorite = async () => {
      try {
        const res = await fetch("/api/favorites", {
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok || !isMounted) return;
        const favorites = await res.json();
        const isFav = Array.isArray(favorites) && favorites.some(f => f._id === apt._id);
        if (isMounted) setIsFavorited(isFav);
      } catch (err) {
        console.error("Check favorite failed:", err);
      }
    };

    checkFavorite();

    return () => {
      isMounted = false;
    };
  }, [apt._id, isSignedIn]);

  // TOGGLE
  const toggleFavorite = async (e) => {
    e.stopPropagation();
    if (!isSignedIn || loading) return;

    const newFavorited = !isFavorited;
    setIsFavorited(newFavorited);
    setLoading(true);

    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apartmentId: apt._id }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setIsFavorited(!newFavorited);
        console.error("API error:", data.error);
        return;
      }

      setIsFavorited(data.isFavorited);
    } catch (err) {
      setIsFavorited(!newFavorited);
      console.error("Network error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="
          group glass glass-card cursor-pointer rounded-2xl overflow-hidden
          transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl
          bg-white/90 dark:bg-gray-800/90 relative
        "
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={previewImage}
            alt={apt.title || "Apartment"}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />

          <button
            onClick={toggleFavorite}
            disabled={loading || !isSignedIn}
            className={`
              absolute top-3 right-3 p-2 rounded-full transition-all duration-200
              ${isFavorited
                ? "bg-indigo-600 text-white shadow-lg scale-110"
                : "bg-white/80 dark:bg-gray-900/80 text-gray-600 hover:bg-white dark:hover:bg-gray-800 hover:text-indigo-600"
              }
              ${loading || !isSignedIn ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}
            `}
            aria-label={isFavorited ? "Unfavorite" : "Favorite"}
          >
            <Heart
              className={`w-5 h-5 transition-all ${isFavorited ? "fill-current" : ""}`}
            />
          </button>
        </div>

        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-base line-clamp-2">
            {apt.title || "Untitled Apartment"}
          </h3>
          <div className="flex items-baseline justify-between">
            <p className="text-lg font-bold text-indigo-500">
              ฿{(apt.price || 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">per month</p>
          </div>
        </div>
      </div>

      <ApartmentModal
        apt={apt}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}