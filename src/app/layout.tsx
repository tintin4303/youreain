// app/layout.jsx
import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "./components/Navbar";
import PageTransition from "./components/PageTransition";
import { ThemeProvider } from "next-themes";

import { type Metadata } from 'next'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

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
    <ClerkProvider>
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      {/* Dark class is toggled on <html> by next-themes */}
      <body className="min-h-dvh ">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}