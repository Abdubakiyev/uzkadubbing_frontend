"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX, FiHome, FiShuffle, FiLogIn } from "react-icons/fi";
import { FaCrown } from "react-icons/fa";
import { Anime } from "../features/types/Anime";
import { getAllAnime } from "../features/api/Anime";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [randomId, setRandomId] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const getRandom = async () => {
      try {
        const animeList: Anime[] = await getAllAnime();
        if (animeList.length > 0) {
          const randomIndex = Math.floor(Math.random() * animeList.length);
          setRandomId(animeList[randomIndex].id);
        }
      } catch (err) {
        console.error("Random ID olishda xato:", err);
      }
    };

    getRandom();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-gradient-to-r from-[#8B5E3C] via-[#B8860B] to-[#FFD700] shadow-2xl shadow-yellow-900/30" 
          : "bg-gradient-to-r from-[#8B5E3C]/90 via-[#B8860B]/90 to-[#FFD700]/90"
      } backdrop-blur-md border-b border-white/20 h-[calc(3rem+31px)]`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo qismi */}
        <Link 
          href="/" 
          className="flex items-center space-x-3 group"
        >
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <Image
              src="/logos.jpg"
              alt="GOMU Logo"
              width={150}
              height={150}
              className="relative rounded-full border-2 border-white/40 shadow-lg group-hover:border-white/60 transition duration-300 group-hover:scale-105"
            />
          </div>
          <div className="hidden lg:flex items-center space-x-2">
            <FaCrown className="text-yellow-300 text-xl animate-pulse" />
            <span className="text-white font-bold text-xl tracking-wider bg-gradient-to-r from-white to-yellow-200 bg-clip-text">
              GOMU ANIME
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="flex items-center space-x-2 text-white/90 hover:text-yellow-200 font-medium transition-all duration-200 group relative px-3 py-2 rounded-lg hover:bg-white/5"
          >
            <FiHome className="text-lg group-hover:scale-110 transition-transform" />
            <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-yellow-300 after:transition-all after:duration-300 group-hover:after:w-full">
              Uy
            </span>
          </Link>
          
          <Link
            href={randomId ? `/anime/${randomId}` : "#"}
            className="flex items-center space-x-2 text-white/90 hover:text-yellow-200 font-medium transition-all duration-200 group relative px-3 py-2 rounded-lg hover:bg-white/5"
          >
            <FiShuffle className="text-lg group-hover:rotate-180 transition-transform duration-500" />
            <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-yellow-300 after:transition-all after:duration-300 group-hover:after:w-full">
              Tasodifiy Anime
            </span>
          </Link>
        </nav>

        {/* Desktop Kirish tugmasi */}
        <div className="hidden md:block">
          <Link
            href="/register"
            className="group relative overflow-hidden bg-gradient-to-r from-yellow-500/30 to-amber-600/30 hover:from-yellow-500/40 hover:to-amber-600/40 text-white font-semibold px-6 py-2.5 rounded-xl border border-yellow-400/40 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/20 flex items-center space-x-2"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <FiLogIn className="text-lg" />
            <span>Kirish</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white text-2xl focus:outline-none p-2 rounded-lg bg-white/10 hover:bg-white/20 transition duration-200"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <FiX className="animate-spin-in" />
          ) : (
            <FiMenu className="animate-pulse" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-gradient-to-b from-[#8B5E3C] via-[#B8860B] to-[#FFD700] border-t border-white/20 px-6 py-4 space-y-4 animate-fadeInDown shadow-2xl shadow-yellow-900/30">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center space-x-3 text-white/90 hover:text-yellow-200 font-medium p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group"
          >
            <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20">
              <FiHome className="text-xl" />
            </div>
            <span className="text-lg">Uy</span>
          </Link>
          
          <Link
            href={randomId ? `/anime/${randomId}` : "#"}
            onClick={() => setMenuOpen(false)}
            className="flex items-center space-x-3 text-white/90 hover:text-yellow-200 font-medium p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group"
          >
            <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20">
              <FiShuffle className="text-xl" />
            </div>
            <span className="text-lg">Tasodifiy Anime</span>
          </Link>
          
          <Link
            href="/register"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-500/40 to-amber-600/40 hover:from-yellow-500/50 hover:to-amber-600/50 text-white font-semibold px-5 py-3 rounded-xl border border-yellow-400/40 shadow-lg transition-all duration-300 mt-4"
          >
            <FiLogIn className="text-lg" />
            <span>Kirish</span>
          </Link>
        </div>
      )}

      {/* Gradient line efekti */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
    </header>
  );
}