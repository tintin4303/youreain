// src/app/components/ThemeToggle.jsx
"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  // Wait for hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show nothing until mounted
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="px-4 py-2 cursor-pointer flex items-center justify-between border-gray-400/20 transition-all rounded hover:bg-gray-400/30"
    >
      <p className="">Theme</p>
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-400" />
      )}
    </button>
  );
}