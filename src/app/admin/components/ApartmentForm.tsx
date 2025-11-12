"use client";
import { useState, useEffect } from "react";
import ImageUploader from "./ImageUploader";

const PROPERTY_TYPES = ["Studio", "1 Bedroom", "2 Bedrooms", "3+ Bedrooms"];
const FURNISHED_OPTIONS = ["Yes", "No"];

export default function ApartmentForm({ apartment, onSave, onCancel, onRefresh }) {
  const [form, setForm] = useState({
    title: "",
    price: "",
    location: "",
    description: "",
    bedrooms: 1,
    bathrooms: 1,
    propertyType: "",
    furnished: "",
    images: [],
    available: true,
    campusVan: "",
    mapUrl: "",
    kitchen: "",
    gym: "",
    swimmingPool: "",
    electricityRate: "",
  });

  const [status, setStatus] = useState("");

  useEffect(() => {
    if (apartment) {
      setForm({
        title: apartment.title || "",
        price: apartment.price?.toString() || "",
        location: apartment.location || "",
        description: apartment.description || "",
        bedrooms: apartment.bedrooms ?? 1,
        bathrooms: apartment.bathrooms ?? 1,
        propertyType: apartment.propertyType || "",
        furnished: apartment.furnished || "",
        images: apartment.images || [],
        available: apartment.available ?? true,
        campusVan: apartment.campusVan || "",
        mapUrl: apartment.mapUrl || "",
        kitchen: apartment.kitchen || "",
        gym: apartment.gym || "",
        swimmingPool: apartment.swimmingPool || "",
        electricityRate: apartment.electricityRate?.toString() || "",
      });
    } else {
      setForm({
        title: "",
        price: "",
        location: "",
        description: "",
        bedrooms: 1,
        bathrooms: 1,
        propertyType: "",
        furnished: "",
        images: [],
        available: true,
        campusVan: "",
        mapUrl: "",
        kitchen: "",
        gym: "",
        swimmingPool: "",
        electricityRate: "",
      });
    }
  }, [apartment]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.price ||
      !form.location ||
      !form.propertyType ||
      !form.furnished ||
      form.images.length === 0 ||
      !form.electricityRate
    ) {
      return alert("Please fill all required fields and upload at least one image");
    }

    setStatus("Saving...");

    const cleanValue = (val) => (typeof val === "string" ? val.trim() || null : val);

    // --- Normalize map input (accepts iframe, URL, or plain text) ---
    let mapUrlValue = form.mapUrl ? form.mapUrl.trim() : null;
    if (mapUrlValue) {
      const iframeMatch = mapUrlValue.match(/<iframe[^>]+src=["']([^"']+)["']/i);
      if (iframeMatch) {
        mapUrlValue = iframeMatch[1];
      } else if (/^https?:\/\//i.test(mapUrlValue)) {
        // URL provided (convert non-embed link)
        if (!/\/embed|output=embed/.test(mapUrlValue)) {
          mapUrlValue = `https://www.google.com/maps?q=${encodeURIComponent(mapUrlValue)}&output=embed`;
        }
      } else {
        // Non-URL plain text (treat as search query)
        mapUrlValue = `https://www.google.com/maps?q=${encodeURIComponent(mapUrlValue)}&output=embed`;
      }
    }

    const payload = {
      ...(apartment?._id && { _id: apartment._id }),
      title: form.title || null,
      price: form.price ? Number(form.price) : null,
      location: form.location || null,
      description: cleanValue(form.description),
      bedrooms: form.bedrooms !== "" ? Number(form.bedrooms) : null,
      bathrooms: form.bathrooms !== "" ? Number(form.bathrooms) : null,
      propertyType: form.propertyType || null,
      furnished: form.furnished || null,
      images: Array.isArray(form.images) ? form.images : [],
      available: form.available ?? true,
      campusVan: cleanValue(form.campusVan),
      mapUrl: cleanValue(mapUrlValue),
      kitchen: cleanValue(form.kitchen),
      gym: cleanValue(form.gym),
      swimmingPool: cleanValue(form.swimmingPool),
      electricityRate: form.electricityRate ? Number(form.electricityRate) : null,
    };

    Object.keys(payload).forEach((k) => {
      if (payload[k] === undefined) payload[k] = null;
    });

    const method = apartment?._id ? "PUT" : "POST";
    const url = apartment?._id ? `/api/apartments/${apartment._id}` : "/api/apartments";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus(apartment ? "Updated!" : "Added!");
        onSave();
        onRefresh && (await onRefresh());
      } else {
        setStatus(`Error: ${data.error}`);
        if (res.status === 401) alert("Unauthorized: Please sign in as admin");
      }
    } catch (error) {
      setStatus("Network error");
      console.error("Save failed:", error);
    }
  };

  const handleImage = (url) => {
    setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="glass rounded-3xl p-6 md:p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {apartment ? "Edit Apartment" : "Add New Apartment"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Title *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <input
            type="number"
            placeholder="Price (THB) *"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
            min="0"
            className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <input
            type="text"
            placeholder="Location *"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
            className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          {/* Amenities */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["kitchen", "gym", "swimmingPool", "campusVan"].map((amenity) => (
              <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!form[amenity]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [amenity]: e.target.checked ? "Available" : null,
                    })
                  }
                  className="w-5 h-5 text-indigo-600 rounded"
                />
                <span>
                  {amenity === "campusVan"
                    ? "Campus Van"
                    : amenity.charAt(0).toUpperCase() + amenity.slice(1).replace(/([A-Z])/g, " $1")}
                </span>
              </label>
            ))}
          </div>

          <input
            type="number"
            placeholder="Electricity Rate (THB/unit) *"
            value={form.electricityRate}
            onChange={(e) => setForm({ ...form, electricityRate: e.target.value })}
            required
            step="0.01"
            min="0"
            className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <select
            value={form.propertyType}
            onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
            required
            className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Property Type *</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            value={form.furnished}
            onChange={(e) => setForm({ ...form, furnished: e.target.value })}
            required
            className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Furnished? *</option>
            {FURNISHED_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Bedrooms / Bathrooms */}
        <div className="grid grid-cols-3 gap-4">
          <select
            value={form.bedrooms}
            onChange={(e) => setForm({ ...form, bedrooms: Number(e.target.value) })}
            className="px-4 py-3 rounded-xl border border-gray-300"
          >
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} Bed{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
          <select
            value={form.bathrooms}
            onChange={(e) => setForm({ ...form, bathrooms: Number(e.target.value) })}
            className="px-4 py-3 rounded-xl border border-gray-300"
          >
            {[1, 2, 3].map((n) => (
              <option key={n} value={n}>
                {n} Bath
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.available}
              onChange={(e) => setForm({ ...form, available: e.target.checked })}
              className="w-5 h-5 text-indigo-600 rounded"
            />
            <span>Available</span>
          </label>
        </div>

        {/* Description */}
        <textarea
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
        />

        {/* Images */}
        <div>
          <p className="text-sm font-medium mb-2">Images *</p>
          <ImageUploader onUpload={handleImage} />
          <div className="flex flex-wrap gap-3 mt-4">
            {form.images.map((url, i) => (
              <div key={i} className="relative group">
                <img
                  src={url}
                  alt={`Upload ${i + 1}`}
                  className="w-24 h-24 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Google Map */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Google Maps (iframe / link / text)
          </label>
          <textarea
            placeholder='Paste Google Maps iframe, URL, or name (e.g. "I-Space suite")'
            value={form.mapUrl}
            onChange={(e) => setForm({ ...form, mapUrl: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Accepts iframe HTML, link, or plain text.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all"
          >
            {apartment ? "Update" : "Add"} Apartment
          </button>
          {apartment && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition"
            >
              Cancel
            </button>
          )}
        </div>

        {status && (
          <p
            className={`text-center text-sm font-medium ${
              status.includes("Error") ? "text-red-600" : "text-green-600"
            }`}
          >
            {status}
          </p>
        )}
      </form>
    </div>
  );
}
