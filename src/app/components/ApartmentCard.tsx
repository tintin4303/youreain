// src/app/components/ApartmentCard.tsx
"use client";
import { useState } from "react";
import ApartmentModal from "./ApartmentModal";
import Image from "next/image";

const DEFAULT_IMAGE = "https://res.cloudinary.com/demo/image/upload/v1317847384/sample.jpg";

export default function ApartmentCard({ apt }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // SAFE: Ensure images exist and pick first
  const previewImage = Array.isArray(apt.images) && apt.images[0] ? apt.images[0] : DEFAULT_IMAGE;

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="glass glass-card group cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2">        <div className="relative w-full h-48 md:h-56">
          <Image
            src={previewImage}
            alt={apt.title || "Apartment"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            priority
          />
        </div>

        <div className="p-5 space-y-3">
          <h3 className="text-lg md:text-xl font-bold line-clamp-2">
            {apt.title || "Untitled Apartment"}
          </h3>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-lg md:text-sm">
                ฿{(apt.price || 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-300">per month</p>
            </div>
            <button className="glass-btn text-sm px-5 py-2.5 font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              View Details
            </button>
          </div>
        </div>
      </div>

      <ApartmentModal apt={apt} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}