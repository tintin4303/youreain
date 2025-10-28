// src/app/components/ApartmentCard.jsx
"use client";
import { useState } from "react";
import ApartmentModal from "./ApartmentModal";

export default function ApartmentCard({ apt }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="glass glass-card group cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
      >
        {/* ... same image + content ... */}
        <div className="p-5 space-y-3">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {apt.title}
          </h3>
          {/* ... location, features ... */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-2xl font-bold text-indigo-600">฿{apt.price.toLocaleString()}</p>
              <p className="text-xs text-gray-500">per month</p>
            </div>
            <button className="glass-btn text-sm px-5 py-2.5 font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <ApartmentModal apt={apt} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}