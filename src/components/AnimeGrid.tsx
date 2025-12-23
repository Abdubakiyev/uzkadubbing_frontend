"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEye, FaBookmark, FaFire, FaCrown, FaStar, FaPlay, FaHeart } from "react-icons/fa";
import { Anime } from "@/src/features/types/Anime";
import { getAllAnime, increaseAnimeView } from "@/src/features/api/Anime";
import { MdPaid, MdWhatshot } from "react-icons/md";
import { useRouter } from "next/navigation";
import { AuthUser } from "../features/types/AuthUser";


export default function AnimeGrid() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);


  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const data = await getAllAnime();
        // Sort by views for popular anime
        const sortedData = [...data].sort((a, b) => b.views - a.views);
        setAnimeList(sortedData);
      } catch (err) {
        console.error("Anime fetch xatosi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, []);

  const handleAnimeClick = async (anime: Anime) => {
    try {
      // Agar anime pullik bo‘lsa
      if (anime.isPaid) {
        // Login qilmagan bo‘lsa
        if (!user) {
          router.push("/register");
          return;
        }
        console.log("USER:", user);
  
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
  

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-transparent border-t-purple-500 border-r-amber-500 border-b-pink-500 rounded-full animate-spin mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaPlay className="text-white text-xl animate-pulse" />
            </div>
          </div>
          <p className="text-gray-300 text-lg mt-4 animate-pulse">Anime yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white px-4 sm:px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-purple-600/10 rounded-full blur-3xl"></div>
          
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full">
              <FaFire className="text-2xl text-orange-400 animate-pulse" />
            </div>
            <span className="text-amber-300 font-bold text-sm uppercase tracking-wider">Trending Now</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent">
            🔥 Mashhur Anime'lar
          </h1>
          
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Eng ko'p ko'rilgan va eng yaxshi reytingli animelar
          </p>
          
          {/* Stats */}
          <div className="flex justify-center items-center gap-6 mt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{animeList.length}</div>
              <div className="text-gray-400 text-sm">Jami Anime</div>
            </div>
            <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {animeList.reduce((sum, anime) => sum + anime.views, 0).toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm">Jami Ko'rishlar</div>
            </div>
          </div>
        </div>

        {/* Anime Grid */}
        <div 
          ref={containerRef}
          className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
          {animeList.map((anime, index) => (
            <Link
              key={anime.id}
              href={`/anime/${anime.id}`}
              onClick={() => handleAnimeClick(anime)}
              onMouseEnter={() => setHoveredCard(anime.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="relative group"
            >
              {/* Card Container */}
              <div className="relative rounded-2xl overflow-hidden transition-all duration-500 group-hover:scale-[1.05] group-hover:shadow-2xl group-hover:shadow-purple-500/20">
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-transparent to-amber-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl p-[1px]">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-amber-600 rounded-2xl blur-sm"></div>
                </div>

                {/* Main Card */}
                <div className="relative bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800/50 group-hover:border-purple-500/30 transition-all duration-300">
                  {/* Image Container */}
                  <div className="relative w-full aspect-[3/4] overflow-hidden">
                    <Image
                      src={
                        anime.image.startsWith("http")
                          ? anime.image
                          : `http://localhost:3000/uploads/${anime.image}`
                      }
                      alt={anime.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80"></div>
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
                      {/* Premium Badge */}
                      {anime.isPaid && (
                        <div className="flex items-center gap-1 bg-gradient-to-r from-amber-600/90 to-yellow-600/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-amber-400/30">
                          <FaCrown className="text-amber-200 text-xs" />
                          <span className="text-amber-100 text-xs font-bold">PREMIUM</span>
                        </div>
                      )}
                      
                      {/* Views Badge */}
                      <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                        <FaEye className="text-purple-300 text-xs" />
                        <span className="text-white text-xs font-medium">{anime.views.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    {/* Trending Badge */}
                    {anime.views > 1000 && (
                      <div className="absolute top-3 left-3 right-3 z-10 flex justify-center">
                        <div className="flex items-center gap-1 bg-gradient-to-r from-red-600/90 to-orange-600/90 backdrop-blur-sm px-3 py-1 rounded-full">
                          <MdWhatshot className="text-orange-200 text-xs" />
                          <span className="text-white text-xs font-bold">TRENDING</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-2xl shadow-purple-500/50">
                        <FaPlay className="text-white text-lg ml-1" />
                      </div>
                    </div>
                    
                    {/* Number Indicator */}
                    <div className="absolute bottom-3 left-3">
                      <div className="text-5xl font-black text-white/20 leading-none">
                        {index + 1}
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4 relative z-20">
                    {/* Title */}
                    <h2 className="text-sm sm:text-base font-bold mb-2 line-clamp-1 group-hover:text-amber-300 transition-colors duration-300">
                      {anime.title}
                    </h2>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {/* Status */}
                      <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        anime.isPaid 
                          ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30' 
                          : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30'
                      }`}>
                        {anime.isPaid}
                        <span>{anime.isPaid ? "Pullik" : "Tekin"}</span>
                      </div>
                      
                      {/* Rating */}
                      {anime.views && (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-full text-xs font-semibold text-yellow-300 border border-yellow-500/30">
                          <FaStar className="text-xs" />
                          <span>{anime.views}</span>
                        </div>
                      )}
                    </div>
                    
                    
                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      {/* Bookmark */}
                      <button 
                        className="p-2 rounded-full bg-white/5 hover:bg-purple-500/20 transition-all duration-300 group/bookmark"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Bookmark logic here
                        }}
                      >
                        <FaBookmark className="text-gray-400 group-hover/bookmark:text-purple-400 transition-colors duration-300" />
                      </button>
                      
                      {/* Like */}
                      <button 
                        className="p-2 rounded-full bg-white/5 hover:bg-pink-500/20 transition-all duration-300 group/like"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Like logic here
                        }}
                      >
                        <FaHeart className="text-gray-400 group-hover/like:text-pink-400 transition-colors duration-300" />
                      </button>
                      
                      {/* Quick View */}
                      <div className="text-xs text-gray-500 font-medium">
                        Batafsil →
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Effect Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/5 to-amber-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
                </div>

                {/* Floating Elements */}
                {hoveredCard === anime.id && (
                  <>
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-500 rounded-full blur-sm animate-ping"></div>
                    <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-amber-500 rounded-full blur-sm animate-ping delay-300"></div>
                  </>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {animeList.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500/10 to-amber-500/10 rounded-full flex items-center justify-center mb-6">
              <FaPlay className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">Hech qanday anime topilmadi</h3>
            <p className="text-gray-500">Kechirasiz, hozircha anime mavjud emas.</p>
          </div>
        )}
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}