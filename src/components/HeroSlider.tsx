"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiEye, FiPlay, FiChevronLeft, FiChevronRight, FiClock, FiStar, FiTrendingUp } from "react-icons/fi";
import { MdOutlinePaid, MdFreeBreakfast, MdWhatshot } from "react-icons/md";
import { FaFire, FaCrown, FaGem } from "react-icons/fa";
import { Anime } from "../features/types/Anime";
import { getAllAnime, increaseAnimeView } from "../features/api/Anime";
import { UserForm } from "../features/types/User";

export default function HeroSlider() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<UserForm | null>(null);

  // 🔹 API orqali animelarni olish
  useEffect(() => {
    const fetchAnime = async () => {
      try {
        setIsLoading(true);
        const data = await getAllAnime();
        // Faqat premium yoki ko'p ko'rilgan animelarni tanlash
        const featuredAnime = data
          .filter(anime => anime.isPaid || anime.views > 100)
          .slice(0, 10);
        setAnimeList(featuredAnime.length > 0 ? featuredAnime : data.slice(0, 5));
      } catch (err) {
        console.error("Slider anime olishda xato:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnime();
  }, []);

  // 🔹 Slider animation
  useEffect(() => {
    if (animeList.length === 0 || isHovered) return;
    
    const timer = setInterval(() => {
      setIsAnimating(true);
      setCurrent((prev) => (prev + 1) % animeList.length);
      
      // Animation tugagandan so'ng
      setTimeout(() => setIsAnimating(false), 1000);
    }, 6000);
    
    return () => clearInterval(timer);
  }, [animeList, isHovered]);

  const nextSlide = useCallback(() => {
    setIsAnimating(true);
    setCurrent((prev) => (prev + 1) % animeList.length);
    setTimeout(() => setIsAnimating(false), 1000);
  }, [animeList]);

  const prevSlide = useCallback(() => {
    setIsAnimating(true);
    setCurrent((prev) => (prev - 1 + animeList.length) % animeList.length);
    setTimeout(() => setIsAnimating(false), 1000);
  }, [animeList]);

  const handleAnimeClick = async (anime: Anime) => {
    try {
      // Agar anime pullik bo‘lsa
      if (anime.isPaid) {
        // Login qilmagan bo‘lsa
        if (!user) {
          router.push("/login");
          return;
        }
  
        // Obuna yo‘q bo‘lsa
        if (!user.isSubscribed) {
          router.push("/profile");
          return;
        }
      }
  
      // View oshiramiz
      await increaseAnimeView(anime.id);
  
      // Anime sahifaga o‘tamiz
      router.push(`/anime/${anime.id}`);
    } catch (error) {
      console.error("Anime bosilganda xato:", error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="relative w-full h-[75vh] mt-16 flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-purple-900/20">
        <div className="relative">
          <div className="w-20 h-20 border-[3px] border-transparent border-t-purple-500 border-r-amber-500 border-b-pink-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-amber-600 rounded-full flex items-center justify-center animate-pulse">
              <FiPlay className="text-white text-xl" />
            </div>
          </div>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/70 text-sm animate-pulse">
            Yuklanmoqda...
          </div>
        </div>
      </div>
    );
  }

  if (animeList.length === 0) {
    return (
      <div className="relative w-full h-[75vh] mt-16 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-amber-900/20">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-600/30 to-amber-600/30 rounded-full flex items-center justify-center animate-pulse">
              <FiPlay className="text-white text-4xl" />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 to-amber-500/10 rounded-full blur-xl"></div>
          </div>
          <div>
            <h3 className="text-white text-2xl font-bold mb-2 bg-gradient-to-r from-white to-amber-200 bg-clip-text">
              Hech qanday anime topilmadi
            </h3>
            <p className="text-gray-400">Iltimos, keyinroq qayta urinib ko'ring</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full h-[75vh] overflow-hidden mt-16 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black/80 to-amber-900/20"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      </div>

      {/* Slides */}
      {animeList.map((anime, index) => (
        <div
          key={anime.id}
          className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer transform ${
            index === current
              ? "opacity-100 scale-100 translate-x-0 z-20"
              : index < current
              ? "opacity-0 -translate-x-full z-10"
              : "opacity-0 translate-x-full z-10"
          } ${isAnimating ? 'transition-all duration-1000' : ''}`}
          onClick={() => handleAnimeClick(anime)}
        >
          {/* Background Image with Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={anime.image}
              alt={anime.title}
              fill
              priority={index === 0}
              unoptimized
              className="object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
              sizes="100vw"
            />
            {/* Multiple Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/20"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-amber-900/20"></div>
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/30 to-black/80"></div>
            
            {/* Animated Particles Effect */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-[1px] h-[1px] bg-white/30 rounded-full animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${3 + Math.random() * 4}s`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Content Container */}
          <div className="relative z-30 h-full flex items-end pb-16 md:pb-24 px-6 md:px-16 lg:px-24">
            <div className="max-w-4xl space-y-6 transform transition-all duration-700 translate-y-4 group-hover:translate-y-0">
              {/* Premium & Trending Badges */}
              <div className="flex flex-wrap gap-3">
                {anime.isPaid && (
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-600/40 to-yellow-600/40 backdrop-blur-xl px-4 py-2 rounded-xl border border-amber-400/40 shadow-lg shadow-amber-500/10 group/badge">
                    <FaCrown className="text-amber-300 group-hover/badge:rotate-12 transition-transform" />
                    <span className="text-amber-200 font-bold text-sm tracking-wider">PREMIUM</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/badge:translate-x-full transition-transform duration-1000"></div>
                  </div>
                )}
                
                {anime.views > 500 && (
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600/40 to-orange-600/40 backdrop-blur-xl px-4 py-2 rounded-xl border border-red-400/40 shadow-lg shadow-red-500/10">
                    <FaFire className="text-red-300 animate-pulse" />
                    <span className="text-red-200 font-bold text-sm">TRENDING</span>
                  </div>
                )}
              </div>

              {/* Title with Glow Effect */}
              <div className="relative">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] drop-shadow-2xl tracking-tighter">
                  <span className="bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent">
                    {anime.title}
                  </span>
                </h1>
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-transparent to-amber-600/20 blur-2xl -z-10"></div>
              </div>

              {/* Description */}
              {anime.isPaid && (
                <div className="relative">
                  <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl line-clamp-2 backdrop-blur-sm bg-black/20 p-4 rounded-xl border border-white/10">
                    {anime.isPaid}...
                  </p>
                  <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                </div>
              )}

              {/* Stats Cards */}
              <div className="flex flex-wrap items-center gap-4 pt-6">
                {/* Views Card */}
                <div className="group/stat relative">
                  <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-purple-600/30 to-purple-800/30 rounded-lg">
                        <FiEye className="text-purple-300 text-xl" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-white">
                          {anime.views.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">Ko'rishlar</div>
                      </div>
                    </div>
                    {anime.views > 1000 && (
                      <div className="absolute -top-2 -right-2">
                        <FiTrendingUp className="text-green-400 animate-bounce" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Card */}
                <div className="group/stat relative">
                  <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:border-amber-500/50 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        anime.isPaid 
                          ? 'bg-gradient-to-br from-amber-600/30 to-yellow-800/30' 
                          : 'bg-gradient-to-br from-green-600/30 to-emerald-800/30'
                      }`}>
                        {anime.isPaid ? (
                          <MdOutlinePaid className="text-amber-300 text-xl" />
                        ) : (
                          <MdFreeBreakfast className="text-green-300 text-xl" />
                        )}
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-white">
                          {anime.isPaid ? "Premium" : "Bepul"}
                        </div>
                        <div className="text-sm text-gray-400">Holati</div>
                      </div>
                    </div>
                    {anime.isPaid && (
                      <div className="absolute -top-2 -right-2">
                        <FaGem className="text-amber-400 animate-pulse" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Rating Card */}
                <div className="group/stat relative">
                  <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-yellow-600/30 to-amber-800/30 rounded-lg">
                        <FiStar className="text-yellow-300 text-xl" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-white">
                          {anime.views || "N/A"}
                          <span className="text-sm text-yellow-300 ml-1">★</span>
                        </div>
                        <div className="text-sm text-gray-400">views</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-8">
                {/* Watch Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAnimeClick(anime);
                  }}
                  className="group/btn relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 hover:from-purple-700 hover:via-pink-700 hover:to-amber-700 text-white font-bold px-10 py-4 rounded-2xl shadow-2xl hover:shadow-purple-500/40 transition-all duration-500 flex items-center space-x-3 transform hover:-translate-y-1 active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                  <div className="relative z-10 flex items-center space-x-3">
                    <FiPlay className="text-xl group-hover/btn:scale-110 transition-transform" />
                    <span className="text-lg tracking-wide">Hoziroq Ko'rish</span>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-amber-600 blur opacity-0 group-hover/btn:opacity-30 transition-opacity duration-300"></div>
                </button>

                {/* Details Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAnimeClick(anime);
                  }}
                  className="group/btn2 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white font-medium px-6 py-4 rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 flex items-center space-x-2"
                >
                  <span>Batafsil</span>
                  <FiChevronRight className="group-hover/btn2:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Controls */}
      <div className="absolute inset-0 z-40 pointer-events-none">
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-auto w-14 h-14 bg-black/60 hover:bg-black/80 backdrop-blur-xl rounded-full flex items-center justify-center text-white text-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/20 hover:border-purple-400 hover:scale-110 shadow-2xl shadow-black/50"
        >
          <FiChevronLeft />
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-auto w-14 h-14 bg-black/60 hover:bg-black/80 backdrop-blur-xl rounded-full flex items-center justify-center text-white text-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/20 hover:border-amber-400 hover:scale-110 shadow-2xl shadow-black/50"
        >
          <FiChevronRight />
        </button>
      </div>

      {/* Progress & Indicators */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        {/* Progress Bar */}
        <div className="h-1 bg-gray-900/50">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 transition-all duration-1000 ease-out relative overflow-hidden"
            style={{ width: `${((current + 1) / animeList.length) * 100}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-shimmer"></div>
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {animeList.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setCurrent(i);
              }}
              className={`relative transition-all duration-500 ${
                current === i 
                  ? "w-8 bg-gradient-to-r from-purple-500 to-amber-500 scale-125" 
                  : "w-2 bg-white/30 hover:bg-white/60"
              } h-2 rounded-full hover:scale-110`}
            >
              {current === i && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-bold text-white bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                  {i + 1}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Slide Counter */}
        <div className="absolute bottom-6 right-6">
          <div className="text-white/90 text-sm bg-black/50 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10">
            <span className="text-purple-300 font-bold">{current + 1}</span>
            <span className="text-white/60"> / {animeList.length}</span>
          </div>
        </div>
      </div>

      {/* Edge Glows */}
      <div className="absolute left-0 top-0 bottom-0 w-48 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l from-black/90 via-black/50 to-transparent z-10"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-6 left-6 z-20 opacity-50">
        <div className="text-white/30 text-sm animate-pulse">🔥 Ommabop</div>
      </div>
    </div>
  );
}