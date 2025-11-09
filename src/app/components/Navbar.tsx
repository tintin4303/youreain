// src/app/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu } from "lucide-react";
import usePortal from "../hooks/usePortal";
import { createPortal } from "react-dom";
import ThemeToggle from "./ThemeToggle";
import SearchBar from "./SearchBar";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const portalRoot = usePortal();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Click-outside for burger menu
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (
        mobileMenu &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(target) &&
        !buttonRef.current.contains(target)
      ) {
        setMobileMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);   // FIXED
      document.removeEventListener("touchstart", handler);  // FIXED
    };
  }, [mobileMenu]);

  const handleFilter = () => {};

  return (
    <>
      {/* NAVBAR CODE (unchanged from last version) */}
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-md"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* LEFT */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center">
                <div className="glass px-5 py-2 rounded-full flex items-center space-x-2">
                  <h1 className="text-xl md:text-2xl font-bold">
                    Your<span className="text-indigo-400">Eain</span>
                  </h1>
                </div>
              </Link>
              <ThemeToggle />
            </div>

            {/* CENTER - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8 justify-center">
              <SearchBar onFilter={handleFilter} />
            </div>

            {/* RIGHT */}
            <div className="flex items-center space-x-3">
              <SignedOut>
                <Link
                  href="/sign-in"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition text-sm font-medium"
                >
                  Sign In
                </Link>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>

              <button
                ref={buttonRef}
                onClick={() => setMobileMenu(v => !v)}
                className="p-2 glass rounded-full border border-white/30 transition hover:scale-105"
                aria-label="Toggle menu"
              >
                {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div className="md:hidden px-4 pb-3">
          <SearchBar onFilter={handleFilter} />
        </div>
      </nav>

      {/* BURGER MENU */}
      {portalRoot && createPortal(
        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="fixed top-20 right-6 z-40 md:right-8 md:top-24"
            >
              <div className="glass rounded-xl w-64 p-2 flex flex-col text-center font-medium border border-white/20 backdrop-blur-xl">
                <Link href="/listings" onClick={() => setMobileMenu(false)} className="py-2 px-4 hover:bg-neutral-300 hover:text-indigo-500 transition-colors rounded-lg">
                  Apartments
                </Link>
                <Link href="/account" onClick={() => setMobileMenu(false)} className="py-2 px-4 hover:bg-neutral-300 hover:text-indigo-500 transition-colors rounded-lg">
                  Account
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        portalRoot
      )}
    </>
  );
}