// src/app/page.jsx
import Link from "next/link";
import SearchBar from "./components/SearchBar";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PageTransition from "./components/PageTransition";

export default function Home() {
  return (
    <>
    <PageTransition>
      <Navbar />
      <Hero />
    </PageTransition>
    </>
  );
}