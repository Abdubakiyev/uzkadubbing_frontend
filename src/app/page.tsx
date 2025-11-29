"use client"; // ❗ Shu qatorni qo'shish kerak

import { useEffect, useState } from "react";
import AnimeGrid from "../components/AnimeGrid";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HeroSlider from "../components/HeroSlider";
import MainHeader from "../components/MainHeader";

export default function Home() {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setHasToken(!!token);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      {hasToken ? <MainHeader /> : <Header />}

      {/* 🔹 Headerdan keyingi komponentlarga margin-top */}
      <div className="mt-20">
        <HeroSlider />
        <AnimeGrid />
        <Footer />
      </div>
    </main>
  );
}
