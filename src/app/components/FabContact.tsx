"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import emailjs from "emailjs-com";
import usePortal from "../hooks/usePortal";
import { createPortal } from "react-dom";

export default function FabContact() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const form = useRef<HTMLFormElement | null>(null);
  const portalRoot = usePortal();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("Sending...");
    emailjs
      .sendForm("service_t24txl9", "template_71kvt4w", form.current, "X8eA-Y4B1Jg8GrShF")
      .then(() => {
        setStatus("Inquiry sent! I'll reply soon.");
        (e.target as HTMLFormElement).reset();
      })
      .catch(() => {
        setStatus("Failed to send. Please contact via LINE instead.");
      });
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Contact"
        className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-50 w-15 h-15 rounded-full flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:scale-105 transition-transform"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Modal via portal */}
      {portalRoot &&
        createPortal(
          <AnimatePresence>
            {open && (
              <>
                <motion.div
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-sm z-40"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 30 }}
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                  <div className="glass relative max-w-lg w-full mx-auto p-6 md:p-8 bg-white/95 dark:bg-gray-900/95 border border-white/30 dark:border-gray-700/30 rounded-3xl">
                    <button
                      onClick={() => setOpen(false)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white/40 dark:bg-gray-700/40 hover:bg-white/60 dark:hover:bg-gray-600/60 transition"
                    >
                      <X className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                    </button>

                    <h2 className="text-2xl font-bold text-center mb-6 font-logo">
                      Contact Me
                    </h2>
                    <p className="text-center mb-6">Send an inquiry below or contact me directly on LINE.</p>

                    <form ref={form} onSubmit={handleSubmit} className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium mb-1">Your Email</label>
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
                        <label className="block text-sm font-medium mb-1">Message</label>
                        <textarea
                          name="message"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                          rows={3}
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
                        <p className={`text-center text-sm mt-2 ${status.includes("sent") ? "text-green-600" : "text-gray-600"}`}>
                          {status}
                        </p>
                      )}
                    </form>

                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="h-px bg-gray-300 flex-1"></div>
                      <span className="text-sm">or</span>
                      <div className="h-px bg-gray-300 flex-1"></div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                      <div className="text-center">
                        <p className="text-sm font-medium mb-3">Scan to chat on LINE</p>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-inner mx-auto w-fit">
                          <Image src="/line-qr.png" alt="LINE QR Code" width={128} height={128} className="rounded-lg" />
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