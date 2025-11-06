// src/app/components/Hero.jsx
"use client";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative py-10 md:py-14 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        {/* Compact Glass Card */}
        <div className="glass p-6 md:p-8 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/30">
          <h1 className="text-4xl md:text-5xl font-logo font-bold mb-3">
            Your<span className="text-indigo-600 font-logo dark:text-white">Eain</span>
          </h1>

        <p className="text-sm dark:text-gray-200 md:text-base max-w-xl mx-auto mb-6">
          YourEain is created by an ABAC student in order to help fellow students find apartments near ABAC Suvarnabhumi Campus.
        </p>
        <Link
          href="/listings"
          className="inline-block mt-6 glass-btn text-sm px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600"
        >
          Find ABAC Bang Na Apartments
        </Link>
        </div>

        {/* Trust Icons */}
        <div className="flex justify-center gap-6 mt-8  text-xs md:text-sm">
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded-full"></div> Verified
          </span>
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-400 rounded-full"></div> No Agent Fees
          </span>
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-400 rounded-full"></div> 500+ Students
          </span>
        </div>
      </div>
    </section>
  );
}