"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, Calendar, Star, MessageCircle } from "lucide-react";
import AnimeGrid from "@/src/components/AnimeGrid";
import MainHeader from "@/src/components/MainHeader";

// 🔹 Type interfeysi
interface Anime {
  id: number;
  title: string;
  image: string;
  views: number;
}

// 🔹 Shunga o‘xshash animelar ro‘yxati
const similarAnimes: Anime[] = [
  { id: 1, title: "Hellsing: Ultimate", image: "/animes/hellsing.jpg", views: 527 },
  { id: 2, title: "Mening sirli sevgan qizim X", image: "/animes/mysterious-girlfriend-x.jpg", views: 637 },
  { id: 3, title: "Evangelion", image: "/animes/evangelion.jpg", views: 379 },
  { id: 4, title: "Oq ilon", image: "/animes/white-snake.jpg", views: 132 },
  { id: 5, title: "Bu ajoyib dunyo 2", image: "/animes/konosuba.jpg", views: 450 },
  { id: 6, title: "Sen uchun o‘lmas 3", image: "/animes/to-your-eternity.jpg", views: 516 },
];

// 🔹 Izohlar
const comments = [
  {
    id: 1,
    user: "muhammadazizmamlakat@gmail.com",
    text: "Buni oldin ko‘rgandim, lekin qaytadan ko‘rganimda umuman boshqa animeni ko‘rgandek bo‘ldim. Juda ajoyib ovoz berilibdi!",
    likes: 0,
    dislikes: 0,
    date: "2025-11-10",
  },
];

export default function AnimePage() {
  const animeData = {
    id: "1",
    title: "Iblislar qotili: Cheksiz qal'a",
    image: "/anime1.jpg",
    year: 2025,
    rating: 8.5,
    episodes: 12,
    audio: "UzkaDubbing",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    desc: `Tanjirou Kamado singlisi Nezuko iblisga aylangandan so‘ng, iblislarni ovlaydigan Iblis Qiruvchi Korpusga qo‘shiladi. Do'stlari Zenitsu Agatsuma va Inosuke Hashibira bilan birga kuchayib, ko‘plab iblislarga qarshi jang qiladi. U Mugen Poyezdida Olov Hashirasi Kyojuro Rengoku, O‘yin-kulgi Tumanida Ovoz Hashirasi Tengen Uzui, shuningdek, Qilichbozlar bilan birgalikda eng kuchli iblislar bilan to‘qnashadi.`,
  };

  const [showMore, setShowMore] = useState(false);
  const [newComment, setNewComment] = useState("");

  // 🔹 Qismlar (episode) uchun state
  const [currentEpisode, setCurrentEpisode] = useState({
    id: 1,
    title: "1-qism",
    videoUrl: animeData.videoUrl,
  });

  const episodes = [
    { id: 1, title: "1-qism", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { id: 2, title: "2-qism", videoUrl: "https://www.w3schools.com/html/movie.mp4" },
    { id: 3, title: "3-qism", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
  ];

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center">
      <MainHeader/>
      {/* 🔹 HERO BANNER */}
      <div className="relative w-full h-[70vh] mt-20">
        <Image
          src={animeData.image}
          alt={animeData.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        {/* 🔹 Stats overlay */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex gap-6 text-white/90 backdrop-blur-sm bg-black/30 rounded-lg p-4">
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold">Qismlar</span>
            <span className="flex items-center gap-1 text-purple-400">
              {animeData.episodes} <Play size={16} />
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold">Yili</span>
            <span className="flex items-center gap-1 text-purple-400">
              {animeData.year} <Calendar size={16} />
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold">Bahosi</span>
            <span className="flex items-center gap-1 text-yellow-400">
              {animeData.rating} <Star size={16} className="fill-yellow-400" />
            </span>
          </div>
        </div>

        {/* 🔹 Title */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center">
          <h1 className="text-4xl font-bold drop-shadow-lg">{animeData.title}</h1>
          <p className="text-sm text-gray-300 mt-2">
            🎤 Ovoz berdi: <span className="text-purple-400">{animeData.audio}</span>
          </p>
        </div>
      </div>

      {/* 🔹 Video player */}
      <div className="mt-10 w-full max-w-5xl rounded-2xl overflow-hidden shadow-lg bg-gray-900">
        <video controls className="w-full aspect-video" poster={animeData.image} key={currentEpisode.id}>
          <source src={currentEpisode.videoUrl} type="video/mp4" />
          Sizning brauzeringiz video formatini qo‘llab-quvvatlamaydi.
        </video>
      </div>

      {/* 🔹 Episode tugmalari */}
      <div className="mt-4 flex flex-wrap gap-3 justify-center">
        {episodes.map((ep) => (
          <button
            key={ep.id}
            onClick={() => setCurrentEpisode(ep)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              currentEpisode.id === ep.id
                ? "bg-purple-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {ep.title}
          </button>
        ))}
      </div>

      {/* 🔹 Asosiy kontent */}
      <div className="w-full max-w-5xl mt-8 flex flex-col gap-8 px-4">
        {/* 🔸 Anime haqida */}
        <div className="border-t border-gray-800 pt-4">
          <h3 className="font-semibold text-lg mb-2">Anime haqida:</h3>
          <p className="text-gray-300 leading-relaxed whitespace-pre-line">
            {showMore ? animeData.desc : animeData.desc.slice(0, 280) + "…"}
          </p>
          <button
            onClick={() => setShowMore(!showMore)}
            className="mt-2 bg-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-700 transition"
          >
            {showMore ? "Kamroq" : "Ko‘proq"}
          </button>
        </div>

        {/* 🔸 Shunga o‘xshash animelar */}
        <div className="border-t border-gray-800 pt-4">
          <h3 className="font-semibold text-lg mb-4">Shunga o‘xshash animelar:</h3>
          <AnimeGrid animeList={similarAnimes} />
        </div>

        {/* 🔸 Izohlar */}
        <div className="border-t border-gray-800 pt-4 mb-10">
          <h3 className="font-semibold text-lg mb-4">Izohlar:</h3>

          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Izoh qoldiring!"
              className="w-full bg-transparent border border-gray-700 rounded-xl px-4 py-2 text-sm outline-none focus:border-purple-400"
            />
            <button className="bg-purple-600 hover:bg-purple-700 transition rounded-xl px-3 py-2">
              <MessageCircle size={20} />
            </button>
          </div>

          <div className="mt-6 space-y-5">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold">
                  {comment.user[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {comment.user}{" "}
                    <span className="text-xs text-gray-500">({comment.date})</span>
                  </p>
                  <p className="text-gray-300 mt-1">{comment.text}</p>
                  <div className="flex items-center gap-4 text-gray-500 text-sm mt-1">
                    <span>👍 {comment.likes}</span>
                    <span>👎 {comment.dislikes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
