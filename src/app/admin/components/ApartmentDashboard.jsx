// src/admin/components/ApartmentDashboard.jsx
"use client";
import { useState, useEffect } from "react";
import ApartmentForm from "./ApartmentForm";
import ApartmentList from "./ApartmentList";

export default function ApartmentDashboard() {
  const [apartments, setApartments] = useState([]);
  const [editingApartment, setEditingApartment] = useState(null);

  const fetchApartments = async () => {
    try {
      const res = await fetch("/api/apartments?admin=true");
      const data = await res.json();
      setApartments(data);
    } catch (err) {
      console.error("Failed to fetch apartments");
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  const handleEdit = (apt) => {
    setEditingApartment(apt);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this apartment permanently?")) return;
    await fetch(`/api/apartments?id=${id}`, { method: "DELETE" });
    fetchApartments();
  };

  const handleSave = () => {
    setEditingApartment(null);
    fetchApartments();
  };

  const handleCancel = () => {
    setEditingApartment(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-green-600">Protected by Clerk</p>
        </div>

        {/* ADD / EDIT FORM */}
        <div className="glass rounded-3xl p-6 md:p-8 shadow-lg">
          <ApartmentForm
            apartment={editingApartment}
            onSave={handleSave}
            onCancel={handleCancel}
            onRefresh={fetchApartments}
          />
        </div>

        {/* LIST */}
        <ApartmentList
          apartments={apartments}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}