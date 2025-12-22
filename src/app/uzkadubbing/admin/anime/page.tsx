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
  Trash2,
  X,
  Check,
  Loader2,
  Image as ImageIcon,
  Video,
  Globe,
  Eye,
  Calendar,
  Clock
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
  const [searchQuery, setSearchQuery] = useState("");
  
  // 🔹 EDIT STATE
  const [editingAnime, setEditingAnime] = useState<Anime | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [description, setDescription] = useState("");

  // Filtered anime list
  const filteredAnime = animeList.filter(anime =>
    anime.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    anime.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Slug avtomatik
  useEffect(() => {
    if (!editingAnime) {
      setSlug(
        title
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, "-")
      );
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Faqat rasm fayllari yuklanishi mumkin');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Rasm hajmi 5MB dan oshmasligi kerak');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // 🔹 CREATE / UPDATE
  const saveAnime = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = editingAnime?.image || "";

      if (imageFile) {
        imageUrl = await uploadAnimeImage(imageFile);
      }

      const dto = {
        title,
        slug,
        image: imageUrl,
        isPaid,
        url: videoUrl,
        description: description || "",
      };

      let savedAnime: Anime;

      if (editingAnime) {
        // ✏️ UPDATE
        savedAnime = await updateAnimeApi(editingAnime.id, dto);
        setAnimeList((prev) =>
          prev.map((a) => (a.id === savedAnime.id ? savedAnime : a))
        );
      } else {
        // ➕ CREATE
        savedAnime = await createAnimeApi(dto);
        setAnimeList((prev) => [savedAnime, ...prev]);
      }

      resetForm();
      alert(
        editingAnime 
          ? "✅ Anime muvaffaqiyatli yangilandi!" 
          : "✅ Anime muvaffaqiyatli qo'shildi!"
      );
    } catch (err: any) {
      alert(err.message || "❌ Xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
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
    // Scroll to form on mobile
    if (window.innerWidth < 1024) {
      document.getElementById('anime-form')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const resetForm = () => {
    setEditingAnime(null);
    setTitle("");
    setSlug("");
    setIsPaid(false);
    setVideoUrl("");
    setImageFile(null);
    setImagePreview("");
    setDescription("");
  };

  const deleteAnime = async (id: string) => {
    if (!confirm("Rostdan ham bu animeni o'chirmoqchimisiz?")) return;

    try {
      await deleteAnimeApi(id);
      setAnimeList((prev) => prev.filter((a) => a.id !== id));
      alert("✅ Anime o'chirildi");
    } catch {
      alert("❌ O'chirishda xatolik");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Sidebar />

      <div className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 md:mb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg">
                  <Film className="text-white" size={28} />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Anime Boshqaruvi
                  </h1>
                  <p className="text-gray-400 text-sm mt-1">
                    Animelarni boshqaring va tahrirlang
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="relative flex-1 md:w-64">
                  <input
                    type="text"
                    placeholder="Anime qidirish..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Eye size={18} className="text-gray-400" />
                  </div>
                </div>
                <div className="text-sm text-gray-400 px-3 py-2 bg-gray-800/50 rounded-lg">
                  {filteredAnime.length} ta
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900/50 p-4 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Jami Anime</p>
                    <p className="text-2xl font-bold mt-1">{animeList.length}</p>
                  </div>
                  <Film className="text-purple-400" size={24} />
                </div>
              </div>
              <div className="bg-gradient-to-r from-gray-800 to-gray-900/50 p-4 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Pullik Anime</p>
                    <p className="text-2xl font-bold mt-1">
                      {animeList.filter(a => a.isPaid).length}
                    </p>
                  </div>
                  <DollarSign className="text-green-400" size={24} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* FORM CARD */}
            <div className="lg:col-span-1" id="anime-form">
              <div className="sticky top-6">
                <div className="bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-gray-700/50 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      {editingAnime ? (
                        <>
                          <Pencil className="text-yellow-400" size={22} />
                          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                            Anime Tahrirlash
                          </span>
                        </>
                      ) : (
                        <>
                          <Plus className="text-green-400" size={22} />
                          <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                            Yangi Anime
                          </span>
                        </>
                      )}
                    </h2>
                    {editingAnime && (
                      <button
                        onClick={resetForm}
                        className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                        title="Bekor qilish"
                      >
                        <X size={18} className="text-gray-400" />
                      </button>
                    )}
                  </div>

                  <form onSubmit={saveAnime} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Anime nomi *
                      </label>
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Masalan: Naruto Shippuden"
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Slug *
                      </label>
                      <input
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="naruto-shippuden"
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tavsif
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Anime haqida qisqacha tavsif..."
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Video URL
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <Video size={18} className="text-gray-400" />
                        </div>
                        <input
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          placeholder="https://example.com/video.mp4"
                          className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Rasm yuklash
                      </label>
                      <div className="space-y-4">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer bg-gray-900/30 hover:bg-gray-800/50 transition-colors group">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-3 text-gray-400 group-hover:text-purple-400 transition-colors" />
                            <p className="mb-1 text-sm text-gray-400 group-hover:text-gray-300">
                              <span className="font-semibold">Rasm tanlang</span>
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, WEBP (max 5MB)</p>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleUpload}
                            className="hidden"
                          />
                        </label>
                        
                        {imagePreview && (
                          <div className="relative rounded-xl overflow-hidden group">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <ImageIcon className="text-white" size={24} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Paid Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-900/30 rounded-xl border border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg">
                          <DollarSign className="text-green-400" size={18} />
                        </div>
                        <div>
                          <p className="font-medium">Pullik kontent</p>
                          <p className="text-sm text-gray-400">
                            {isPaid ? "Foydalanuvchilar to'lashi kerak" : "Bepul ko'rish mumkin"}
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isPaid}
                          onChange={(e) => setIsPaid(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r from-green-500 to-emerald-500"></div>
                      </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/25"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="animate-spin" size={20} />
                            {editingAnime ? "Saqlanmoqda..." : "Qo'shilmoqda..."}
                          </>
                        ) : editingAnime ? (
                          <>
                            <Check size={20} />
                            Saqlash
                          </>
                        ) : (
                          <>
                            <Plus size={20} />
                            Qo'shish
                          </>
                        )}
                      </button>
                      
                      {editingAnime && (
                        <button
                          type="button"
                          onClick={resetForm}
                          className="px-6 py-3.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-xl transition-colors border border-gray-700"
                        >
                          Bekor
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* ANIME LIST */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-gray-700/50 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Film size={22} className="text-purple-400" />
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Anime Ro'yxati
                    </span>
                  </h2>
                  <span className="text-sm text-gray-400 bg-gray-800/50 px-3 py-1.5 rounded-lg">
                    {filteredAnime.length} ta anime
                  </span>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-gray-700 border-t-purple-500 rounded-full animate-spin"></div>
                      <Film className="absolute inset-0 m-auto text-purple-400" size={24} />
                    </div>
                    <p className="mt-4 text-gray-400">Animelar yuklanmoqda...</p>
                  </div>
                ) : filteredAnime.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Film className="text-gray-500" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">
                      Anime topilmadi
                    </h3>
                    <p className="text-gray-500 max-w-sm mx-auto">
                      {searchQuery ? "Qidiruv natijasi bo'yicha anime topilmadi" : "Hozircha anime mavjud emas"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAnime.map((anime) => (
                      <div
                        key={anime.id}
                        className="group bg-gradient-to-r from-gray-800/50 to-gray-900/30 hover:from-gray-800/70 hover:to-gray-900/50 p-4 rounded-xl border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300"
                      >
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Anime Image */}
                          <div className="relative flex-shrink-0">
                            <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-lg overflow-hidden">
                              <img
                                src={anime.image}
                                alt={anime.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            {anime.isPaid && (
                              <div className="absolute top-2 left-2">
                                <span className="px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-xs font-medium rounded-full flex items-center gap-1">
                                  <DollarSign size={10} />
                                  Pullik
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Anime Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                              <div className="flex-1">
                                <h3 className="font-bold text-lg mb-1 truncate">
                                  {anime.title}
                                </h3>
                                <div className="flex items-center gap-2 mb-3">
                                  <span className="text-sm text-gray-400 bg-gray-800/50 px-2 py-1 rounded flex items-center gap-1">
                                    <Globe size={12} />
                                    {anime.slug}
                                  </span>
                                  {anime.url && (
                                    <span className="text-sm text-gray-400 bg-gray-800/50 px-2 py-1 rounded flex items-center gap-1">
                                      <Video size={12} />
                                      Video
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-700/50">
                              <button
                                onClick={() => startEdit(anime)}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 text-blue-400 hover:text-blue-300 rounded-lg transition-all flex items-center gap-2 group/btn"
                              >
                                <Pencil size={16} className="group-hover/btn:scale-110 transition-transform" />
                                Tahrirlash
                              </button>
                              <button
                                onClick={() => deleteAnime(anime.id)}
                                className="px-4 py-2 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-red-400 hover:text-red-300 rounded-lg transition-all flex items-center gap-2 group/btn"
                              >
                                <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                                O'chirish
                              </button>
                              <Link
                                href={`/anime/${anime.slug}`}
                                target="_blank"
                                className="px-4 py-2 bg-gradient-to-r from-gray-700/50 to-gray-800/50 hover:from-gray-700 hover:to-gray-800 text-gray-300 hover:text-white rounded-lg transition-all flex items-center gap-2 group/btn ml-auto"
                              >
                                <Eye size={16} className="group-hover/btn:scale-110 transition-transform" />
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}