"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu, House, Heart } from "lucide-react";
import usePortal from "../hooks/usePortal";
import { createPortal } from "react-dom";
import SearchBar from "./SearchBar";
import { UserButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import ThemeToggle from "./ThemeToggle";
import ApartmentCard from "./ApartmentCard";
import ApartmentModal from "./ApartmentModal";

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedApt, setSelectedApt] = useState<any>(null);
  const [apartmentModalOpen, setApartmentModalOpen] = useState(false);

  const portalRoot = usePortal();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (
        (mobileMenu || favoritesOpen) &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(target) &&
        !buttonRef.current.contains(target)
      ) {
        setMobileMenu(false);
        setFavoritesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [mobileMenu, favoritesOpen]);

  // Fetch favorites
  useEffect(() => {
    if (!isSignedIn || !favoritesOpen) return;

    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/favorites");
        if (res.ok) {
          const data = await res.json();
          setFavorites(data);
        }
      } catch (err) {
        console.error("Failed to load favorites:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [isSignedIn, favoritesOpen]);

  // Open apartment modal from favorites
  const openApartmentModal = (apt: any) => {
    setSelectedApt(apt);
    setApartmentModalOpen(true);
    setFavoritesOpen(false);
    setMobileMenu(false);
  };

  return (
    <>
      {/* NAVBAR */}
      <nav
        id="nav"
        className="fixed top-0 left-0 right-0 flex items-center justify-between p-6 shadow-sm z-50 bg-white dark:bg-gray-900"
      >
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center">
            <div className="glass px-5 py-2 rounded-full flex items-center space-x-2">
              <h1 className="text-xl md:text-2xl font-bold">
                Your<span className="text-indigo-500">Eain</span>
              </h1>
            </div>
          </Link>
        </div>
        <div className="flex items-center space-x-3">
          <button
            ref={buttonRef}
            onClick={() => setMobileMenu((v) => !v)}
            className="p-2 glass rounded-full border border-white/30 transition hover:scale-105 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* MENU */}
      {portalRoot &&
        createPortal(
          <AnimatePresence>
            {mobileMenu && (
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="fixed top-24 right-6 z-100 md:right-8"
              >
                <div className="glass-menu rounded-xl w-80  p-2 flex flex-col font-medium border border-white/20  shadow-lg">
                  {/* Apartment */}
                  <Link
                    href="/listings"
                    onClick={() => setMobileMenu(false)}
                    className="py-2 px-4 hover:bg-gray-400/30 flex justify-between items-center rounded"
                  >
                    Apartments
                    <House className="w-5 h-5 text-indigo-400" />
                  </Link>

                  {/* Favorites Trigger */}
                  <button
                    onClick={() => {
                      setFavoritesOpen(true);
                      setMobileMenu(false);
                    }}
                    className="py-2 px-4 cursor-pointer hover:bg-gray-400/30 flex justify-between items-center rounded text-left"
                  >
                    Favorites
                    <Heart className="w-5 h-5 text-red-500" />
                  </button>

                  {/* Theme Toggle */}
                  <ThemeToggle />

                  {/* Divider */}
                  <div className="h-px bg-gray-300 my-1"></div>

                  {/* Auth */}
                  <div className="p-1.5 rounded">
                    <div className="flex pl-2.5 rounded p-1.5">
                      <SignedOut>
                        <Link href="/sign-in" className="">
                          Sign In
                        </Link>
                      </SignedOut>
                      <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                      </SignedIn>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          portalRoot
        )}

      {/* FAVORITES POPUP MODAL */}
      <AnimatePresence>
        {favoritesOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4"
            onClick={() => setFavoritesOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="glass rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/20">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Heart className="w-6 h-6 text-red-500 fill-current" />
                  Your Favorites ({favorites.length})
                </h2>
                <button
                  onClick={() => setFavoritesOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {loading ? (
                  <p className="text-center text-gray-500">Loading...</p>
                ) : favorites.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-lg text-gray-500">No favorites yet</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Tap the heart on any apartment to save it here.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favorites.map((apt) => (
                      <div
                        key={apt._id}
                        onClick={() => openApartmentModal(apt)}
                        className="cursor-pointer group"
                      >
                        <div className="glass rounded-xl overflow-hidden hover:shadow-lg transition-all">
                          <ApartmentCard apt={apt} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* APARTMENT MODAL FROM FAVORITES */}
      <ApartmentModal
        apt={selectedApt}
        isOpen={apartmentModalOpen}
        onClose={() => {
          setApartmentModalOpen(false);
          setSelectedApt(null);
        }}
      />
    </>
  );
}