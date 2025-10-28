// src/app/page.jsx
import Link from "next/link";
import SearchBar from "./components/SearchBar";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <>
    <Navbar />
    <section className="relative py-16 md:py-24 px-6 overflow-hidden">
      {/* Subtle Animated BG */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center">
        {/* Compact Glass Card */}
        <div className="glass p-6 md:p-8 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/30">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-900">
            Your<span className="text-indigo-600">Eain</span>
          </h1>

        <p className="text-sm md:text-base text-gray-600 max-w-xl mx-auto mb-6">
          Verified apartments near ABAC Suvarnabhumi Campus (Bang Na) — affordable, furnished, student-ready.
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
            <div className="w-4 h-4 bg-blue-400 rounded-full"></div> No Fees
          </span>
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-400 rounded-full"></div> 500+ Students
          </span>
        </div>
      </div>
    </section>
    </>
  );
}