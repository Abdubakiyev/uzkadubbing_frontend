"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-gradient-to-r from-[#8B5E3C]/90 via-[#B8860B]/90 to-[#FFD700]/90 backdrop-blur-md border-b border-white/10 shadow-lg h-[calc(3rem+31px)]">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logos.jpg"
            alt="GOMU Logo"
            width={150}
            height={150}
            className="rounded-full border border-white/30 shadow-md"
          />
          
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-white/90 hover:text-yellow-200 font-medium transition"
          >
            Uy
          </Link>
          <Link
            href="/random"
            className="text-white/90 hover:text-yellow-200 font-medium transition"
          >
            Tasodifiy Anime
          </Link>
        </nav>

        {/* Login button (desktop) */}
        <div className="hidden md:block">
          <Link
            href="/register"
            className="bg-yellow-500/20 hover:bg-yellow-500/40 text-white font-semibold px-5 py-2 rounded-lg border border-yellow-400/40 shadow-md transition"
          >
            Kirish
          </Link>
        </div>

        {/* Hamburger (mobile) */}
        <button
          className="md:hidden text-white text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gradient-to-b from-[#8B5E3C]/95 via-[#B8860B]/95 to-[#FFD700]/95 backdrop-blur-md border-t border-white/10 px-6 py-4 space-y-4 animate-slideDown">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="block text-white/90 hover:text-yellow-200 font-medium"
          >
            Uy
          </Link>
          <Link
            href="/random"
            onClick={() => setMenuOpen(false)}
            className="block text-white/90 hover:text-yellow-200 font-medium"
          >
            Tasodifiy Anime
          </Link>
          <Link
            href="/register"
            onClick={() => setMenuOpen(false)}
            className="block bg-yellow-500/30 hover:bg-yellow-500/50 text-white font-semibold px-5 py-2 rounded-lg border border-yellow-400/40 shadow-md transition text-center"
          >
            Kirish
          </Link>
        </div>
      )}
    </header>
  );
}
