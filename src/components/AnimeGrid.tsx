"use client";

import Image from "next/image";
import Link from "next/link";
import { FaEye, FaBookmark } from "react-icons/fa";
import { Anime } from "@/src/types/Anime";

// Props interfeysi
interface AnimeGridProps {
  animeList?: (Anime & { isPaid?: boolean })[]; // optional qildik -> default ishlaydi
}

// SAMPLE DATA — ichiga to‘liq joylab berildi
const sampleAnimeList: (Anime & { isPaid?: boolean })[] = [
  {
    id: 1,
    title: "Dorohedoro",
    image: "/animes/dorohedoro.jpg",
    views: 1622,
    slug: "dorohedoro",
    isPaid: false,
  },
  {
    id: 2,
    title: "Gachiakuta",
    image: "/animes/gachiakuta.jpg",
    views: 696,
    slug: "gachiakuta",
    isPaid: true,
  },
  {
    id: 3,
    title: "Iblislar qotili: Cheksiz qal'a",
    image: "/animes/demon-slayer.jpg",
    views: 891,
    slug: "demon-slayer",
    isPaid: false,
  },
  {
    id: 4,
    title: "Mening sirli sevgan qizim X",
    image: "/animes/mysterious-girlfriend-x.jpg",
    views: 637,
    slug: "mysterious-girlfriend-x",
    isPaid: true,
  },
  {
    id: 5,
    title: "Evangelion",
    image: "/animes/evangelion.jpg",
    views: 379,
    slug: "evangelion",
    isPaid: false,
  },
  {
    id: 6,
    title: "Hellsing: Ultimate",
    image: "/animes/hellsing.jpg",
    views: 527,
    slug: "hellsing-ultimate",
    isPaid: true,
  },
  {
    id: 7,
    title: "Yashil ilon",
    image: "/animes/green-snake.jpg",
    views: 224,
    slug: "green-snake",
    isPaid: false,
  },
  {
    id: 8,
    title: "Oq ilon",
    image: "/animes/white-snake.jpg",
    views: 132,
    slug: "white-snake",
    isPaid: true,
  },
  {
    id: 9,
    title: "Sen uchun o‘lmas 3",
    image: "/animes/to-your-eternity.jpg",
    views: 516,
    slug: "to-your-eternity",
    isPaid: false,
  },
  {
    id: 10,
    title: "Qora Xizmatkor",
    image: "/animes/black-butler.jpg",
    views: 716,
    slug: "black-butler",
    isPaid: true,
  },
];

// MAIN COMPONENT
export default function AnimeGrid({ animeList = sampleAnimeList }: AnimeGridProps) {
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
              {/* Image */}
              <div className="relative w-full aspect-[3/4]">
                <Image
                  src={anime.image}
                  alt={anime.title}
                  fill
                  className="object-cover group-hover:opacity-90 transition duration-300"
                />
              </div>

              {/* Views */}
              <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded-md flex items-center text-sm space-x-1">
                <FaEye className="text-white/80" />
                <span>{anime.views}</span>
              </div>

              {/* Bookmark Icon */}
              <div className="absolute top-2 right-2 bg-black/60 p-1 rounded-md">
                <FaBookmark className="text-white/80" />
              </div>

              {/* Title */}
              <div className="p-3">
                <h2 className="text-sm sm:text-base font-semibold truncate group-hover:text-yellow-300 transition">
                  {anime.title}
                </h2>
                {/* 🔹 Pullik yoki Tekin belgi */}
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
