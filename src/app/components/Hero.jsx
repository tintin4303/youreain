// src/app/components/Hero.jsx
import Link from "next/link";
import SearchBar from "./SearchBar";

export default function Hero() {
  return (
    <section
      className="relative py-16 md:py-24 px-6 overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/bangkok-campus-safe.jpg')",
      }}
    >
      {/* Soft Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20"></div>

      {/* Animated Blobs (Your Style) */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Glass Card */}
        <div className="glass p-6 md:p-8 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/30">
            <h1 className="text-4xl md:text-5xl font-logo text-white drop-shadow-md">
            Your<span className="text-indigo-300">Eain</span>
            </h1>

          <p className="text-sm md:text-base text-white/90 max-w-xl mx-auto mb-6">
            Verified apartments near ABAC Suvarnabhumi Campus (Bang Na) — affordable, furnished, student-ready.
          </p>

          <SearchBar />

          <Link
            href="/listings"
            className="inline-block mt-6 glass-btn text-sm px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
          >
            Find ABAC Bang Na Apartments
          </Link>
        </div>

        {/* Trust Icons */}
        <div className="flex justify-center gap-6 mt-8 text-white/80 text-xs md:text-sm">
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
  );
}