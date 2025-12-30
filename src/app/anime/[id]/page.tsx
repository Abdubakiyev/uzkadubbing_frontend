"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Calendar, Star, MessageCircle, Play, Share2, Heart, Bookmark, SkipForward, Eye, ChevronRight } from "lucide-react";
import MainHeader from "@/src/components/MainHeader";
import { getAnimeById, getAllAnime } from "@/src/features/api/Anime";
import { getCommentsByAnimeId, createComment, deleteComment } from "@/src/features/api/Comments";
import { getAllEpisodes } from "@/src/features/api/Episode";
import { getAllAdvertisements } from "@/src/features/api/Reklama";

import { Anime } from "@/src/features/types/Anime";
import { Comment, CreateCommentDto } from "@/src/features/types/Comment";
import { Episode } from "@/src/features/types/Episode";
import { useParams } from "next/navigation";
import { FiPlay } from "react-icons/fi";

export default function AnimePage() {
  const [animeData, setAnimeData] = useState<Anime | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [similarAnimes, setSimilarAnimes] = useState<Anime[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);


  const [ad, setAd] = useState<{ video?: string; link?: string; text?: string } | null>(null);
  const [showAd, setShowAd] = useState(true);
  const [adTimeLeft, setAdTimeLeft] = useState(5);
  const [skipVisible, setSkipVisible] = useState(false);

  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const adVideoRef = useRef<HTMLVideoElement>(null);

  const params = useParams();
  const animeId: string | undefined = params?.id
    ? Array.isArray(params.id)
      ? params.id[0]
      : params.id
    : undefined;

  // ==========================
  // FETCH DATA
  // ==========================
  useEffect(() => {
    if (!animeId) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token") || undefined;

        const anime = await getAnimeById(animeId);
        setAnimeData(anime);

        const eps = await getAllEpisodes(anime.id);
        setEpisodes(eps);

        if (eps.length > 0) setCurrentEpisode(eps[0]);

        const allAnime = await getAllAnime();
        // Faqat 3 ta o'xshash anime
        const similar = allAnime
          .filter(a => a.id !== anime.id)
          .slice(0, 3);
        setSimilarAnimes(similar);

        if (token) {
          const animeComments = await getCommentsByAnimeId(anime.id, token);
          setComments(animeComments);
        }

        // Fetch random advertisement
        const ads = await getAllAdvertisements();
        if (ads.length > 0) {
          const randomAd = ads[Math.floor(Math.random() * ads.length)];
          setAd(randomAd);
        } else {
          setShowAd(false);
        }
      } catch (err) {
        console.error("AnimePage fetch xatosi:", err);
        setShowAd(false);
      }
    };

    fetchData();
  }, [animeId]);

  // ==========================
  // COMMENT QO'SHISH
  // ==========================
  const handleAddComment = async (episodeId?: string) => {
    if (!newComment.trim() || !animeData) return;
  
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Siz tizimga kirmagansiz!");
      return;
    }
  
    try {
      const dto: CreateCommentDto = {
        animeId: animeData.id,
        text: newComment.trim(),
        episodeId, // optional, faqat agar berilsa yuboriladi
      };
  
      const addedComment = await createComment(dto, token);
  
      // Yangi commentni ro'yxat boshiga qo'shish
      setComments((prev) => [addedComment, ...prev]);
  
      // Inputni tozalash
      setNewComment("");
    } catch (err: any) {
      console.error("Comment yaratishda xato:", err);
      alert(err.message || "Comment qo'shishda xatolik yuz berdi");
    }
  };
  
  const handleDeleteComment = async (
    commentId: string,

  ) => {
    if (!confirm("⚠️ Rostdan ham bu commentni o'chirmoqchimisiz?")) return;
    const token = localStorage.getItem("access_token") || undefined;
  
    try {
      if (!token) throw new Error("Siz tizimga kirishingiz kerak");
  
      // Backendga request yuboramiz
      await deleteComment(commentId, token);
  
      // State yangilash: commentni ro'yxatdan olib tashlash
      setComments((prev) =>
        prev.filter((comment) => comment.id !== commentId)
      );
  
      alert("✅ Comment o'chirildi!");
    } catch (err: any) {
      console.error("Commentni o‘chirish xatosi:", err);
      alert(err.message || "❌ Commentni o‘chirishda xatolik yuz berdi");
    }
  };

  // ==========================
  // PRE-ROLL REKLAMA LOGIKA
  // ==========================
  useEffect(() => {
    if (!showAd || !adVideoRef.current) return;

    adVideoRef.current.currentTime = 0;
    adVideoRef.current.play();

    setAdTimeLeft(5);
    setSkipVisible(false);

    const interval = setInterval(() => {
      setAdTimeLeft(prev => {
        if (prev <= 1) {
          setSkipVisible(true);
          clearInterval(interval);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showAd, ad?.video]);

  const handleSkipAd = () => {
    setShowAd(false);
    mainVideoRef.current?.play();
  };

  const handleAdEnded = () => {
    setShowAd(false);
    mainVideoRef.current?.play();
  };

  const imageSrc =
    animeData?.image && animeData.image.startsWith("http")
      ? animeData.image
      : animeData?.image
      ? `http://localhost:3000/uploads/${animeData.image}`
      : "/no-image.jpg";

  if (!animeData) {
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <MainHeader />

      {/* HERO SECTION */}
      <div className="relative w-full h-[70vh] mt-16 overflow-hidden">
        <Image
          src={imageSrc}
          alt={animeData.title}
          fill
          priority
          unoptimized
          className="object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />
        
        {/* Stats Overlay */}
        <div className="absolute bottom-20 left-0 right-0">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap items-center gap-6 backdrop-blur-sm bg-black/30 rounded-2xl p-6 border border-white/10 max-w-2xl">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{animeData.views}</div>
                <div className="text-gray-300 text-sm">Ko'rishlar</div>
              </div>
              
              <div className="h-10 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">
                  {animeData.createdAt.slice(0, 4)}
                </div>
                <div className="text-gray-300 text-sm">Yili</div>
              </div>
              
              <div className="h-10 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
              
              <div className="text-center">
                <div className={`text-3xl font-bold ${animeData.isPaid ? 'text-red-400' : 'text-green-400'}`}>
                  {animeData.isPaid ? "Pullik" : "Tekin"}
                </div>
                <div className="text-gray-300 text-sm">Holati</div>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="absolute bottom-10 left-0 right-0 text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
            {animeData.title}
          </h1>
        </div>
      </div>

      {/* VIDEO PLAYER SECTION */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Video Container */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800/50">
          {showAd && ad?.video ? (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-amber-900/20 z-10"></div>
              <video
                ref={adVideoRef}
                src={ad.video}
                className="w-full aspect-video object-cover"
                onEnded={handleAdEnded}
                controls={false}
                autoPlay
              />
              {/* Ad Overlay */}
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/20">
                <span className="text-sm font-medium">Reklama</span>
              </div>
              
              {/* Timer/Skip */}
              {!skipVisible ? (
                <div className="absolute bottom-4 right-4 bg-gradient-to-r from-red-600/90 to-orange-600/90 text-white px-4 py-2 rounded-full font-bold">
                  {adTimeLeft}s
                </div>
              ) : (
                <button
                  onClick={handleSkipAd}
                  className="absolute bottom-4 right-4 bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all duration-300 hover:scale-105"
                >
                  <SkipForward size={20} />
                  Skip Ad
                </button>
              )}
            </div>
          ) : (
            <div className="relative">
              <video
                ref={mainVideoRef}
                key={currentEpisode?.videoUrl}
                controls
                className="w-full aspect-video"
                poster={animeData?.image}
              >
                <source src={currentEpisode?.videoUrl} type="video/mp4" />
                Browser video formatini qo'llab-quvvatlamaydi.
              </video>
              
              {/* Video Overlay */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Play size={16} />
                <span className="text-sm font-medium">Endi o'ynayapti</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => {
              if (!animeData?.url) return;
              const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
                animeData.url
              )}&text=${encodeURIComponent(animeData.title)}`;
              window.open(telegramUrl, "_blank");
            }}
            className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-8 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/20"
          >
            <Share2 size={20} />
            <span>Telegramdan yuklash</span>
          </button>
          
          <button className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 hover:scale-105 border border-white/20">
            <Bookmark size={20} />
            <span>Saqlash</span>
          </button>
          
          <button className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 hover:scale-105 border border-white/20">
            <Heart size={20} />
            <span>Yoqdi</span>
          </button>
        </div>

        {/* EPISODE SELECTION - KO'PROQ CHIROYLI */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-amber-500 rounded-full"></div>
              Epizodlar ({episodes.length})
            </h3>
            <div className="text-gray-400 text-sm">
              Joriy: <span className="text-yellow-400 font-bold">{currentEpisode?.title}</span>
            </div>
          </div>
          
          {episodes.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {episodes.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => setCurrentEpisode(ep)}
                  className={`group relative overflow-hidden rounded-xl transition-all duration-300 ${
                    currentEpisode?.id === ep.id
                      ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-black scale-105'
                      : 'hover:scale-105'
                  }`}
                >
                  <div className={`absolute inset-0 rounded-xl z-0 ${
                    currentEpisode?.id === ep.id
                      ? 'bg-gradient-to-br from-purple-600/30 to-amber-600/30'
                      : 'bg-gradient-to-br from-gray-900/50 to-black/50'
                  }`}></div>
                  
                  <div className="relative z-10 p-4">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                      currentEpisode?.id === ep.id
                        ? 'bg-gradient-to-r from-purple-600 to-amber-600'
                        : 'bg-gray-800 group-hover:bg-gray-700'
                    } transition-all duration-300`}>
                      <Play 
                        size={20} 
                        className={`${
                          currentEpisode?.id === ep.id 
                            ? 'text-white' 
                            : 'text-gray-400 group-hover:text-white'
                        } ml-1`}
                      />
                    </div>
                    
                    <div className="text-center">
                      <div className={`font-bold text-sm ${
                        currentEpisode?.id === ep.id
                          ? 'text-yellow-300'
                          : 'text-white group-hover:text-yellow-300'
                      } transition-colors duration-300`}>
                        {ep.title}
                      </div>
                      
                      {ep.episodeNumber && (
                        <div className="text-xs text-gray-400 mt-1">
                          {ep.episodeNumber}
                        </div>
                      )}
                    </div>
                    
                    {currentEpisode?.id === ep.id && (
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gradient-to-br from-gray-900/30 to-black/30 rounded-2xl border border-white/10">
              <Play size={48} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Hozircha epizodlar mavjud emas</p>
            </div>
          )}
        </div>
      </div>

      {/* CONTENT SECTIONS */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Description & Comments */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-white">Anime haqida</h3>
              <div className="flex items-center gap-2 text-yellow-400">
                <Star size={20} className="fill-yellow-400" />
                <span className="font-bold">Reyting</span>
              </div>
            </div>
            
            <div className="relative">
              <p className={`text-gray-300 leading-relaxed whitespace-pre-line transition-all duration-300 ${
                !showMore ? "max-h-32 overflow-hidden" : ""
              }`}>
                {animeData.title}
              </p>
              
              {!showMore && (
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900/90 to-transparent pointer-events-none"></div>
              )}
            </div>
            
            <button
              onClick={() => setShowMore(!showMore)}
              className="mt-4 bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 border border-white/10"
            >
              {showMore ? "Kamroq ko'rsatish" : "Ko'proq ko'rsatish"}
            </button>
          </div>

          {/* Comments */}
          <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <MessageCircle size={24} className="text-purple-400" />
              <h3 className="text-2xl font-bold text-white">
                Izohlar ({comments.length})
              </h3>
            </div>

            {/* Comment Input */}
            <div className="flex gap-3 mb-8">
              <div className="flex-1">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Izoh qoldiring..."
                  className="w-full bg-black/50 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors duration-300"
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleAddComment()
                  }
                />
              </div>
              <button
                onClick={() => handleAddComment()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl px-6 py-3 font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <MessageCircle size={20} />
                <span>Yuborish</span>
              </button>
            </div>
                
            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="group bg-black/30 hover:bg-black/40 backdrop-blur-sm rounded-xl p-5 border border-white/10 transition-all duration-300 relative"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-full flex items-center justify-center text-xl font-bold text-white border border-white/20">
                      {comment.user?.username
                        ? comment.user.username[0].toUpperCase()
                        : "U"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-white">
                          {comment.user?.username || "Foydalanuvchi"}
                        </p>
                        <span className="text-xs text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString("uz-UZ")}
                        </span>
                      </div>
                      <p className="text-gray-300">{comment.text}</p>
                    </div>
                  </div>
                      
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-500 text-sm"
                  >
                    ❌
                  </button>
                </div>
              ))}

              {comments.length === 0 && (
                <div className="text-center py-10">
                  <MessageCircle size={48} className="text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Hozircha izohlar yo'q. Birinchi bo'lib izoh qoldiring!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Similar Anime (Faqat 3 ta) */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Shunga o'xshash animelar</h3>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
            
            {similarAnimes.length > 0 ? (
              <div className="space-y-4">
                {similarAnimes.map((anime) => (
                  <a
                    key={anime.id}
                    href={`/anime/${anime.id}`}
                    className="group block"
                  >
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-900/30 to-black/30 hover:from-gray-800/50 hover:to-black/50 transition-all duration-300 border border-white/10">
                      <div className="p-4 flex items-center gap-4">
                        <div className="relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={anime.image.startsWith("http") ? anime.image : `http://localhost:3000/uploads/${anime.image}`}
                            alt={anime.title}
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          {anime.isPaid && (
                            <div className="absolute top-1 right-1 w-6 h-6 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-full flex items-center justify-center">
                              <Star size={10} className="text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-bold text-white truncate group-hover:text-yellow-300 transition-colors">
                              {anime.title}
                            </h4>
                            <Eye size={14} className="text-gray-400 flex-shrink-0 ml-2" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              anime.isPaid 
                                ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30' 
                                : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30'
                            }`}>
                              {anime.isPaid ? "Pullik" : "Tekin"}
                            </span>
                            <span className="text-xs text-gray-400">
                              {anime.views} ko'rish
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-purple-500 rounded-full blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-800/30 to-black/30 rounded-full flex items-center justify-center mb-4">
                  <Play size={24} className="text-gray-500" />
                </div>
                <p className="text-gray-500">Shunga o'xshash animelar topilmadi</p>
              </div>
            )}
          </div>
          
          {/* Stats Card */}
          <div className="bg-gradient-to-br from-purple-900/20 to-amber-900/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Statistika</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Epizodlar</span>
                <span className="text-white font-bold">{episodes.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Status</span>
                <span className={`font-bold ${animeData.isPaid ? 'text-red-400' : 'text-green-400'}`}>
                  {animeData.isPaid ? "Pullik" : "Tekin"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Chiqarilgan</span>
                <span className="text-white font-bold">{animeData.createdAt.slice(0, 4)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Ko'rishlar</span>
                <span className="text-yellow-400 font-bold">{animeData.views}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl"></div>
      </div>
    </main>
  );
}