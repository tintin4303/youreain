// src/app/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu, House } from "lucide-react";
import usePortal from "../hooks/usePortal";
import { createPortal } from "react-dom";
import SearchBar from "./SearchBar";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const portalRoot = usePortal();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);


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
      <nav id="nav"
        className={`fixed top-0 left-0 right-0 w-full flex items-center bg-white justify-between p-8  z-50 transition-shadow `}
      >
            {/* LEFT */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center">
                <div className="glass px-5 py-2 rounded-full flex items-center space-x-2">
                  <h1 className="text-xl md:text-2xl font-bold">
                    Your<span className="text-indigo-500">Eain</span>
                  </h1>
                </div>
              </Link>
            </div>

            {/* RIGHT */}
            <div className="flex justify-between items-center">
            <div className="max-w-lg mx-3 ">
              <SearchBar onFilter={handleFilter} />
            </div>

            <div className="flex items-center space-x-3">
              <button
                ref={buttonRef}
                onClick={() => setMobileMenu(v => !v)}
                className="p-2 glass rounded-full border border-white/30 transition hover:scale-105 cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
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
              className="fixed top-25 right-6 z-51 md:right-8"
            >
              <div className="glass rounded-xl w-64 p-2 flex flex-col font-medium border border-white/20 backdrop-blur-xl shadow-lg">
                <Link href="/listings" onClick={() => setMobileMenu(false)} className="py-2 px-4 hover:bg-gray-400/30  flex justify-between items-center rounded-lg">
                  Apartment
                  <House className="w-5 h-5 text-indigo-500" />
                </Link>
                <ThemeToggle />
                <div>
                  <SignedOut>
                    <Link
                      href="/sign-in"
                      className=""
                    >
                      Sign In
                    </Link>
                  </SignedOut>
                  <SignedIn>
                    <UserButton
                        afterSignOutUrl="/"
                        showName={true}
                      />
                  </SignedIn>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        portalRoot
      )}
    </>
  );
}