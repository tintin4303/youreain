// src/app/components/ThemeToggle.jsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent SSR mismatch

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      className="w-fit p-2 rounded-full border border-gray-400/20 bg-transparent transition hover:bg-gray-200/30 dark:hover:bg-gray-700/30 hover:scale-110"
    >
      {resolvedTheme === "light" ? "Moon" : "Sun"}
    </button>
  );
}