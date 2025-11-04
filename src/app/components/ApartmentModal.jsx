// src/app/components/ApartmentModal.jsx
"use client";
import { motion } from "framer-motion";
import { X, MapPin, Bed, Bath, Square, MessageCircle } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import emailjs from "emailjs-com";

export default function ApartmentModal({ apt, isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const form = useRef();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Sending...");
    emailjs
      .sendForm("service_t24txl9", "template_71kvt4w", form.current, "X8eA-Y4B1Jg8GrShF")
      .then(() => {
        setStatus("Inquiry sent! Owner will reply soon.");
        e.target.reset();
      })
      .catch((error) => {
        console.error(error);
        setStatus("Failed to send. Try LINE.");
      });
  };

  if (!apt || !isOpen) return null;

  const modalContent = (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
      />

      {/* Modal container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 30, stiffness: 400 }}
        className="fixed inset-4 md:inset-8 lg:inset-12 xl:inset-16 z-[100] overflow-y-auto"
      >
        <div className="glass rounded-3xl shadow-xl max-w-4xl mx-auto p-6 md:p-8 lg:p-10 bg-white/95 backdrop-blur-xl border border-white/30 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-white/30 backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-white/50 z-10 shadow-md"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>

          {/* Image */}
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-6 shadow-md">
            <img src={apt.images[0]} alt={apt.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-3xl font-bold drop-shadow-2xl">฿{apt.price.toLocaleString()}/mo</p>
            </div>
          </div>

          {/* Title & Location */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{apt.title}</h1>
          <div className="flex items-center text-gray-600 mb-6">
            <MapPin className="w-5 h-5 text-indigo-600 mr-2" />
            <span className="text-base">{apt.location}</span>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-gray-50 p-4 rounded-xl">
            {apt.bedrooms && (
              <div className="flex items-center gap-2 text-gray-700">
                <Bed className="w-5 h-5 text-indigo-600" />
                <span>{apt.bedrooms} Bed{apt.bedrooms > 1 ? "s" : ""}</span>
              </div>
            )}
            {apt.bathrooms && (
              <div className="flex items-center gap-2 text-gray-700">
                <Bath className="w-5 h-5 text-indigo-600" />
                <span>{apt.bathrooms} Bath</span>
              </div>
            )}
            {apt.size && (
              <div className="flex items-center gap-2 text-gray-700">
                <Square className="w-5 h-5 text-indigo-600" />
                <span>{apt.size} m²</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-700">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
              <span>Available</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">About this apartment</h2>
            <p className="text-gray-600 leading-relaxed text-base">{apt.description}</p>
          </div>

          {/* Contact Form */}
          <div className="glass p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200">
            <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">Contact the Owner</h2>

            <form ref={form} onSubmit={handleSubmit} className="space-y-4 mb-6">
              <input type="hidden" name="apartment_title" value={apt.title} />
              <input type="hidden" name="apartment_id" value={apt._id || ""} />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                <input
                  type="email"
                  value={email}
                  name="user_email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={message}
                  name="message"
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none"
                  placeholder="Hi, I'm interested in this apartment..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-md"
              >
                Send Inquiry
              </button>

              {status && (
                <p className={`text-center text-sm mt-2 ${status.includes("sent") ? "text-green-600" : "text-gray-600"}`}>
                  {status}
                </p>
              )}
            </form>

            {/* LINE Section */}
            <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
              <div className="h-px bg-gray-300 flex-1"></div>
              <span className="text-sm">or</span>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 mb-3">Scan to chat on LINE</p>
                <div className="bg-white p-4 rounded-xl shadow-inner mx-auto w-fit">
                  <img src="/line-qr.png" alt="LINE QR Code" className="w-32 h-32" />
                </div>
              </div>
              <a
                href="https://line.me/ti/p/~youreain"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-600 text-white py-3.5 rounded-xl hover:bg-green-700 transition-colors font-medium shadow-md"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on LINE
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );

  return createPortal(modalContent, document.body);
}
