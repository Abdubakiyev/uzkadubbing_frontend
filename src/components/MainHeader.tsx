"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function MainHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const router = useRouter();

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

        {/* Profile (desktop) */}
        <div className="hidden md:block relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="w-12 h-12 rounded-full overflow-hidden border border-white/30 shadow-md focus:outline-none"
          >
            <Image
              src="/avatar-placeholder.png"
              alt="Profile"
              width={48}
              height={48}
            />
          </button>

          {/* Profile Menu */}
          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden z-50">
              <Link
                href="/profile"
                onClick={() => setProfileMenuOpen(false)}
                className="block px-4 py-2 text-white hover:bg-gray-700 transition"
              >
                Profil
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/register");
                }}
                className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition"
              >
                Chiqish
              </button>
            </div>
          )}
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
          {/* Mobile Profile */}
          <div className="border-t border-white/20 pt-4">
            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className="block text-white/90 hover:text-yellow-200 font-medium mb-2"
            >
              Profil
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/register");
              }}
              className="block w-full text-left text-white/90 hover:text-yellow-200 font-medium"
            >
              Chiqish
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
