// src/app/page.jsx
import SearchBar from "./components/SearchBar";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PageTransition from "./components/PageTransition";
import Popular from "./components/Popular";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

export default function Home() {
  return (
    <>
      <PageTransition>
        <Hero />
        <Popular />
      </PageTransition>
    </>
  );
}