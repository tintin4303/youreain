"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Bed,
  Bath,
  MessageCircle,
  Zap,
  Car,
  Utensils,
  Dumbbell,
  Waves,
  Home,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import emailjs from "emailjs-com";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const DEFAULT_IMAGE =
  "https://res.cloudinary.com/demo/image/upload/v1317847384/sample.jpg";

export interface Apartment {
  _id: string;
  title: string;
  price: number;
  location: string;
  description?: string | null;
  images: string[];
  available?: boolean;
  bedrooms?: number | null;
  bathrooms?: number | null;
  propertyType?: string | null;
  furnished?: string | null;
  campusVan?: string | null;
  mapUrl?: string | null;
  kitchen?: string | null;
  gym?: string | null;
  swimmingPool?: string | null;
  electricityRate?: number | null;
}

interface ApartmentModalProps {
  apt: Apartment;
  isOpen: boolean;
  onClose: () => void;
}

export default function ApartmentModal({ apt, isOpen, onClose }: ApartmentModalProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [fullImage, setFullImage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setStatus("Sending...");
    try {
      await emailjs.sendForm(
        "service_t24txl9",
        "template_71kvt4w",
        formRef.current,
        "X8eA-Y4B1Jg8GrShF"
      );
      setStatus("Inquiry sent! Owner will reply soon.");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("Failed to send. Try LINE.");
    }
  };

  if (!apt || !isOpen) return null;

  const images =
    Array.isArray(apt.images) && apt.images.length > 0 ? apt.images : [DEFAULT_IMAGE];
  const hasMultipleImages = images.length > 1;

  const hasValue = (val: any) =>
    val !== null &&
    val !== undefined &&
    (typeof val === "number" || (typeof val === "string" && val.trim() !== ""));

  const amenities = [
    hasValue(apt.kitchen) && { icon: <Utensils className="w-4 h-4 text-orange-600" />, label: "Kitchen" },
    hasValue(apt.gym) && { icon: <Dumbbell className="w-4 h-4 text-blue-600" />, label: "Gym" },
    hasValue(apt.swimmingPool) && { icon: <Waves className="w-4 h-4 text-cyan-600" />, label: "Swimming Pool" },
    hasValue(apt.campusVan) && { icon: <Car className="w-4 h-4 text-green-600" />, label: "Campus Van" },
    hasValue(apt.bedrooms) && {
      icon: <Bed className="w-4 h-4 text-indigo-600" />,
      label: `${apt.bedrooms} Bed${apt.bedrooms! > 1 ? "s" : ""}`,
    },
    hasValue(apt.bathrooms) && {
      icon: <Bath className="w-4 h-4 text-orange-600" />,
      label: `${apt.bathrooms} Bathroom${apt.bathrooms! > 1 ? "s" : ""}`,
    },
  ].filter(Boolean) as { icon: JSX.Element; label: string }[];

  // Embed map handling
  const mapEmbedUrl =
    apt.mapUrl && apt.mapUrl.includes("embed")
      ? apt.mapUrl
      : null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-4 md:inset-10 z-[100] overflow-y-auto"
          >
            <div className="rounded-2xl shadow-2xl max-w-4xl mx-auto glass   relative overflow-hidden">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/70 hover:bg-white transition shadow"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>

              {/* 🖼️ Image Carousel */}
              <div className="relative h-96 md:h-[550px] overflow-hidden">
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation={hasMultipleImages}
                  pagination={hasMultipleImages ? { clickable: true } : false}
                  loop={hasMultipleImages}
                  className="h-full"
                >
                  {images.map((img, i) => (
                    <SwiperSlide key={i}>
                      <Image
                        src={img}
                        alt={apt.title}
                        fill
                        sizes="100vw"
                        className="object-cover cursor-pointer"
                        onClick={() => setFullImage(img)}
                        priority={i === 0}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Availability Badge — always show */}
                <div
                  className={`absolute top-4 z-51 left-4 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                    apt.available
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {apt.available ? (
                    <>
                      <CheckCircle className="w-3 h-3" />
                      Available
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3" />
                      Not Available
                    </>
                  )}
                </div>

                {/* Price badge — always show */}
                <div className="absolute bottom-4 z-51 left-4 glass  px-4 py-2 rounded-xl text-base font-semibold shadow">
                  ฿
                  {apt.price
                    ? apt.price.toLocaleString()
                    : "—"}/mo
                </div>
              </div>

              <div className="p-5 md:p-6">
                <h1 className="text-2xl font-semibold mb-1">{apt.title}</h1>
                <div className="flex items-center  text-sm mb-4">
                  <MapPin className="w-4 h-4 text-indigo-600 mr-1" />
                  {apt.location}
                </div>

                <div className="flex flex-wrap gap-2 mb-4 text-xs">
                  {apt.propertyType && (
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg flex items-center gap-1">
                      <Home className="w-3 h-3" />
                      {apt.propertyType}
                    </span>
                  )}
                  {apt.furnished && (
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg">
                      Furnished: {apt.furnished}
                    </span>
                  )}
                  {apt.electricityRate != null && (
                    <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-lg flex items-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-500" />
                      ฿{apt.electricityRate}/unit
                    </span>
                  )}
                </div>

                {amenities.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-base font-semibold text-gray-800 mb-2">Amenities</h2>
                    <div className="flex flex-wrap gap-2">
                      {amenities.map((a, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium"
                        >
                          {a.icon}
                          {a.label}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {hasValue(apt.description) && (
                  <div className="mb-6">
                    <h2 className="text-base font-semibold  mb-1">About This Apartment</h2>
                    <p className="text-sm leading-relaxed">{apt.description}</p>
                  </div>
                )}

                {mapEmbedUrl && (
                  <div className="mb-6">
                    <h2 className="text-base font-semibold  mb-2">Map</h2>
                    <div className="h-72 rounded-xl overflow-hidden">
                      <iframe
                        src={mapEmbedUrl}
                        width="100%"
                        height="100%"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>
                )}

                {/* Contact Form */}
                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className=" p-4 rounded-xl glass space-y-3"
                >
                  <h2 className="text-base font-semibold text-center mb-2">
                    Ask More
                  </h2>
                  <input type="hidden" name="apartment_title" value={apt.title} />
                  <input type="hidden" name="apartment_id" value={apt._id} />
                  <input
                    type="email"
                    name="user_email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full text-sm px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                  <textarea
                    name="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hi! I'm interested in this apartment."
                    required
                    rows={3}
                    className="w-full text-sm px-3 py-2 border border-neutral-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
                  >
                    Send Inquiry
                  </button>
                  {status && (
                    <p
                      className={`text-center text-xs ${
                        status.includes("sent") ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {status}
                    </p>
                  )}
                <div className="text-center mt-4">
                  <a
                    href="https://line.me/ti/p/~youreain"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:underline"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat on LINE
                  </a>
                </div>
                </form>
              </div>
            </div>
          </motion.div>

          {/* Full Image Viewer */}
          <AnimatePresence>
            {fullImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center"
                onClick={() => setFullImage(null)}
              >
                <motion.img
                  src={fullImage}
                  alt="Full"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="max-h-[90vh] max-w-[90vw] object-contain"
                />
                <button
                  className="absolute top-6 right-6 bg-white text-gray-800 rounded-full p-2 shadow"
                  onClick={() => setFullImage(null)}
                >
                  <X className="w-6 h-6" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
