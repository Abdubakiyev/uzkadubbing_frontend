"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX, FiHome, FiShuffle, FiLogOut, FiUser, FiChevronDown } from "react-icons/fi";
import { FaCrown, FaRandom } from "react-icons/fa";
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
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  // USER LOAD
  useEffect(() => {
    const loadUser = async () => {
      const storedId = localStorage.getItem("user_id");
      if (!storedId) return;

      try {
        const freshUser = await getUserById(storedId);
        console.log("User ma'lumotlari:", freshUser);
        console.log("Avatar:", freshUser.avatar);
        setUser(freshUser);
      } catch (err) {
        console.log("Foydalanuvchi olishda xato:", err);
      }
    };

    loadUser();
  }, []);

  // RANDOM ANIME
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

  // Scroll effekti
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Avatar URL ni aniqlash
  const getAvatarUrl = () => {
    if (!user?.avatar) return "/avatar-placeholder.png";
    return user.avatar.startsWith("http")
      ? user.avatar.trim()
      : `http://localhost:3000/uploads/avatars/${user.avatar}`.trim();
  };

  // Logout funktsiyasi
  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setProfileMenuOpen(false);
    setUser(null);
    router.push("/register");
  };

  return (
    <header 
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-gradient-to-r from-[#cbae75] shadow-2xl shadow-yellow-900/30" 
          : "bg-gradient-to-r from-[#8B5E3C]/95 via-[#B8860B]/95 to-[#FFD700]/95"
      } backdrop-blur-md border-b border-white/20 h-[calc(3rem+31px)]`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <Image
              src="/logos.jpg"
              alt="GOMU Logo"
              width={150}
              height={150}
              className="relative rounded-full border-2 border-white/40 shadow-lg group-hover:border-white/60 transition duration-300 group-hover:scale-105"
              loading="eager"
              priority
            />
          </div>
          <div className="hidden lg:flex items-center space-x-2">
            <FaCrown className="text-yellow-300 text-xl animate-pulse" />
            <span className="text-white font-bold text-xl tracking-wider bg-gradient-to-r from-white to-yellow-200 bg-clip-text">
              Uzka dubbing
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="flex items-center space-x-2 text-white/90 hover:text-yellow-200 font-medium transition-all duration-200 group relative px-4 py-2 rounded-xl hover:bg-white/5"
          >
            <FiHome className="text-lg group-hover:scale-110 transition-transform" />
            <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-yellow-300 after:transition-all after:duration-300 group-hover:after:w-full">
              Uy
            </span>
          </Link>

          <Link
            href={randomId ? `/anime/${randomId}` : "#"}
            className="flex items-center space-x-2 text-white/90 hover:text-yellow-200 font-medium transition-all duration-200 group relative px-4 py-2 rounded-xl hover:bg-white/5"
          >
            <FaRandom className="text-lg group-hover:rotate-180 transition-transform duration-500" />
            <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-yellow-300 after:transition-all after:duration-300 group-hover:after:w-full">
              Tasodifiy Anime
            </span>
          </Link>
        </nav>

        {/* Profile Section */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center space-x-3 group p-2 rounded-2xl hover:bg-white/10 transition duration-300"
              >
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-full blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/40 shadow-md group-hover:border-yellow-300 transition duration-300">
                    <Image
                      src={getAvatarUrl()}
                      alt={user.username || "User"}
                      width={40}
                      height={40}
                      unoptimized={true}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-white font-medium text-sm leading-tight">
                    {user.username || "Foydalanuvchi"}
                  </p>
                  <p className="text-yellow-200/70 text-xs">Profil</p>
                </div>
                <FiChevronDown 
                  className={`text-white/70 transition-transform duration-300 ${
                    profileMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {profileMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setProfileMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-50 animate-fadeIn">
                    <div className="p-4 border-b border-white/10">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-400/50">
                          <Image
                            src={getAvatarUrl()}
                            alt={user.username || "User"}
                            width={48}
                            height={48}
                            unoptimized={true}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <p className="text-white font-semibold">{user.username}</p>
                          <p className="text-yellow-200/70 text-sm">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <Link
                        href="/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-white/90 hover:text-yellow-200 hover:bg-white/5 transition duration-200 group"
                      >
                        <FiUser className="text-lg group-hover:scale-110 transition-transform" />
                        <span>Profilim</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition duration-200 group border-t border-white/10 mt-2"
                      >
                        <FiLogOut className="text-lg group-hover:scale-110 transition-transform" />
                        <span>Chiqish</span>
                      </button>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-500/20 to-amber-600/20 p-3 border-t border-white/10">
                      <p className="text-yellow-200/80 text-xs text-center">
                        Premium foydalanuvchi
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/register"
              className="group relative overflow-hidden bg-gradient-to-r from-yellow-500/30 to-amber-600/30 hover:from-yellow-500/40 hover:to-amber-600/40 text-white font-semibold px-6 py-2.5 rounded-xl border border-yellow-400/40 shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/20 flex items-center space-x-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <FiHome className="text-lg" />
              <span>Kirish</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
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

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gradient-to-b from-[#8B5E3C] via-[#B8860B] to-[#FFD700] border-t border-white/20 px-6 py-4 space-y-3 animate-fadeInDown shadow-2xl shadow-yellow-900/30">
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
              <FaRandom className="text-xl" />
            </div>
            <span className="text-lg">Tasodifiy Anime</span>
          </Link>

          {user ? (
            <>
              <div className="border-t border-white/20 pt-3 mt-2">
                <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/10">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-400/50">
                    <Image
                      src={getAvatarUrl()}
                      alt={user.username || "User"}
                      width={48}
                      height={48}
                      unoptimized={true}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{user.username}</p>
                    <p className="text-yellow-200/70 text-sm">{user.email}</p>
                  </div>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center space-x-3 text-white/90 hover:text-yellow-200 font-medium p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group mt-2"
                >
                  <div className="p-2 bg-white/10 rounded-lg group-hover:bg-white/20">
                    <FiUser className="text-xl" />
                  </div>
                  <span className="text-lg">Profilim</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 text-red-400 hover:text-red-300 font-medium p-3 rounded-xl hover:bg-red-500/10 transition-all duration-200 group mt-2 border-t border-white/10 pt-3"
                >
                  <div className="p-2 bg-red-500/10 rounded-lg group-hover:bg-red-500/20">
                    <FiLogOut className="text-xl" />
                  </div>
                  <span className="text-lg">Chiqish</span>
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-500/40 to-amber-600/40 hover:from-yellow-500/50 hover:to-amber-600/50 text-white font-semibold px-5 py-3 rounded-xl border border-yellow-400/40 shadow-lg transition-all duration-300 mt-4"
            >
              <FiHome className="text-lg" />
              <span>Kirish</span>
            </Link>
          )}
        </div>
      )}

      {/* Gradient line efekti */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
    </header>
  );
}