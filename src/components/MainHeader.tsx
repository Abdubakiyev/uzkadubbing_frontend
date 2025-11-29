"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { Anime } from "../features/types/Anime";
import { getAllAnime } from "../features/api/Anime";

import { UserForm } from "../features/types/User";
import { getUserById } from "../features/api/Users";

export default function MainHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [randomId, setRandomId] = useState<string>("");
  const [user, setUser] = useState<UserForm | null>(null);
  const router = useRouter();

  // 🔥 USER MA'LUMOTINI LOCALSTORAGE TOKEN BO‘YICHA YUKLAYMIZ
  useEffect(() => {
    const loadUser = async () => {
      const storedId = localStorage.getItem("user_id");  // TOKEN YARATGANDA SAQLANGAN ID

      if (!storedId) return;

      try {
        const freshUser = await getUserById(storedId);  // 🔥 HAQIQIY USER MA'LUMOT
        setUser(freshUser);
      } catch (err) {
        console.log("Foydalanuvchi olishda xato:", err);
      }
    };

    loadUser();
  }, []);

  // Tasodifiy anime
  useEffect(() => {
    const fetchRandomAnime = async () => {
      try {
        const animeList: Anime[] = await getAllAnime();
        if (animeList.length > 0) {
          const randomIndex = Math.floor(Math.random() * animeList.length);
          setRandomId(animeList[randomIndex].id);
        }
      } catch (err) {
        console.error("Random anime olishda xato:", err);
      }
    };

    fetchRandomAnime();
  }, []);

  // 🔥 AVATAR SRC LÓGIKASI
  const avatarSrc = user?.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `/uploads/${user.avatar}`
    : "/avatar-placeholder.png";

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

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-white/90 hover:text-yellow-200 font-medium transition">
            Uy
          </Link>

          <Link
            href={randomId ? `/anime/${randomId}` : "#"}
            className="text-white/90 hover:text-yellow-200 font-medium transition"
          >
            Tasodifiy Anime
          </Link>
        </nav>

        {/* Profil */}
        <div className="hidden md:block relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="w-12 h-12 rounded-full overflow-hidden border border-white/30 shadow-md"
          >
            <Image src={avatarSrc} alt="Profile" width={48} height={48} className="object-cover" />
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden z-50">
              <Link
                href="/profile"
                className="block px-4 py-2 text-white hover:bg-gray-700 transition"
              >
                Profil
              </Link>

              <button
                onClick={() => {
                  localStorage.removeItem("user_id");
                  localStorage.removeItem("access_token");
                  router.push("/register");
                }}
                className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition"
              >
                Chiqish
              </button>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </header>
  );
}
