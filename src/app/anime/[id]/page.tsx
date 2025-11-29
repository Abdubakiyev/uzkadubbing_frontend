"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, Star, MessageCircle } from "lucide-react";
import AnimeGrid from "@/src/components/AnimeGrid";
import MainHeader from "@/src/components/MainHeader";
import { getAnimeById, getAllAnime } from "@/src/features/api/Anime";
import { getCommentsByAnimeId, createComment } from "@/src/features/api/Comments";
import { Anime } from "@/src/features/types/Anime";
import { Comment, CreateCommentDto } from "@/src/features/types/Comment";
import { useParams } from "next/navigation";

export default function AnimePage() {
  const [animeData, setAnimeData] = useState<Anime | null>(null);
  const [similarAnimes, setSimilarAnimes] = useState<Anime[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [newComment, setNewComment] = useState("");
  const params = useParams();

  const animeId: string | undefined = params?.id
    ? Array.isArray(params.id)
      ? params.id[0]
      : params.id
    : undefined;

  useEffect(() => {
    if (!animeId) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token") || undefined;

        // Anime ma'lumotini olish
        const anime = await getAnimeById(animeId);
        setAnimeData(anime);

        // Shunga o'xshash animelar
        const allAnime = await getAllAnime();
        const similar = allAnime.filter((a) => a.id !== anime.id).slice(0, 5);
        setSimilarAnimes(similar);

        // Commentlar
        if (token) {
          const animeComments = await getCommentsByAnimeId(anime.id, token);
          setComments(animeComments);
        }
      } catch (err) {
        console.error("AnimePage fetch xatosi:", err);
      }
    };

    fetchData();
  }, [animeId]);

  // ==========================
  // COMMENT QO‘SHISH
  // ==========================
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Siz tizimga kirmagansiz!");
      return;
    }

    try {
      const dto: CreateCommentDto = {
        animeId: animeId!,
        text: newComment,
      };

      const addedComment = await createComment(dto, token);

      // UI-ga darhol qo‘shish
      setComments((prev) => [addedComment, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("Comment yaratishda xato:", err);
      alert("Comment qo‘shishda xatolik yuz berdi");
    }
  };

  if (!animeData) {
    return <div className="text-center text-white py-20">Anime yuklanmoqda...</div>;
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center">
      <MainHeader />

      {/* HERO */}
      <div className="relative w-full h-[70vh] mt-20">
        <Image
          src={animeData.image.startsWith("http") ? animeData.image : `/uploads/${animeData.image}`}
          alt={animeData.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        {/* Stats */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex gap-6 p-4 rounded-lg bg-black/40">
          <div className="flex flex-col items-center">
            <span>Views</span>
            <span className="flex items-center gap-1 text-yellow-400">
              {animeData.views} <Star size={16} className="fill-yellow-400" />
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span>Yili</span>
            <span className="flex items-center gap-1 text-purple-400">
              {animeData.createdAt.slice(0, 4)} <Calendar size={16} />
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span>To‘lov</span>
            <span className="flex items-center gap-1 text-purple-400">
              {animeData.isPaid ? "Paid" : "Free"}
            </span>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center">
          <h1 className="text-4xl font-bold">{animeData.title}</h1>
        </div>
      </div>

      {/* VIDEO PLAYER */}
      <div className="relative mt-10 w-full max-w-5xl rounded-2xl overflow-hidden shadow-lg bg-gray-900">
        <video controls className="w-full aspect-video" poster={animeData.image}>
          <source src={animeData.url} type="video/mp4" />
          Browser video formatini qo‘llab-quvvatlamaydi.
        </video>
      </div>

      {/* DESCRIPTION – SIMILAR – COMMENTS */}
      <div className="w-full max-w-5xl mt-8 flex flex-col gap-8 px-4">
        {/* About */}
        <div className="border-t border-gray-800 pt-4">
          <h3 className="font-semibold text-lg mb-2">Anime haqida:</h3>
          <p className="text-gray-300 leading-relaxed whitespace-pre-line">
            {showMore ? animeData.title : animeData.title.slice(0, 280) + "…"}
          </p>
          <button
            onClick={() => setShowMore(!showMore)}
            className="mt-2 bg-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-700"
          >
            {showMore ? "Kamroq" : "Ko‘proq"}
          </button>
        </div>

        {/* Similar */}
        <div className="border-t border-gray-800 pt-4">
          <h3 className="font-semibold text-lg mb-4">Shunga o‘xshash animelar:</h3>
          <AnimeGrid />
        </div>

        {/* Comments */}
        <div className="border-t border-gray-800 pt-4 mb-10">
          <h3 className="font-semibold text-lg mb-4">Izohlar:</h3>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Izoh qoldiring!"
              className="w-full bg-transparent border border-gray-700 rounded-xl px-4 py-2 text-sm"
            />
            <button
              onClick={handleAddComment}
              className="bg-purple-600 hover:bg-purple-700 rounded-xl px-3 py-2"
            >
              <MessageCircle size={20} />
            </button>
          </div>

          <div className="mt-6 space-y-5">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold">
                  {comment.user?.username ? comment.user.username[0].toUpperCase() : "U"}
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {comment.user?.username || "Unknown"}{" "}
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="text-gray-300 mt-1">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
