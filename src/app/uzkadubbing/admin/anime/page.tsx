"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/src/components/AdminSideber";
import { Film, Upload, DollarSign, Plus, Pencil } from "lucide-react";
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
    if (!editingAnime) {
      setSlug(
        title
          .toLowerCase()
          .trim()
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
      alert(editingAnime ? "Anime yangilandi!" : "Anime qo‘shildi!");
    } catch (err: any) {
      alert(err.message || "Xatolik");
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
  };

  const resetForm = () => {
    setEditingAnime(null);
    setTitle("");
    setSlug("");
    setIsPaid(false);
    setVideoUrl("");
    setImageFile(null);
    setImagePreview("");
  };

  const deleteAnime = async (id: string) => {
    if (!confirm("Rostdan ham o‘chirmoqchimisiz?")) return;

    try {
      await deleteAnimeApi(id);
      setAnimeList((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("O‘chirishda xatolik");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center gap-3">
            <Film className="text-purple-400" size={32} />
            <h1 className="text-3xl font-bold">
              Anime Boshqaruvi
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* FORM */}
            <div>
              <div className="bg-gray-800/40 p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  {editingAnime ? <Pencil size={20} /> : <Plus size={20} />}
                  {editingAnime ? "Anime Tahrirlash" : "Yangi Anime"}
                </h2>

                <form onSubmit={saveAnime} className="space-y-4">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Anime nomi"
                    className="w-full px-3 py-2 bg-gray-700 rounded"
                    required
                  />

                  <input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="Slug"
                    className="w-full px-3 py-2 bg-gray-700 rounded"
                    required
                  />

                  <div className="flex items-center gap-2">
                    <DollarSign size={18} />
                    Pullik
                    <input
                      type="checkbox"
                      checked={isPaid}
                      onChange={(e) => setIsPaid(e.target.checked)}
                      className="ml-auto"
                    />
                  </div>

                  <input
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Video URL"
                    className="w-full px-3 py-2 bg-gray-700 rounded"
                  />

                  <input type="file" accept="image/*" onChange={handleUpload} />

                  {imagePreview && (
                    <img
                      src={imagePreview}
                      className="h-32 w-full object-cover rounded"
                    />
                  )}

                  <div className="flex gap-2">
                    <button
                      className="flex-1 bg-purple-600 py-2 rounded"
                      disabled={isSubmitting}
                    >
                      {editingAnime ? "Saqlash" : "Qo‘shish"}
                    </button>

                    {editingAnime && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 bg-gray-600 rounded"
                      >
                        Bekor
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* LIST */}
            <div className="lg:col-span-2 space-y-4">
              {animeList.map((anime) => (
                <div
                  key={anime.id}
                  className="bg-gray-700/30 p-4 rounded flex gap-4"
                >
                  <img
                    src={anime.image}
                    className="w-20 h-24 object-cover rounded"
                  />

                  <div className="flex-1">
                    <h3 className="font-bold">{anime.title}</h3>
                    <p className="text-sm text-gray-400">{anime.slug}</p>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => startEdit(anime)}
                        className="px-3 py-2 bg-blue-600/20 rounded"
                      >
                        Tahrirlash
                      </button>

                      <button
                        onClick={() => deleteAnime(anime.id)}
                        className="px-3 py-2 bg-red-600/20 rounded"
                      >
                        O‘chirish
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
