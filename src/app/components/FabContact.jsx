// src/app/components/FabContact.jsx
"use client";
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function FabContact() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-xl hover:bg-indigo-700 transition"
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-4 w-64 text-center border border-white/30"
          >
            <p className="text-gray-700 dark:text-gray-100 mb-3">
              Need help? Message us on LINE!
            </p>
            <Link
              href="https://line.me/ti/p/~youreain"
              target="_blank"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Open LINE
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
