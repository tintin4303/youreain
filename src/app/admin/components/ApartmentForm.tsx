// app/admin/components/ApartmentForm.jsx
"use client";
import { useState } from "react";
import ImageUploader from "../../components/ImageUploader";

export default function ApartmentForm() {
  const [form, setForm] = useState({
    title: "",
    price: "",
    location: "",
    description: "",
    bedrooms: 1,
    bathrooms: 1,
    size: "",
    images: [],
  });
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.images.length === 0) {
      alert("Please upload at least one image");
      return;
    }

    setStatus("Saving...");
    const res = await fetch("/api/apartments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        size: Number(form.size) || undefined,
      }),
    });

    if (res.ok) {
      setStatus("Apartment added!");
      setForm({
        title: "",
        price: "",
        location: "",
        description: "",
        bedrooms: 1,
        bathrooms: 1,
        size: "",
        images: [],
      });
    } else {
      setStatus("Failed to save");
    }
  };

  const handleImageUpload = (url) => {
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
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Apartment</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <input
            type="number"
            placeholder="Price (THB)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
            className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <input
            type="text"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
            className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <input
            type="number"
            placeholder="Size (m²)"
            value={form.size}
            onChange={(e) => setForm({ ...form, size: e.target.value })}
            className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <select
            value={form.bedrooms}
            onChange={(e) => setForm({ ...form, bedrooms: Number(e.target.value) })}
            className="px-4 py-3 rounded-xl border border-gray-300"
          >
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n} Bed</option>
            ))}
          </select>
          <select
            value={form.bathrooms}
            onChange={(e) => setForm({ ...form, bathrooms: Number(e.target.value) })}
            className="px-4 py-3 rounded-xl border border-gray-300"
          >
            {[1, 2, 3].map((n) => (
              <option key={n} value={n}>{n} Bath</option>
            ))}
          </select>
          <div></div>
        </div>

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
        />

        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Upload Images</p>
          <ImageUploader onUpload={handleImageUpload} />
          <div className="flex flex-wrap gap-3 mt-4">
            {form.images.map((url, i) => (
              <div key={i} className="relative group">
                <img src={url} alt="" className="w-24 h-24 object-cover rounded-xl" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Add Apartment"}
        </button>
        {status && <p className="text-center text-sm mt-2">{status}</p>}
      </form>
    </div>
  );
}