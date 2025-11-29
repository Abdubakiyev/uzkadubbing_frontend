"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Anime } from "../features/types/Anime";
import { getAllAnime } from "../features/api/Anime";


export default function HeroSlider() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  // 🔹 API orqali animelarni olish
  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const data = await getAllAnime();
        setAnimeList(data);
      } catch (err) {
        console.error("Slider anime olishda xato:", err);
      }
    };
    fetchAnime();
  }, []);

  // 🔹 Har 5 soniyada keyingi rasmga o'tish
  useEffect(() => {
    if (animeList.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % animeList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [animeList]);

  // 🔹 Sahifaga id orqali o'tish
  const handleClick = (id: string) => {
    router.push(`/anime/${id}`);
  };

  if (animeList.length === 0)
    return (
      <div className="h-[60vh] flex items-center justify-center text-white">
        Yuklanmoqda...
      </div>
    );

  return (
    <div className="relative w-full h-[60vh] overflow-hidden mt-16">
      {animeList.map((anime, index) => (
        <div
          key={anime.id}
          onClick={() => handleClick(anime.id)}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out cursor-pointer ${
            index === current
              ? "opacity-100 translate-x-0 z-10"
              : "opacity-0 translate-x-full z-0"
          }`}
        >
          <Image
            src={anime.image}
            alt={anime.title}
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

          <div className="absolute bottom-16 left-10 md:left-20 text-white max-w-3xl select-none">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              {anime.title}
            </h1>
            <p className="text-lg text-white/90 leading-relaxed drop-shadow">
              Views: {anime.views} | {anime.isPaid ? "Paid" : "Free"}
            </p>
          </div>
        </div>
      ))}

      {/* Dots Indicator */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {animeList.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              current === i ? "bg-purple-500 scale-110" : "bg-white/50"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
