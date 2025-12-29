"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/src/components/AdminSideber";
import { 
  Film, 
  Upload, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Link as LinkIcon, 
  Type, 
  Video,
  Loader2,
  RefreshCw,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Play
} from "lucide-react";

import {
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  getAllAdvertisements,
  uploadAdvertisementVideo,
} from "@/src/features/api/Reklama";
import { Advertisement, CreateAdvertisementDto } from "@/src/features/types/Reklama";
import { getAllEpisodes } from "@/src/features/api/Episode";
import { Episode } from "@/src/features/types/Episode";
import { Anime } from "@/src/features/types/Anime";
import { getAllAnime } from "@/src/features/api/Anime";

export default function AdminAdvertisementPage() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<"list" | "form">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [selectedAnimeId, setSelectedAnimeId] = useState<string>("");
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [hasVideoFilter, setHasVideoFilter] = useState<"ALL" | "WITH_VIDEO" | "WITHOUT_VIDEO">("ALL");

  // form state
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState("");

  // auth
  const [token, setToken] = useState("");
  

  // edit
  const [editingAd, setEditingAd] = useState<any | null>(null);

  // token faqat browserda
  useEffect(() => {
   // to'g'ri
    const t: string = localStorage.getItem("access_token") || "";
    setToken(t);

    setToken(t);
    if (t) loadAds(t); 
  }, []);

  useEffect(() => {
    const loadAnimes = async () => {
      try {
        const data = await getAllAnime(); // sizning API sorovingiz
        setAnimes(data);
      } catch (e) {
        console.error(e);
        alert("Anime larni yuklashda xato!");
      }
    };
    loadAnimes();
  }, []);

  const loadAds = async (token: string) => {
    try {
      setLoading(true);
      const data = await getAllAdvertisements(token);
      setAds(data);
    } catch (e) {
      console.error("Fetch xato:", e);
      alert("❌ Reklamalarni yuklashda xatolik!");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!selectedAnimeId) {
      setEpisodes([]);
      setSelectedEpisodeId("");
      return;
    }
  
    const loadEpisodes = async () => {
      try {
        const data = await getAllEpisodes(selectedAnimeId); // API sorov, animeId bo‘yicha
        setEpisodes(data);
      } catch (e) {
        console.error(e);
        alert("Episode larni yuklashda xato!");
      }
    };
  
    loadEpisodes();
  }, [selectedAnimeId]);

  // video tanlash
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Video validation (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert("⚠️ Video hajmi 10MB dan oshmasligi kerak!");
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

  // Clear video preview
  const clearVideo = () => {
    setVideoFile(null);
    setVideoPreview("");
    if (videoPreview) URL.revokeObjectURL(videoPreview);
  };

  // edit boshlash
  const startEdit = (ad: any) => {
    setEditingAd(ad);
    setText(ad.text || "");
    setLink(ad.link || "");
    setVideoPreview(ad.video || "");
    setSelectedEpisodeId(ad.episodeId || "")
    setVideoFile(null);
    setActiveTab("form");
  };

  // create + update
  const createAd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Validation
    if (!selectedEpisodeId) {
      return alert("⚠️ Iltimos, episode tanlang!");
    }
    if (!text.trim() && !link.trim() && !videoFile && !videoPreview) {
      return alert("⚠️ Kamida bitta maydon to‘ldirilishi kerak!");
    }
    if (!token) {
      return alert("❌ Token mavjud emas!");
    }
  
    setIsSubmitting(true);
    setUploadProgress(0);
  
    try {
      let videoUrl = "";
  
      if (videoFile) {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 10, 90));
        }, 100);
  
        try {
          const uploaded = await uploadAdvertisementVideo(videoFile, token);
          videoUrl = uploaded.url;
        } finally {
          clearInterval(progressInterval);
          setUploadProgress(100);
        }
      }
  
      const dto: CreateAdvertisementDto = {
        episodeId: selectedEpisodeId,
        text: text.trim() || undefined,
        link: link.trim() || undefined,
        video: videoUrl || undefined,
      };
  
      const savedAd = await createAdvertisement(dto, token);
      setAds(prev => [savedAd, ...prev]);
  
      alert("✅ Reklama qo‘shildi!");
      resetForm();
      setUploadProgress(0);
  
    } catch (err: any) {
      console.error("Reklama yaratishda xato:", err);
      alert(err.message || "❌ Xato yuz berdi!");
    } finally {
      setIsSubmitting(false);
    }
  };  
  

  // delete
  const deleteAd = async (id: string) => {
    if (!token) return alert("⚠️ Token yo'q");

    if (!confirm("⚠️ Rostdan o'chirmoqchimisiz?")) return;

    try {
      await deleteAdvertisement(id, token);
      setAds((prev) => prev.filter((a) => a.id !== id));
      alert("✅ Reklama o'chirildi!");
    } catch (e) {
      console.error(e);
      alert("❌ O'chirishda xato");
    }
  };

  // Reset form
  const resetForm = () => {
    setEditingAd(null);
    setText("");
    setLink("");
    clearVideo();
  };

  // Filtered ads
  const filteredAds = ads.filter(ad => {
    const matchesSearch = 
      ad.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.link?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVideoFilter = 
      hasVideoFilter === "ALL" ||
      (hasVideoFilter === "WITH_VIDEO" && ad.video) ||
      (hasVideoFilter === "WITHOUT_VIDEO" && !ad.video);
    
    return matchesSearch && matchesVideoFilter;
  });

  // Stats
  const stats = {
    total: ads.length,
    withVideo: ads.filter(ad => ad.video).length,
    withoutVideo: ads.filter(ad => !ad.video).length,
    withText: ads.filter(ad => ad.text).length,
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
          📋 Reklamalar
        </button>
        <button
          onClick={() => setActiveTab("form")}
          className={`flex-1 py-2 rounded-md text-center text-sm ${
            activeTab === "form" 
              ? "bg-purple-600/30 text-purple-300" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          {editingAd ? "✏️ Tahrirlash" : "➕ Yangi"}
        </button>
      </div>
    </div>
  );

  /* ================= FORM COMPONENT ================= */
  const FormSection = () => (
    <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-1.5 rounded-lg">
              {editingAd ? (
                <Edit className="text-yellow-400" size={18} />
              ) : (
                <Plus className="text-green-400" size={18} />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {editingAd ? "Reklamani tahrirlash" : "Yangi reklama"}
              </h2>
              <p className="text-xs text-gray-400">
                {editingAd ? "Mavjud reklamani yangilang" : "Yangi reklama yarating"}
              </p>
            </div>
          </div>
        </div>
        {editingAd && (
          <button
            onClick={resetForm}
            className="p-1.5 hover:bg-gray-700/50 rounded-lg"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <form onSubmit={createAd} className="space-y-4">
        {/* Matn */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
            <Type size={14} />
            Reklama matni (ixtiyoriy)
          </label>
          <textarea
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm min-h-[80px]"
            placeholder="Reklama matni..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Link */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
            <LinkIcon size={14} />
            Havola (ixtiyoriy)
          </label>
          <input
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            placeholder="https://example.com"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        {/* Anime tanlash */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
            <Film size={14} />
            Anime tanlang
          </label>
          <select
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            value={selectedAnimeId}
            onChange={(e) => setSelectedAnimeId(e.target.value)}
            required
          >
            <option value="">-- Anime tanlang --</option>
            {animes.map(a => (
              <option key={a.id} value={a.id}>{a.title}</option>
            ))}
          </select>
        </div>
          
        {/* Episode tanlash */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
            <Film size={14} />
            Episode tanlang
          </label>
          <select
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            value={selectedEpisodeId}
            onChange={(e) => setSelectedEpisodeId(e.target.value)}
            required
            disabled={!selectedAnimeId}
          >
            <option value="">-- Episode tanlang --</option>
            {episodes.map(ep => (
              <option key={ep.id} value={ep.id}>{ep.title}</option>
            ))}
          </select>
        </div>
          
        {/* Video Upload */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
            <Video size={14} />
            Video (ixtiyoriy)
          </label>
          
          {videoPreview ? (
            <div className="flex flex-col gap-2">
              <div className="relative">
                <video
                  src={videoPreview}
                  className="w-full h-40 object-cover rounded-lg"
                  controls
                />
                <button
                  type="button"
                  onClick={clearVideo}
                  className="absolute top-2 right-2 bg-red-600 p-1 rounded-full hover:bg-red-700"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <p className="text-xs text-gray-400 text-center">Video tanlandi</p>
            </div>
          ) : (
            <label className="block border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-purple-500">
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleUpload}
              />
              <div className="flex flex-col items-center gap-1">
                <div className="bg-gray-700/50 p-2 rounded-full">
                  <Upload className="text-gray-400" size={20} />
                </div>
                <div>
                  <p className="text-gray-300 text-sm font-medium">Video yuklash</p>
                  <p className="text-xs text-gray-400">MP4, WebM, MOV • maks. 10MB</p>
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
        
        {/* Status message */}
        <div className="p-2 bg-gray-700/30 rounded-lg">
          <p className="text-xs text-gray-400 text-center">
            Kamida bitta maydonni to'ldirishingiz kerak
          </p>
        </div>
        
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
            ) : editingAd ? (
              "💾 Yangilash"
            ) : (
              "➕ Qo'shish"
            )}
          </button>
          
          {editingAd && (
            <button
              type="button"
              onClick={resetForm}
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
            <Film className="text-blue-400" size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold">Barcha reklamalar</h2>
            <p className="text-xs text-gray-400">
              {filteredAds.length} ta • Jami {ads.length} ta
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            if (token) loadAds(token);
            else alert("Token mavjud emas!");
          }}
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
              value={hasVideoFilter}
              onChange={(e) => setHasVideoFilter(e.target.value as "ALL" | "WITH_VIDEO" | "WITHOUT_VIDEO")}
              className="w-full px-2 py-1.5 bg-gray-700/50 border border-gray-600 rounded text-sm"
            >
              <option value="ALL">Barcha reklamalar</option>
              <option value="WITH_VIDEO">Video bor</option>
              <option value="WITHOUT_VIDEO">Video yo'q</option>
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
          <div className="text-lg font-bold">{stats.withVideo}</div>
          <div className="text-xs text-gray-400">Video bor</div>
        </div>
        <div className="bg-gray-700/30 rounded p-2 text-center">
          <div className="text-lg font-bold">{stats.withoutVideo}</div>
          <div className="text-xs text-gray-400">Video yo'q</div>
        </div>
        <div className="bg-gray-700/30 rounded p-2 text-center">
          <div className="text-lg font-bold">{stats.withText}</div>
          <div className="text-xs text-gray-400">Matn bor</div>
        </div>
      </div>

      {/* Ads List */}
      {loading ? (
        <div className="text-center py-8">
          <Loader2 className="animate-spin mx-auto mb-2" size={24} />
          <p className="text-sm text-gray-400">Reklamalar yuklanmoqda...</p>
        </div>
      ) : filteredAds.length === 0 ? (
        <div className="text-center py-8">
          <Film className="mx-auto mb-2 text-gray-500" size={32} />
          <p className="text-gray-400 text-sm">
            {searchTerm || hasVideoFilter !== "ALL" 
              ? "Qidiruv bo'yicha reklama topilmadi" 
              : "Hozircha reklamalar mavjud emas"}
          </p>
          {(searchTerm || hasVideoFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setHasVideoFilter("ALL");
                setShowFilters(false);
              }}
              className="text-purple-400 hover:text-purple-300 text-xs mt-2"
            >
              Filterni tozalash
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {filteredAds.map((ad) => (
            <div
              key={ad.id}
              className="bg-gray-700/30 rounded-lg border border-gray-600/30 hover:bg-gray-700/50 overflow-hidden"
            >
              {ad.video && (
                <div className="relative">
                  <video
                    src={ad.video}
                    className="w-full h-40 object-cover"
                    controls
                  />
                  <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs flex items-center gap-1">
                    <Play size={10} />
                    Video
                  </div>
                </div>
              )}
              
              <div className="p-3">
                {ad.text && (
                  <div className="mb-2">
                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                      <Type size={12} />
                      <span>Matn:</span>
                    </div>
                    <p className="text-sm line-clamp-2">{ad.text}</p>
                  </div>
                )}
                
                {ad.link && (
                  <div className="mb-3">
                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                      <LinkIcon size={12} />
                      <span>Havola:</span>
                    </div>
                    <a
                      href={ad.link}
                      target="_blank"
                      className="text-blue-400 hover:text-blue-300 text-sm truncate flex items-center gap-1"
                    >
                      {ad.link.replace(/^https?:\/\//, '').slice(0, 30)}...
                      <Eye size={12} />
                    </a>
                  </div>
                )}

                {/* Meta info */}
                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{new Date(ad.createdAt).toLocaleDateString('uz-UZ')}</span>
                  </div>
                  <div className="text-xs bg-gray-600/50 px-2 py-1 rounded">
                    ID: {ad.id.slice(0, 6)}...
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1">
                  <button
                    onClick={() => startEdit(ad)}
                    className="flex-1 flex items-center justify-center gap-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 py-1.5 rounded text-xs"
                  >
                    <Edit size={12} />
                    Tahrir
                  </button>

                  <button
                    onClick={() => deleteAd(ad.id)}
                    className="flex-1 flex items-center justify-center gap-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 py-1.5 rounded text-xs"
                  >
                    <Trash2 size={12} />
                    O'chir
                  </button>
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
            <p className="text-gray-400 text-sm">Jami Reklamalar</p>
            <p className="text-xl font-bold mt-1">{stats.total}</p>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
            <Film size={18} className="text-white" />
          </div>
        </div>
      </div>
      <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Video bor</p>
            <p className="text-xl font-bold mt-1">{stats.withVideo}</p>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
            <Video size={18} className="text-white" />
          </div>
        </div>
      </div>
      <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Video yo'q</p>
            <p className="text-xl font-bold mt-1">{stats.withoutVideo}</p>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-500">
            <XCircle size={18} className="text-white" />
          </div>
        </div>
      </div>
      <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Matn bor</p>
            <p className="text-xl font-bold mt-1">{stats.withText}</p>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
            <Type size={18} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 md:ml-64 pt-16 md:pt-0">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-2 rounded-lg">
                <Film className="text-purple-400" size={20} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Reklama Boshqaruvi
                </h1>
                <p className="text-gray-400 text-sm">
                  Reklamalarni qo'shish va tahrirlash
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