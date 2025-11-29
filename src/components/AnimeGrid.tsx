"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaEye, FaBookmark } from "react-icons/fa";
import { Anime } from "@/src/features/types/Anime";
import { getAllAnime } from "@/src/features/api/Anime"; // API import


export default function AnimeGrid() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const data = await getAllAnime(); // Backend API dan barcha anime olish
        setAnimeList(data);
      } catch (err) {
        console.error("Anime fetch xatosi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, []);

  if (loading) {
    return <div className="text-center text-white py-20">Anime yuklanmoqda...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🔥 Mashhur Anime’lar</h1>

        <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {animeList.map((anime) => (
            <Link
              href={`/anime/${anime.slug}`}
              key={anime.id}
              className="relative group rounded-xl overflow-hidden bg-[#111] shadow-lg hover:scale-[1.03] hover:shadow-2xl transition-all duration-300"
            >
              {/* Rasm */}
              <div className="relative w-full aspect-[3/4]">
                <Image
                  src={anime.image.startsWith("http") ? anime.image : `/uploads/${anime.image}`}
                  alt={anime.title}
                  fill
                  className="object-cover group-hover:opacity-90 transition duration-300"
                />
              </div>

              {/* Ko‘rilganlar */}
              <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded-md flex items-center text-sm space-x-1">
                <FaEye className="text-white/80" />
                <span>{anime.views}</span>
              </div>

              {/* Bookmark */}
              <div className="absolute top-2 right-2 bg-black/60 p-1 rounded-md">
                <FaBookmark className="text-white/80" />
              </div>

              {/* Sarlavha va Pullik/Tekin belgi */}
              <div className="p-3">
                <h2 className="text-sm sm:text-base font-semibold truncate group-hover:text-yellow-300 transition">
                  {anime.title}
                </h2>
                <span
                  className={`mt-1 inline-block px-2 py-1 text-xs font-semibold rounded ${
                    anime.isPaid ? "bg-red-600 text-white" : "bg-green-600 text-white"
                  }`}
                >
                  {anime.isPaid ? "Pullik" : "Tekin"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
