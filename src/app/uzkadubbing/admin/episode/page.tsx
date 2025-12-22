"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Upload, Play, Hash } from "lucide-react";
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

  // FORM STATE
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [title, setTitle] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState(1);
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
    } finally {
      setLoading(false);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  // 🔹 CREATE / UPDATE
  const saveEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !animeId) return alert("Barcha maydonlarni to‘ldiring!");
    if (!videoFile && !editingEpisode) return alert("Video faylni tanlang!");
    setIsSubmitting(true);

    try {
      let videoUrl = editingEpisode?.videoUrl || "";
      if (videoFile) {
        videoUrl = await uploadEpisodeVideo(videoFile); // uploaded.url emas
      }


      const dto = { title, episodeNumber, animeId, videoUrl };
      let savedEpisode: Episode;

      if (editingEpisode) {
        // Update
        savedEpisode = await updateEpisodeApi(editingEpisode.id, dto);
        setEpisodes((prev) =>
          prev.map((e) => (e.id === savedEpisode.id ? savedEpisode : e))
        );
        alert("Episode yangilandi!");
      } else {
        // Create
        savedEpisode = await createEpisodeApi(dto);
        setEpisodes((prev) => [savedEpisode, ...prev]);
        alert("Episode qo‘shildi!");
      }

      resetForm();
    } catch (err: any) {
      alert(err.message || "Xatolik yuz berdi!");
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
  };

  const resetForm = () => {
    setEditingEpisode(null);
    setTitle("");
    setEpisodeNumber(1);
    setAnimeId("");
    setVideoFile(null);
    setVideoPreview("");
  };

  const handleDeleteEpisode = async (id: string) => {
    if (!confirm("Rostdan ham o'chirmoqchimisiz?")) return;
    try {
      await deleteEpisodeApi(id);
      setEpisodes((prev) => prev.filter((e) => e.id !== id));
      alert("Episode o'chirildi!");
    } catch (err) {
      console.error(err);
      alert("Server xatosi!");
    }
  };

  const getAnimeTitle = (animeId: string) => {
    const anime = animeList.find((a) => a.id === animeId);
    return anime ? anime.title : "Noma'lum Anime";
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center gap-3">
            <Play className="text-purple-400" size={32} />
            <h1 className="text-3xl font-bold">Epizodlar Boshqaruvi</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* FORM */}
            <div>
              <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 shadow-lg sticky top-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  {editingEpisode ? "Episode Tahrirlash" : "Yangi Episode"}
                </h2>

                <form onSubmit={saveEpisode} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Episode nomi"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg"
                    required
                  />

                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="number"
                      value={episodeNumber || 1}
                      onChange={(e) => setEpisodeNumber(Number(e.target.value))}
                      min={1}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg"
                      placeholder="Episode raqami"
                      required
                    />
                  </div>

                  <select
                    value={animeId}
                    onChange={(e) => setAnimeId(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg"
                    required
                  >
                    <option value="">Anime tanlang</option>
                    {animeList.map((anime) => (
                      <option key={anime.id} value={anime.id}>
                        {anime.title}
                      </option>
                    ))}
                  </select>

                  <div className="border-2 border-dashed border-gray-600/50 rounded-lg p-4 text-center cursor-pointer">
                    <input type="file" accept="video/*" onChange={handleVideoChange} className="hidden" id="video-upload" />
                    <label htmlFor="video-upload" className="cursor-pointer">
                      <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                      <p className="text-sm text-gray-400">
                        {videoPreview ? "Video tanlandi" : "Video tanlang yoki tashlang"}
                      </p>
                    </label>
                  </div>

                  {videoPreview && (
                    <video src={videoPreview} controls className="mt-3 w-full h-32 object-cover rounded-lg bg-black" />
                  )}

                  <div className="flex gap-2">
                    <button type="submit" disabled={isSubmitting} className="flex-1 bg-purple-600 py-3 rounded-lg">
                      {editingEpisode ? "Saqlash" : "Qo‘shish"}
                    </button>

                    {editingEpisode && (
                      <button type="button" onClick={resetForm} className="px-4 bg-gray-600 rounded-lg">
                        Bekor
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* EPISODES LIST */}
            <div className="lg:col-span-2 space-y-4">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
                </div>
              ) : episodes.length === 0 ? (
                <div className="text-center py-12 text-gray-400">Hozircha epizod yo‘q</div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {episodes.map((episode) => (
                    <div key={episode.id} className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/30 flex gap-4">
                      <video src={episode.videoUrl} className="w-32 h-20 object-cover rounded-lg bg-black" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{episode.title}</h3>
                        <p className="text-gray-400 text-sm">{getAnimeTitle(episode.animeId)}</p>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => startEdit(episode)}
                            className="px-3 py-2 bg-blue-600/20 text-blue-300 rounded-lg"
                          >
                            Tahrirlash
                          </button>
                          <button
                            onClick={() => handleDeleteEpisode(episode.id)}
                            className="px-3 py-2 bg-red-600/20 text-red-300 rounded-lg"
                          >
                            O‘chirish
                          </button>
                          <Link href={`/admin/episode/${episode.id}`} className="px-3 py-2 bg-gray-600/20 text-gray-300 rounded-lg">
                            Ko‘rish
                          </Link>
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
  );
}
