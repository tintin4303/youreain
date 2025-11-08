"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu } from "lucide-react";
import usePortal from "../hooks/usePortal";
import { createPortal } from "react-dom";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const portalRoot = usePortal();
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      // If menu is open and click/touch is outside both menu and toggle button, close menu
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

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    setMounted(true);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
    // intentionally including mobileMenu to react to changes (so handler can close when open)
  }, [mobileMenu]);

  if (!mounted) return null;

  return (
    <>
      {/* === NAVBAR === */}
      <nav className="sticky top-0 z-50 mx-4 md:mx-6 mt-4 transition-all duration-500">
        <div className="glass p-3 md:p-4 rounded-full flex justify-between items-center border border-white/20">
          {/* Left: Logo + ThemeToggle */}
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center h-10 md:h-12 px-4 md:px-8 rounded-full hover:scale-105 transition-transform"
            >
              <h1 className="text-xl md:text-2xl">
                Your<span className="text-indigo-400">Eain</span>
              </h1>
            </Link>
            <ThemeToggle />
          </div>

          {/* Right: Burger (right-most) */}
          <div className="flex items-center space-x-3">
            <button
              ref={buttonRef}
              onClick={() => setMobileMenu(!mobileMenu)}
              className="p-2 glass rounded-full border border-white/30 transition"
              aria-label="Toggle Menu"
            >
              {mobileMenu ? (
                <X className="w-6 h-6 cursor-pointer" />
              ) : (
                <Menu className="w-6 h-6 cursor-pointer" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* === BURGER MENU MODAL (used for both desktop & mobile) === */}
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
                className="fixed top-20 right-6 z-40 md:right-8 md:top-16"
              >
                <div className="glass rounded-xl w-64 mt-3 md:mt-10  p-2 flex flex-col  text-center font-medium border border-white/20 backdrop-blur-xl">
                  <Link
                    href="/listings"
                    onClick={() => setMobileMenu(false)}
                    className="py-2 px-4 hover:bg-neutral-300 hover:text-indigo-500 transition-colors"
                  >
                    Apartments
                  </Link>

                  <Link
                    href="/account"
                    onClick={() => setMobileMenu(false)}
                    className="py-2 px-4 hover:bg-neutral-300 hover:text-indigo-500 transition-colors"
                  >
                    Account
                  </Link>

                  {/* Add more links here if needed */}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          portalRoot
        )}
    </>
  );
}