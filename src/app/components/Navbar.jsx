"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";
import emailjs from "emailjs-com";
import Image from "next/image";
import usePortal from "../hooks/usePortal";
import { createPortal } from "react-dom";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [showContact, setShowContact] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const form = useRef();
  const portalRoot = usePortal();

  // === Smooth navbar background on scroll ===
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Sending...");
    emailjs
      .sendForm(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        form.current,
        "YOUR_PUBLIC_KEY"
      )
      .then(() => {
        setStatus("Inquiry sent! I'll reply soon.");
        e.target.reset();
      })
      .catch(() => {
        setStatus("Failed to send. Please contact via LINE instead.");
      });
  };

  return (
    <>
      {/* === NAVBAR === */}
      <nav
        className={`sticky top-0 z-50 mx-4 md:mx-6 mt-4 transition-all duration-500`}
      >
        <div className="glass p-3 md:p-4 rounded-full flex justify-between items-center border border-white/20">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center h-10 md:h-12 px-4 md:px-8 rounded-full hover:scale-105 transition-transform"
            >
              <h1 className="text-xl md:text-2xl font-logo">
                Your<span className="text-indigo-600 font-logo dark:text-indigo-200">Eain</span>
              </h1>
            </Link>
            <ThemeToggle />
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8 text-lg font-medium text-gray-800">
            {["Apartments"].map((label, i) => (
              <Link
                key={i}
                href={label === "Home" ? "/" : "/listings"}
                className="relative group"
              >
                <span className="hover:text-indigo-600 transition-colors">
                  {label}
                </span>
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-indigo-600 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            <button
              onClick={() => setShowContact(true)}
              className="glass-btn text-sm px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <MessageCircle className="w-4 h-4 inline-block mr-2" />
              Contact
            </button>
          </div>

          {/* Mobile Burger */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="p-2 glass rounded-full text-gray-700 border border-white/30 transition"
              aria-label="Toggle Menu"
            >
              {mobileMenu ? (
                <X className="w-6 h-6" />
              ) : (
                <Image src="/burger.svg" alt="Menu" width={24} height={24} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* === MOBILE MENU === */}
      {portalRoot &&
        createPortal(
          <AnimatePresence>
            {mobileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="fixed top-20 left-0 right-0 mx-4 z-40 md:hidden"
              >
                <div className="glass rounded-3xl p-6 flex flex-col space-y-4 text-center font-medium text-gray-800 border border-white/20 backdrop-blur-xl">
                  {["Apartments"].map((label, i) => (
                    <Link
                      key={i}
                      href={label === "Home" ? "/" : "/listings"}
                      onClick={() => setMobileMenu(false)}
                      className="hover:text-indigo-600 transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      setMobileMenu(false);
                      setShowContact(true);
                    }}
                    className="glass-btn text-sm px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white mx-auto"
                  >
                    <MessageCircle className="w-4 h-4 inline-block mr-2" />
                    Contact
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          portalRoot
        )}

      {/* === CONTACT MODAL === */}
      {portalRoot &&
        createPortal(
          <AnimatePresence>
            {showContact && (
              <>
                <motion.div
                  onClick={() => setShowContact(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 30 }}
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                  <div className="glass relative max-w-lg w-full mx-auto p-6 md:p-8 bg-white/95 border border-white/30 rounded-3xl">
                    <button
                      onClick={() => setShowContact(false)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white/40 hover:bg-white/60 transition"
                    >
                      <X className="w-5 h-5 text-gray-700" />
                    </button>

                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-6 font-logo">
                      Contact Us
                    </h2>
                    <p className="text-center text-gray-600 mb-6">
                      Send an inquiry below or contact me directly on LINE.
                    </p>

                    <form
                      ref={form}
                      onSubmit={handleSubmit}
                      className="space-y-4 mb-6"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Your Email
                        </label>
                        <input
                          type="email"
                          name="user_email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="glass-input"
                          placeholder="you@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Message
                        </label>
                        <textarea
                          name="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                          rows="3"
                          className="glass-input resize-none"
                          placeholder="Hi! I'm interested in your apartments..."
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition shadow-md"
                      >
                        Send Inquiry
                      </button>
                      {status && (
                        <p
                          className={`text-center text-sm mt-2 ${
                            status.includes("sent")
                              ? "text-green-600"
                              : "text-gray-600"
                          }`}
                        >
                          {status}
                        </p>
                      )}
                    </form>

                    <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
                      <div className="h-px bg-gray-300 flex-1"></div>
                      <span className="text-sm">or</span>
                      <div className="h-px bg-gray-300 flex-1"></div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-700 mb-3">
                          Scan to chat on LINE
                        </p>
                        <div className="bg-white p-4 rounded-xl shadow-inner mx-auto w-fit">
                          <Image
                            src="/line-qr.png"
                            alt="LINE QR Code"
                            width={128}
                            height={128}
                            className="rounded-lg"
                          />
                        </div>
                      </div>
                      <Link
                        href="https://line.me/ti/p/~youreain"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-green-600 text-white py-3.5 px-6 rounded-xl hover:bg-green-700 transition-colors font-medium shadow-md"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Chat on LINE
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          portalRoot
        )}
    </>
  );
}