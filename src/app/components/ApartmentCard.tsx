// src/app/components/ApartmentCard.tsx
"use client";

import { useState } from "react";
import ApartmentModal from "./ApartmentModal";
import Image from "next/image";
import { Heart, Zap, Dumbbell, Utensils, Waves, Car } from "lucide-react";

const DEFAULT_IMAGE =
  "https://res.cloudinary.com/demo/image/upload/v1317847384/sample.jpg";

interface Apartment {
  _id: string;
  title: string;
  price: number;
  location: string;
  description?: string;
  images: string[];
  available?: boolean;
  bed?: number;
  bathrooms?: number;
  propertyType?: string;
  furnished?: string;
  campusVan?: string | null;
  mapUrl?: string | null;
  kitchen?: string | null;
  gym?: string | null;
  swimmingPool?: string | null;
  electricityRate?: number | null;
  isFavorited?: boolean;
  loading?: boolean;
}

interface ApartmentCardProps {
  apt: Apartment;
  isFavorited?: boolean;
  loading?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export default function ApartmentCard({
  apt,
  isFavorited = false,
  loading = false,
  onToggleFavorite,
}: ApartmentCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const previewImage =
    Array.isArray(apt.images) && apt.images[0] ? apt.images[0] : DEFAULT_IMAGE;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite && !loading) {
      onToggleFavorite(apt._id);
    }
  };

  // 🔹 Amenities that exist on this apartment
  const amenities = [
    apt.kitchen && { icon: <Utensils className="w-4 h-4" />, label: "Kitchen" },
    apt.gym && { icon: <Dumbbell className="w-4 h-4" />, label: "Gym" },
    apt.swimmingPool && { icon: <Waves className="w-4 h-4" />, label: "Pool" },
    apt.campusVan && { icon: <Car className="w-4 h-4" />, label: "Van" },
  ].filter(Boolean) as { icon: JSX.Element; label: string }[];

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

          {/* ❤️ Favorite */}
          <button
            onClick={handleToggle}
            disabled={loading}
            className={`
              absolute top-3 right-3 p-2 rounded-full transition-all duration-200
              ${isFavorited
                ? "bg-indigo-600 text-white shadow-lg scale-110"
                : "bg-white/80 dark:bg-gray-900/80 text-gray-600 hover:bg-white dark:hover:bg-gray-800 hover:text-indigo-600"
              }
              ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}
            `}
            aria-label={isFavorited ? "Unfavorite" : "Favorite"}
          >
            <Heart
              className={`w-5 h-5 transition-all ${isFavorited ? "fill-current" : ""}`}
            />
          </button>
        </div>

        <div className="p-4 space-y-2">
          {/* Title */}
          <h3 className="font-semibold text-base line-clamp-2">
            {apt.title || "Untitled Apartment"}
          </h3>

          {/* Price */}
          <div className="flex items-baseline justify-between">
            <p className="text-lg font-bold text-indigo-400">
              ฿{(apt.price || 0).toLocaleString()}
            </p>
            <p className="text-xs ">per month</p>
          </div>

          {/* Electricity Rate */}
          {apt.electricityRate != null && (
            <div className="flex items-center text-xs  gap-1">
              <Zap className="w-3 h-3 text-yellow-500" />
              {apt.electricityRate.toFixed(2)} ฿/unit
            </div>
          )}

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {amenities.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 text-xs bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-lg"
                >
                  {a.icon}
                  <span>{a.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <ApartmentModal
        apt={apt}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
