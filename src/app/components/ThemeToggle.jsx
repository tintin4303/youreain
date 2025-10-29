import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
export default function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  if (!resolvedTheme) return null; // Wait until theme is resolved
  return (
    <button
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      className="w-fit p-2 rounded-full border border-gray-400/20 bg-transparent transition hover:bg-gray-200/30 dark:hover:bg-gray-700/30 hover:scale-110"
    >
      {resolvedTheme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
