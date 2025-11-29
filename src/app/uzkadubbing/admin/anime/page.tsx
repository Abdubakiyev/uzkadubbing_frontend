"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, Film, Upload, DollarSign, Link as LinkIcon } from "lucide-react";
import Sidebar from "@/src/components/AdminSideber";
import { Anime } from "@/src/features/types/Anime";
import { createAnimeApi, deleteAnimeApi, getAllAnime, updateAnimeApi, uploadAnimeImage } from "@/src/features/api/Anime";


export default function AdminAnimePage() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    loadAnime();
  }, []);
  
  const loadAnime = async () => {
    try {
      setLoading(true);
      const data = await getAllAnime();
      setAnimeList(data);
    } catch (err) {
      console.error("Fetch xatosi:", err);
    } finally {
      setLoading(false);
    }
  };
  const createAnime = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      let imageUrl = "";
  
      if (imageFile) {
        imageUrl = await uploadAnimeImage(imageFile);
      }
  
      const newAnime = await createAnimeApi({
        title,
        slug,
        image: imageUrl,
        isPaid,
        url: videoUrl,
      });
  
      setAnimeList((prev) => [newAnime, ...prev]);
  
      alert("Anime qo‘shildi!");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const deleteAnime = async (id: string) => {
    if (!confirm("Rostdan ham o‘chirmoqchimisiz?")) return;
  
    try {
      await deleteAnimeApi(id);
      setAnimeList((prev) => prev.filter((a) => a.id !== id));
      alert("O'chirildi!");
    } catch (err) {
      console.error(err);
    }
  };
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    // Faylni saqlab qo‘yamiz
    setImageFile(file);
  
    // Preview ko‘rsatamiz
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };  
      
  

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      
      {/* SIDEBAR */}
      <Sidebar />
  
      {/* MAIN CONTENT */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
  
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Film className="text-purple-400" size={32} />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Anime Boshqaruvi
              </h1>
            </div>
            <p className="text-gray-400">Anime kontentingizni boshqaring va qo'shing</p>
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  
            {/* CREATE FORM */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 shadow-lg sticky top-6">
  
                <div className="flex items-center gap-2 mb-6">
                  <Plus className="text-green-400" size={24} />
                  <h2 className="text-xl font-bold">Yangi Anime Qo'shish</h2>
                </div>
  
                <form onSubmit={createAnime} className="space-y-4">
                  
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Anime Nomi
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-500/50"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Anime nomi..."
                      required
                    />
                  </div>
  
                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Slug
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-500/50"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="my-anime-slug"
                      required
                    />
                  </div>
  
                  {/* Paid */}
                  <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                    <span className="flex items-center gap-2 text-sm">
                      <DollarSign size={18} className="text-yellow-400" />
                      Pullik kontent
                    </span>
  
                    <label className="relative inline-flex items-center cursor-pointer ml-auto">
                      <input
                        type="checkbox"
                        checked={isPaid}
                        onChange={(e) => setIsPaid(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div
                        className="w-11 h-6 bg-gray-600 rounded-full peer-checked:bg-purple-600 
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                        after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all
                        peer-checked:after:translate-x-full"
                      ></div>
                    </label>
                  </div>
  
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Rasm Yuklash
                    </label>
  
                    <div className="border-2 border-dashed border-gray-600/50 rounded-lg p-4 text-center cursor-pointer hover:border-purple-500/50 transition">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUpload}
                        className="hidden"
                        id="image-upload"
                        required
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                        <p className="text-sm text-gray-400">
                          {imagePreview ? "Rasm tanlandi" : "Rasm tanlang"}
                        </p>
                      </label>
                    </div>
  
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        className="mt-3 w-full h-32 object-cover rounded-lg"
                      />
                    )}
                  </div>
  
                  {/* Video URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Video URL
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg pl-10"
                      placeholder="https://cdn.com/video.mp4"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                    />
                  </div>
  
                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 rounded-lg disabled:opacity-50"
                  >
                    {isSubmitting ? "Yuklanmoqda..." : "Anime Qo‘shish"}
                  </button>
                </form>
  
              </div>
            </div>
  
            {/* ANIME LIST */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 shadow-lg">
  
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Film className="text-blue-400" size={24} />
                  Barcha Anime
                </h2>
  
                {loading ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin h-10 w-10 border-4 border-t-transparent border-purple-500 rounded-full"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {animeList.map((anime) => (
                      <div
                        key={anime.id}
                        className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/30 flex gap-4"
                      >
                        <img
                          src={anime.image}
                          className="w-20 h-24 object-cover rounded-lg"
                        />
  
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{anime.title}</h3>
                          <p className="text-gray-400 text-sm">{anime.slug}</p>
  
                          <div className="flex gap-2 mt-3">
                            <Link
                              href={`/admin/anime/edit/${anime.id}`}
                              className="px-3 py-2 bg-blue-600/20 rounded-lg text-blue-300"
                            >
                              Tahrirlash
                            </Link>
  
                            <button
                              onClick={() => deleteAnime(anime.id)}
                              className="px-3 py-2 bg-red-600/20 rounded-lg text-red-300"
                            >
                              O‘chirish
                            </button>
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