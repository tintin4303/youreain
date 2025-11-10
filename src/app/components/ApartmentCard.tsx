// src/app/components/ApartmentCard.tsx
"use client";

import { useState } from "react";
import ApartmentModal from "./ApartmentModal";
import Image from "next/image";

const DEFAULT_IMAGE =
  "https://res.cloudinary.com/demo/image/upload/v1317847384/sample.jpg";

export default function ApartmentCard({ apt }: { apt: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const previewImage =
    Array.isArray(apt.images) && apt.images[0] ? apt.images[0] : DEFAULT_IMAGE;

  return (
    <>
      {/* CARD */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="
          group
          glass glass-card
          cursor-pointer
          rounded-2xl
          overflow-hidden
          transition-all
          duration-300
          hover:-translate-y-2
          hover:shadow-2xl
          bg-white/90
          dark:bg-gray-800/90
        "
      >
        {/* IMAGE - Fixed aspect ratio */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={previewImage}
            alt={apt.title || "Apartment"}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
        </div>

        {/* CONTENT */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-base line-clamp-2">
            {apt.title || "Untitled Apartment"}
          </h3>

          <div className="flex items-baseline justify-between">
            <p className="text-lg font-bold text-indigo-600">
              ฿{(apt.price || 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">per month</p>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <ApartmentModal
        apt={apt}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}