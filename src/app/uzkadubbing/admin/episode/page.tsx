"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Plus, 
  Upload, 
  Play, 
  Hash, 
  Film, 
  Edit, 
  Trash2, 
  Eye,
  X,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Calendar,
  Clock,
  Check,
  XCircle,
  Loader2,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import Sidebar from "@/src/components/AdminSideber";
import { Episode } from "@/src/features/types/Episode";
import { Anime } from "@/src/features/types/Anime";
import {
  createEpisodeApi,
  deleteEpisodeApi,
  getAllEpisodes,
  updateEpisodeApi,
  uploadEpisodeVideo,
} from "@/src/features/api/Episode";
import { getAllAnime } from "@/src/features/api/Anime";

export default function AdminEpisodePage() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<"list" | "form">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [animeFilter, setAnimeFilter] = useState<string>("ALL");
  const [showFilters, setShowFilters] = useState(false);

  // FORM STATE
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [title, setTitle] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState<number | "">(1);
  const [animeId, setAnimeId] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [eps, anime] = await Promise.all([getAllEpisodes(), getAllAnime()]);
      setEpisodes(eps);
      setAnimeList(anime);
    } catch (err) {
      console.error(err);
      alert("❌ Ma'lumotlarni yuklashda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Video validation (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      alert("⚠️ Video hajmi 50MB dan oshmasligi kerak!");
      return;
    }

    // Video type validation
    if (!file.type.startsWith('video/')) {
      alert("⚠️ Faqat video fayllari qabul qilinadi!");
      return;
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const clearVideo = () => {
    setVideoFile(null);
    setVideoPreview("");
    if (videoPreview) URL.revokeObjectURL(videoPreview);
  };

  // 🔹 CREATE / UPDATE
  const saveEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      alert("⚠️ Episode nomini kiriting!");
      return;
    }
    if (!episodeNumber || episodeNumber < 1) {
      alert("⚠️ To'g'ri episode raqamini kiriting!");
      return;
    }
    if (!animeId) {
      alert("⚠️ Anime tanlang!");
      return;
    }
    if (!videoFile && !editingEpisode) {
      alert("⚠️ Video faylni tanlang!");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      let videoUrl = editingEpisode?.videoUrl || "";
      if (videoFile) {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 100);

        try {
          videoUrl = await uploadEpisodeVideo(videoFile);
        } finally {
          clearInterval(progressInterval);
          setUploadProgress(100);
        }
      }

      const dto = { 
        title: title.trim(), 
        episodeNumber: Number(episodeNumber), 
        animeId, 
        videoUrl 
      };
      
      let savedEpisode: Episode;

      if (editingEpisode) {
        // Update
        savedEpisode = await updateEpisodeApi(editingEpisode.id, dto);
        setEpisodes((prev) =>
          prev.map((e) => (e.id === savedEpisode.id ? savedEpisode : e))
        );
        alert("✅ Episode yangilandi!");
      } else {
        // Create
        savedEpisode = await createEpisodeApi(dto);
        setEpisodes((prev) => [savedEpisode, ...prev]);
        alert("✅ Episode qo'shildi!");
      }

      resetForm();
      setUploadProgress(0);
      
      // Mobile uchun avtomatik ro'yxatga o'tish
      if (window.innerWidth < 1024) {
        setActiveTab("list");
      }
    } catch (err: any) {
      alert(err.message || "❌ Xatolik yuz berdi!");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (episode: Episode) => {
    setEditingEpisode(episode);
    setTitle(episode.title);
    setEpisodeNumber(episode.episodeNumber);
    setAnimeId(episode.animeId);
    setVideoPreview(episode.videoUrl);
    setVideoFile(null);
    setActiveTab("form");
  };

  const resetForm = () => {
    setEditingEpisode(null);
    setTitle("");
    setEpisodeNumber(1);
    setAnimeId("");
    clearVideo();
  };

  const handleDeleteEpisode = async (id: string) => {
    if (!confirm("⚠️ Rostdan ham o'chirmoqchimisiz?")) return;
    try {
      await deleteEpisodeApi(id);
      setEpisodes((prev) => prev.filter((e) => e.id !== id));
      alert("✅ Episode o'chirildi!");
    } catch (err) {
      console.error(err);
      alert("❌ Server xatosi!");
    }
  };

  const getAnimeTitle = (animeId: string) => {
    const anime = animeList.find((a) => a.id === animeId);
    return anime ? anime.title : "Noma'lum Anime";
  };

  /* ================= FILTERED EPISODES ================= */
  const filteredEpisodes = episodes.filter(episode => {
    const matchesSearch = 
      episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getAnimeTitle(episode.animeId).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAnime = 
      animeFilter === "ALL" || 
      episode.animeId === animeFilter;
    
    return matchesSearch && matchesAnime;
  });

  /* ================= STATS ================= */
  const stats = {
    total: episodes.length,
    byAnime: animeList.map(anime => ({
      name: anime.title,
      count: episodes.filter(ep => ep.animeId === anime.id).length
    })),
    latest: episodes.length > 0 ? new Date(episodes[0].createdAt).toLocaleDateString('uz-UZ') : "Yo'q"
  };

  /* ================= MOBILE NAVIGATION ================= */
  const MobileNav = () => (
    <div className="lg:hidden mb-4">
      <div className="flex bg-gray-800/50 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("list")}
          className={`flex-1 py-2 rounded-md text-center text-sm ${
            activeTab === "list" 
              ? "bg-purple-600/30 text-purple-300" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          📺 Epizodlar
        </button>
        <button
          onClick={() => setActiveTab("form")}
          className={`flex-1 py-2 rounded-md text-center text-sm ${
            activeTab === "form" 
              ? "bg-purple-600/30 text-purple-300" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          {editingEpisode ? "✏️ Tahrirlash" : "➕ Yangi"}
        </button>
      </div>
    </div>
  );

  /* ================= FORM COMPONENT ================= */
  const FormSection = () => (
    <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {window.innerWidth < 1024 && (
            <button
              onClick={() => setActiveTab("list")}
              className="p-1.5 hover:bg-gray-700/50 rounded-lg"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-1.5 rounded-lg">
              {editingEpisode ? (
                <Edit className="text-yellow-400" size={18} />
              ) : (
                <Plus className="text-green-400" size={18} />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {editingEpisode ? "Epizod tahrirlash" : "Yangi epizod"}
              </h2>
              <p className="text-xs text-gray-400">
                {editingEpisode ? "Mavjud epizodni yangilang" : "Yangi epizod yarating"}
              </p>
            </div>
          </div>
        </div>
        {editingEpisode && (
          <button
            onClick={resetForm}
            className="p-1.5 hover:bg-gray-700/50 rounded-lg"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <form onSubmit={saveEpisode} className="space-y-4">
        {/* Episode nomi */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Episode nomi</label>
          <input
            type="text"
            placeholder="Masalan: Qahramonlar jangi"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            required
          />
        </div>

        {/* Episode raqami */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Episode raqami</label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="number"
              value={episodeNumber}
              onChange={(e) => setEpisodeNumber(e.target.value ? Number(e.target.value) : "")}
              min={1}
              className="w-full pl-9 pr-3 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              placeholder="1"
              required
            />
          </div>
        </div>

        {/* Anime tanlash */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Anime tanlash</label>
          <select
            value={animeId}
            onChange={(e) => setAnimeId(e.target.value)}
            className="w-full px-3 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            required
          >
            <option value="">Anime tanlang</option>
            {animeList.map((anime) => (
              <option key={anime.id} value={anime.id}>
                {anime.title}
              </option>
            ))}
          </select>
        </div>

        {/* Video yuklash */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Video yuklash</label>
          
          {videoPreview ? (
            <div className="flex flex-col gap-2">
              <div className="relative">
                <video
                  src={videoPreview}
                  controls
                  className="w-full h-40 object-cover rounded-lg bg-black"
                />
                <button
                  type="button"
                  onClick={clearVideo}
                  className="absolute top-2 right-2 bg-red-600 p-1 rounded-full hover:bg-red-700"
                >
                  <X size={12} />
                </button>
              </div>
              <p className="text-xs text-gray-400 text-center">Video tanlandi</p>
            </div>
          ) : (
            <label className="block border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-purple-500">
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-1">
                <div className="bg-gray-700/50 p-2 rounded-full">
                  <Upload className="text-gray-400" size={20} />
                </div>
                <div>
                  <p className="text-gray-300 text-sm font-medium">Video yuklash</p>
                  <p className="text-xs text-gray-400">MP4, WebM, MOV • maks. 50MB</p>
                </div>
              </div>
            </label>
          )}

          {/* Upload progress */}
          {uploadProgress > 0 && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-300 mb-1">
                <span>Yuklanmoqda...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Selected anime info */}
        {animeId && (
          <div className="p-2 bg-gray-700/30 rounded-lg">
            <p className="text-xs text-gray-300">
              Tanlangan anime: <span className="font-medium">{getAnimeTitle(animeId)}</span>
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-2.5 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 text-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Saqlanmoqda...
              </>
            ) : editingEpisode ? (
              "💾 Yangilash"
            ) : (
              "➕ Qo'shish"
            )}
          </button>

          {(editingEpisode || window.innerWidth < 1024) && (
            <button
              type="button"
              onClick={() => {
                resetForm();
                if (window.innerWidth < 1024) setActiveTab("list");
              }}
              className="px-4 py-2.5 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-sm"
            >
              Bekor qilish
            </button>
          )}
        </div>
      </form>
    </div>
  );

  /* ================= LIST COMPONENT ================= */
  const ListSection = () => (
    <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-1.5 rounded-lg">
            <Play className="text-blue-400" size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold">Barcha epizodlar</h2>
            <p className="text-xs text-gray-400">
              {filteredEpisodes.length} ta • Jami {episodes.length} ta
            </p>
          </div>
        </div>
        <button
          onClick={loadData}
          className="p-1.5 bg-gray-700/50 hover:bg-gray-700 rounded-lg"
          title="Yangilash"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-4 space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Qidirish..."
            className="w-full pl-9 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-between w-full px-3 py-2 bg-gray-700/50 rounded-lg text-sm"
        >
          <div className="flex items-center gap-2">
            <Filter size={14} />
            <span>Filtrlar</span>
          </div>
          {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showFilters && (
          <div className="p-3 bg-gray-700/30 rounded-lg">
            <select
              value={animeFilter}
              onChange={(e) => setAnimeFilter(e.target.value)}
              className="w-full px-2 py-1.5 bg-gray-700/50 border border-gray-600 rounded text-sm"
            >
              <option value="ALL">Barcha animelar</option>
              {animeList.map((anime) => (
                <option key={anime.id} value={anime.id}>{anime.title}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Stats Cards (Mobile) */}
      <div className="lg:hidden grid grid-cols-2 gap-2 mb-4">
        <div className="bg-gray-700/30 rounded p-2 text-center">
          <div className="text-lg font-bold">{stats.total}</div>
          <div className="text-xs text-gray-400">Jami</div>
        </div>
        <div className="bg-gray-700/30 rounded p-2 text-center">
          <div className="text-lg font-bold">{stats.byAnime.reduce((sum, item) => sum + item.count, 0)}</div>
          <div className="text-xs text-gray-400">Anime</div>
        </div>
        <div className="bg-gray-700/30 rounded p-2 text-center">
          <div className="text-lg font-bold">{animeList.length}</div>
          <div className="text-xs text-gray-400">Kategoriya</div>
        </div>
        <div className="bg-gray-700/30 rounded p-2 text-center">
          <div className="text-xs truncate">{stats.latest}</div>
          <div className="text-xs text-gray-400">Oxirgi qo'shilgan</div>
        </div>
      </div>

      {/* Episodes List */}
      {loading ? (
        <div className="text-center py-8">
          <Loader2 className="animate-spin mx-auto mb-2" size={24} />
          <p className="text-sm text-gray-400">Epizodlar yuklanmoqda...</p>
        </div>
      ) : filteredEpisodes.length === 0 ? (
        <div className="text-center py-8">
          <Film className="mx-auto mb-2 text-gray-500" size={32} />
          <p className="text-gray-400 text-sm">
            {searchTerm || animeFilter !== "ALL" 
              ? "Qidiruv bo'yicha epizod topilmadi" 
              : "Hozircha epizodlar mavjud emas"}
          </p>
          {(searchTerm || animeFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setAnimeFilter("ALL");
                setShowFilters(false);
              }}
              className="text-purple-400 hover:text-purple-300 text-xs mt-2"
            >
              Filterni tozalash
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {filteredEpisodes.map((episode) => (
            <div
              key={episode.id}
              className="bg-gray-700/30 rounded-lg border border-gray-600/30 hover:bg-gray-700/50 overflow-hidden"
            >
              <div className="flex gap-3 p-3">
                {/* Video thumbnail */}
                <div className="relative flex-shrink-0">
                  <video
                    src={episode.videoUrl}
                    className="w-20 h-14 object-cover rounded bg-black"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/70 px-1 py-0.5 rounded text-xs">
                    <Play size={8} />
                  </div>
                </div>

                {/* Episode info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm truncate">{episode.title}</h3>
                      <p className="text-gray-400 text-xs truncate">{getAnimeTitle(episode.animeId)}</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0 ml-2">
                      <span className="px-1.5 py-0.5 rounded-full text-xs bg-purple-500/20 text-purple-300">
                        #{episode.episodeNumber}
                      </span>
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar size={10} />
                      <span>{new Date(episode.createdAt).toLocaleDateString('uz-UZ')}</span>
                    </div>
                    <span className="text-gray-500">•</span>
                    <div className="text-xs bg-gray-600/50 px-2 py-0.5 rounded">
                      ID: {episode.id.slice(0, 6)}...
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEdit(episode)}
                      className="flex-1 flex items-center justify-center gap-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 py-1.5 rounded text-xs"
                    >
                      <Edit size={12} />
                      Tahrir
                    </button>

                    <button
                      onClick={() => handleDeleteEpisode(episode.id)}
                      className="flex-1 flex items-center justify-center gap-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 py-1.5 rounded text-xs"
                    >
                      <Trash2 size={12} />
                      O'chir
                    </button>

                    <Link
                      href={`/admin/episode/${episode.id}`}
                      className="flex-1 flex items-center justify-center gap-1 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 py-1.5 rounded text-xs"
                    >
                      <Eye size={12} />
                      Ko'rish
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  /* ================= STATS GRID (DESKTOP) ================= */
  const StatsGrid = () => (
    <div className="hidden lg:grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
      <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Jami Epizodlar</p>
            <p className="text-xl font-bold mt-1">{stats.total}</p>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
            <Play size={18} className="text-white" />
          </div>
        </div>
      </div>
      <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Animelar soni</p>
            <p className="text-xl font-bold mt-1">{animeList.length}</p>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
            <Film size={18} className="text-white" />
          </div>
        </div>
      </div>
      <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">O'rtacha epizod</p>
            <p className="text-xl font-bold mt-1">
              {animeList.length > 0 ? Math.round(stats.total / animeList.length) : 0}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500">
            <Hash size={18} className="text-white" />
          </div>
        </div>
      </div>
      <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Oxirgi qo'shilgan</p>
            <p className="text-sm font-bold mt-1">{stats.latest}</p>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
            <Calendar size={18} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-2 rounded-lg">
                <Play className="text-purple-400" size={20} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Epizodlar Boshqaruvi
                </h1>
                <p className="text-gray-400 text-sm">
                  Anime epizodlarini boshqaring va yangilarini qo'shing
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <MobileNav />

          {/* Desktop Stats */}
          <StatsGrid />

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-6">
            <div>
              <FormSection />
            </div>
            <div className="lg:col-span-2">
              <ListSection />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden">
            {activeTab === "form" ? <FormSection /> : <ListSection />}
          </div>
        </div>
      </div>
    </div>
  );
}