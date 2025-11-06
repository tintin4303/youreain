// src/app/page.jsx
import Link from "next/link";
import SearchBar from "./components/SearchBar";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PageTransition from "./components/PageTransition";
import Popular from "./components/Popular";

export default function Home() {
  return (
    <>
    <PageTransition>
      <SearchBar />
      <Hero />
      <Popular />
    </PageTransition>
    </>
  );
}