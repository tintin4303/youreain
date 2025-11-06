// app/admin/components/ApartmentList.jsx
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function ApartmentList() {
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = async () => {
    const res = await fetch("/api/apartments");
    const data = await res.json();
    setApartments(data);
  };

  const deleteApartment = async (id) => {
    if (!confirm("Delete this apartment?")) return;
    await fetch(`/api/apartments/${id}`, { method: "DELETE" });
    fetchApartments();
  };

  return (
    <div className="glass rounded-3xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">All Apartments</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apartments.map((apt) => (
          <div key={apt._id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative h-48">
              <Image
                src={apt.images[0]}
                alt={apt.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg">{apt.title}</h3>
              <p className="text-indigo-600 font-semibold">฿{apt.price.toLocaleString()}/mo</p>
              <p className="text-sm text-gray-600">{apt.location}</p>
              <button
                onClick={() => deleteApartment(apt._id)}
                className="mt-3 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}