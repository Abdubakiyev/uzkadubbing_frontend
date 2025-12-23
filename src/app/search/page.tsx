"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Link from "next/link";
import { Anime } from "@/src/features/types/Anime";
import { getAllAnime } from "@/src/features/api/Anime";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Anime[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const allAnime = await getAllAnime();
      const filtered = allAnime.filter((anime) =>
        anime.title.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    };

    fetchData();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32">
      <h1 className="text-2xl font-bold text-white mb-6">
        🔍 "{query}" bo‘yicha natijalar
      </h1>

      {results.length === 0 && (
        <p className="text-white/70">Hech narsa topilmadi</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {results.map((anime) => (
          <Link
            key={anime.id}
            href={`/anime/${anime.id}`}
            className="bg-white/10 p-4 rounded-xl hover:bg-white/20 transition"
          >
            <img src={anime.image} alt={anime.title} className="rounded-lg" />
            <p className="mt-2 text-white font-semibold">{anime.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
