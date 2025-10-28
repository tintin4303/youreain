// src/app/layout.jsx
import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "./components/Navbar";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: "700",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}