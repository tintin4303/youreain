// src/app/components/Navbar.jsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 mx-4 md:mx-6 mt-4">
      <div className="glass p-3 md:p-4 rounded-full flex justify-between items-center backdrop-blur-xl border border-white/20">
        {/* Logo */}
        <Link href="/" className="flex items-center h-10 md:h-12 px-4 md:px-8 rounded-full hover:scale-105 transition">
          <h1 className="text-xl md:text-2xl font-logo text-gray-900">
            Your<span className="text-indigo-600">Eain</span>
          </h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 text-lg font-bold text-gray-800">
          <Link href="/" className="hover:text-indigo-600 transition">Home</Link>
          <Link href="/listings" className="hover:text-indigo-600 transition">Apartments</Link>
          <Link href="/#contact" className="glass-btn text-sm px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            Contact
          </Link>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <button className="p-2 glass rounded-full text-gray-700 border border-white/30">Menu</button>
        </div>
      </div>
    </nav>
  );
}