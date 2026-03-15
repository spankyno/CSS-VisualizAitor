"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CSSAnalyzer from "@/components/CSSAnalyzer";
import BlogSimulator from "@/components/BlogSimulator";
import About from "@/components/About";
import Footer from "@/components/Footer";

export default function Home() {
  const [rawCSS, setRawCSS] = useState("");

  return (
    <main className="min-h-screen bg-obsidian-950">
      {/* Grid background persistent */}
      <div className="fixed inset-0 bg-grid pointer-events-none z-0 opacity-60" />

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <CSSAnalyzer onCSSReady={setRawCSS} />
        <BlogSimulator rawCSS={rawCSS} />
        <About />
        <Footer />
      </div>
    </main>
  );
}
