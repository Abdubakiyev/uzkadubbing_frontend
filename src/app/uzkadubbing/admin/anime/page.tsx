"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/src/components/AdminSideber";
import { 
  Film, 
  Upload, 
  DollarSign, 
  Plus, 
  Pencil, 
  X, 
  Image as ImageIcon,
  Link as LinkIcon,
  Hash,
  Eye,
  Trash2,
  Loader2,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  RefreshCw,
  Search,
  Filter,
  ArrowLeft,
  Tag,
  Video,
  Globe,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { Anime } from "@/src/features/types/Anime";
import {
  createAnimeApi,
  deleteAnimeApi,
  getAllAnime,
  uploadAnimeImage,
  updateAnimeApi,
} from "@/src/features/api/Anime";

export default function AdminAnimePage() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<"list" | "form">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PAID" | "FREE">("ALL");
  const [showFilters, setShowFilters] = useState(false);

  // 🔹 EDIT STATE
  const [editingAnime, setEditingAnime] = useState<Anime | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");

  // Slug avtomatik
  useEffect(() => {
    if (!editingAnime && title) {
      const generatedSlug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/--+/g, "-");
      setSlug(generatedSlug);
    }
  }, [title, editingAnime]);

  useEffect(() => {
    loadAnime();
  }, []);

  const loadAnime = async () => {
    try {
      setLoading(true);
      const data = await getAllAnime();
      setAnimeList(data);
    } catch (err) {
      console.error("Yuklash xatosi:", err);
      alert("❌ Anime yuklashda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Image validation (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert("⚠️ Rasm hajmi 2MB dan oshmasligi kerak!");
      return;
    }

    // Image type validation
    if (!file.type.startsWith('image/')) {
      alert("⚠️ Faqat rasm fayllari qabul qilinadi!");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (imagePreview) URL.revokeObjectURL(imagePreview);
  };

  // 🔹 CREATE / UPDATE
  const saveAnime = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      alert("⚠️ Anime nomini kiriting!");
      return;
    }
    if (!slug.trim()) {
      alert("⚠️ Slug kiriting!");
      return;
    }
    if (!slug.match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)) {
      alert("⚠️ Slug faqat kichik harflar, raqamlar va tire (-) dan iborat bo'lishi kerak!");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      let imageUrl = editingAnime?.image || "";

      if (imageFile) {
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
          imageUrl = await uploadAnimeImage(imageFile);
        } finally {
          clearInterval(progressInterval);
          setUploadProgress(100);
        }
      }

      const dto = {
        title: title.trim(),
        slug: slug.trim(),
        image: imageUrl,
        isPaid,
        url: videoUrl.trim() || undefined,
      };

      let savedAnime: Anime;

      if (editingAnime) {
        // ✏️ UPDATE
        savedAnime = await updateAnimeApi(editingAnime.id, dto);
        setAnimeList((prev) =>
          prev.map((a) => (a.id === savedAnime.id ? savedAnime : a))
        );
        alert("✅ Anime yangilandi!");
      } else {
        // ➕ CREATE
        savedAnime = await createAnimeApi(dto);
        setAnimeList((prev) => [savedAnime, ...prev]);
        alert("✅ Anime qo'shildi!");
      }

      resetForm();
      setUploadProgress(0);
      
      // Mobile uchun avtomatik ro'yxatga o'tish
      if (window.innerWidth < 1024) {
        setActiveTab("list");
      }
    } catch (err: any) {
      console.error("Saqlash xatosi:", err);
      alert(err.message || "❌ Xatolik yuz berdi!");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const startEdit = (anime: Anime) => {
    setEditingAnime(anime);
    setTitle(anime.title);
    setSlug(anime.slug);
    setIsPaid(anime.isPaid);
    setVideoUrl(anime.url || "");
    setImagePreview(anime.image);
    setImageFile(null);
    setActiveTab("form");
  };

  const resetForm = () => {
    setEditingAnime(null);
    setTitle("");
    setSlug("");
    setIsPaid(false);
    setVideoUrl("");
    clearImage();
  };

  const deleteAnime = async (id: string) => {
    if (!confirm("⚠️ Rostdan ham o'chirmoqchimisiz?")) return;

    try {
      await deleteAnimeApi(id);
      setAnimeList((prev) => prev.filter((a) => a.id !== id));
      alert("✅ Anime o'chirildi!");
    } catch {
      alert("❌ O'chirishda xatolik!");
    }
  };

  /* ================= FILTERED ANIME ================= */
  const filteredAnime = animeList.filter(anime => {
    const matchesSearch = 
      anime.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      anime.slug.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "ALL" || 
      (statusFilter === "PAID" && anime.isPaid) ||
      (statusFilter === "FREE" && !anime.isPaid);
    
    return matchesSearch && matchesStatus;
  });

  /* ================= STATS ================= */
  const stats = {
    total: animeList.length,
    paid: animeList.filter(a => a.isPaid).length,
    free: animeList.filter(a => !a.isPaid).length,
    withVideo: animeList.filter(a => a.url).length,
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
          🎬 Anime
        </button>
        <button
          onClick={() => setActiveTab("form")}
          className={`flex-1 py-2 rounded-md text-center text-sm ${
            activeTab === "form" 
              ? "bg-purple-600/30 text-purple-300" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          {editingAnime ? "✏️ Tahrirlash" : "➕ Yangi"}
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
              {editingAnime ? (
                <Pencil className="text-yellow-400" size={18} />
              ) : (
                <Plus className="text-green-400" size={18} />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {editingAnime ? "Anime tahrirlash" : "Yangi anime"}
              </h2>
              <p className="text-xs text-gray-400">
                {editingAnime ? "Mavjud animeni yangilang" : "Yangi anime yarating"}
              </p>
            </div>
          </div>
        </div>
        {editingAnime && (
          <button
            onClick={resetForm}
            className="p-1.5 hover:bg-gray-700/50 rounded-lg"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <form onSubmit={saveAnime} className="space-y-4">
        {/* Anime nomi */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            <Tag size={14} className="inline mr-1" />
            Anime nomi
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Masalan: Naruto Shippuden"
            className="w-full px-3 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            <Hash size={14} className="inline mr-1" />
            Slug (URL manzil)
          </label>
          <div className="flex gap-1">
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="naruto-shippuden"
              className="flex-1 px-3 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              required
            />
            <button
              type="button"
              onClick={() => {
                if (title) {
                  const generatedSlug = title
                    .toLowerCase()
                    .trim()
                    .replace(/[^\w\s-]/g, "")
                    .replace(/\s+/g, "-")
                    .replace(/--+/g, "-");
                  setSlug(generatedSlug);
                }
              }}
              className="px-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-xs"
            >
              Auto
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Slug faqat kichik harflar, raqamlar va tire (-) dan iborat bo'lishi kerak
          </p>
        </div>

        {/* Video URL */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            <Video size={14} className="inline mr-1" />
            Video URL (ixtiyoriy)
          </label>
          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://example.com/video.mp4"
            className="w-full px-3 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
        </div>

        {/* Pullik / Bepul */}
        <div className="p-3 bg-gray-700/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded ${isPaid ? 'bg-yellow-500/20' : 'bg-green-500/20'}`}>
                <DollarSign size={16} className={isPaid ? 'text-yellow-400' : 'text-green-400'} />
              </div>
              <div>
                <p className="font-medium text-sm">Holat</p>
                <p className="text-xs text-gray-400">
                  {isPaid ? "Pullik anime" : "Bepul anime"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPaid(!isPaid)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                isPaid ? 'bg-yellow-500' : 'bg-green-500'
              }`}
            >
              <span
                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                  isPaid ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Rasm yuklash */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            <ImageIcon size={14} className="inline mr-1" />
            Rasm
          </label>
          
          {imagePreview ? (
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Rasm preview"
                  className="w-32 h-32 object-cover rounded-lg border-2 border-purple-500"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute -top-1 -right-1 bg-red-600 p-1 rounded-full"
                >
                  <X size={12} />
                </button>
              </div>
              <p className="text-xs text-gray-400">Rasm tanlandi</p>
            </div>
          ) : (
            <label className="block border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-purple-500">
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-1">
                <div className="bg-gray-700/50 p-2 rounded-full">
                  <Upload className="text-gray-400" size={20} />
                </div>
                <div>
                  <p className="text-gray-300 text-sm font-medium">Rasm yuklash</p>
                  <p className="text-xs text-gray-400">PNG, JPG, GIF • maks. 2MB</p>
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
            ) : editingAnime ? (
              "💾 Yangilash"
            ) : (
              "➕ Qo'shish"
            )}
          </button>

          {(editingAnime || window.innerWidth < 1024) && (
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
            <Film className="text-blue-400" size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold">Barcha animelar</h2>
            <p className="text-xs text-gray-400">
              {filteredAnime.length} ta • Jami {animeList.length} ta
            </p>
          </div>
        </div>
        <button
          onClick={loadAnime}
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "ALL" | "PAID" | "FREE")}
              className="w-full px-2 py-1.5 bg-gray-700/50 border border-gray-600 rounded text-sm"
            >
              <option value="ALL">Barcha holat</option>
              <option value="FREE">Bepul</option>
              <option value="PAID">Pullik</option>
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
          <div className="text-lg font-bold">{stats.free}</div>
          <div className="text-xs text-gray-400">Bepul</div>
        </div>
        <div className="bg-gray-700/30 rounded p-2 text-center">
          <div className="text-lg font-bold">{stats.paid}</div>
          <div className="text-xs text-gray-400">Pullik</div>
        </div>
        <div className="bg-gray-700/30 rounded p-2 text-center">
          <div className="text-lg font-bold">{stats.withVideo}</div>
          <div className="text-xs text-gray-400">Video bor</div>
        </div>
      </div>

      {/* Anime List */}
      {loading ? (
        <div className="text-center py-8">
          <Loader2 className="animate-spin mx-auto mb-2" size={24} />
          <p className="text-sm text-gray-400">Animelar yuklanmoqda...</p>
        </div>
      ) : filteredAnime.length === 0 ? (
        <div className="text-center py-8">
          <Film className="mx-auto mb-2 text-gray-500" size={32} />
          <p className="text-gray-400 text-sm">
            {searchTerm || statusFilter !== "ALL" 
              ? "Qidiruv bo'yicha anime topilmadi" 
              : "Hozircha animelar mavjud emas"}
          </p>
          {(searchTerm || statusFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("ALL");
                setShowFilters(false);
              }}
              className="text-purple-400 hover:text-purple-300 text-xs mt-2"
            >
              Filterni tozalash
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-1">
          {filteredAnime.map((anime) => (
            <div
              key={anime.id}
              className="bg-gray-700/30 rounded-lg border border-gray-600/30 hover:bg-gray-700/50 overflow-hidden group"
            >
              <div className="relative">
                <img
                  src={anime.image}
                  alt={anime.title}
                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    anime.isPaid 
                      ? 'bg-yellow-500/80 text-yellow-100' 
                      : 'bg-green-500/80 text-green-100'
                  }`}>
                    {anime.isPaid ? "💰" : "🆓"}
                  </span>
                  {anime.url && (
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-500/80 text-blue-100">
                      📹
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3">
                <div className="mb-2">
                  <h3 className="font-bold text-sm truncate mb-1">{anime.title}</h3>
                  <p className="text-gray-400 text-xs truncate">{anime.slug}</p>
                </div>

                {/* Meta info */}
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar size={10} />
                    <span>{new Date(anime.createdAt).toLocaleDateString('uz-UZ')}</span>
                  </div>
                  <div className="text-xs bg-gray-600/50 px-2 py-0.5 rounded">
                    ID: {anime.id.slice(0, 6)}...
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1">
                  <button
                    onClick={() => startEdit(anime)}
                    className="flex-1 flex items-center justify-center gap-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 py-1.5 rounded text-xs"
                  >
                    <Pencil size={12} />
                    Tahrir
                  </button>

                  <button
                    onClick={() => deleteAnime(anime.id)}
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
            <p className="text-gray-400 text-sm">Jami Anime</p>
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
            <p className="text-gray-400 text-sm">Bepul Anime</p>
            <p className="text-xl font-bold mt-1">{stats.free}</p>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
            <CheckCircle size={18} className="text-white" />
          </div>
        </div>
      </div>
      <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Pullik Anime</p>
            <p className="text-xl font-bold mt-1">{stats.paid}</p>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500">
            <DollarSign size={18} className="text-white" />
          </div>
        </div>
      </div>
      <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Video Mavjud</p>
            <p className="text-xl font-bold mt-1">{stats.withVideo}</p>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
            <Video size={18} className="text-white" />
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
                <Film className="text-purple-400" size={20} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Anime Boshqaruvi
                </h1>
                <p className="text-gray-400 text-sm">
                  Anime qo'shing, tahrirlang va boshqaring
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