"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, Play, Upload, Film, Hash, Calendar } from "lucide-react";
import Sidebar from "@/src/components/AdminSideber";
import { Episode } from "@/src/features/types/Episode";
import { Anime } from "@/src/features/types/Anime";
import { createEpisodeApi, deleteEpisodeApi, getAllEpisodes, updateEpisodeApi, uploadEpisodeVideo } from "@/src/features/api/Episode";
import { getAllAnime } from "@/src/features/api/Anime";


export default function AdminEpisodePage() {

    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [animeList, setAnimeList] = useState<Anime[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    // FORM STATE
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
  
    const handleCreateEpisode = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!videoFile) return alert("Video faylni tanlang!");
      setIsSubmitting(true);
  
      try {
        const videoUrl = await uploadEpisodeVideo(videoFile);
        const newEpisode = await createEpisodeApi({ title, episodeNumber, animeId, videoUrl });
        setEpisodes(prev => [newEpisode, ...prev]);
        // Formni tozalash
        setTitle(""); setEpisodeNumber(1); setAnimeId(""); setVideoFile(null); setVideoPreview("");
        alert("Episode qo‘shildi!");
      } catch (err: any) {
        console.error(err);
        alert(err.message || "Xatolik yuz berdi!");
      } finally {
        setIsSubmitting(false);
      }
    };
  
    const handleDeleteEpisode = async (id: string) => {
      if (!confirm("Rostdan ham o'chirmoqchimisiz?")) return;
      try {
        await deleteEpisodeApi(id);
        setEpisodes(prev => prev.filter(e => e.id !== id));
        alert("Episode o'chirildi!");
      } catch (err) {
        console.error(err);
        alert("Server xatosi!");
      }
    };
  
    const handleUpdateEpisode = async (id: string, body: { title?: string; episodeNumber?: number; animeId?: string; videoUrl?: string }) => {
      try {
        const updated = await updateEpisodeApi(id, body);
        setEpisodes(prev => prev.map(e => (e.id === id ? updated : e)));
        alert("Episode yangilandi!");
      } catch (err) {
        console.error(err);
        alert("Yangilashda xatolik!");
      }
    };
  
    const getAnimeTitle = (animeId: string) => {
      const anime = animeList.find(a => a.id === animeId);
      return anime ? anime.title : "Noma'lum Anime";
    };
  
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
  
      {/* === SIDEBAR === */}
      <Sidebar />
  
      {/* === MAIN CONTENT === */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
  
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Play className="text-purple-400" size={32} />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Epizodlar Boshqaruvi
              </h1>
            </div>
            <p className="text-gray-400">Anime epizodlarini boshqaring va qo'shing</p>
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* ================= CREATE FORM ================= */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 shadow-lg sticky top-6">
                <div className="flex items-center gap-2 mb-6">
                  <Plus className="text-green-400" size={24} />
                  <h2 className="text-xl font-bold">Yangi Epizod Qo'shish</h2>
                </div>
  
                <form onSubmit={handleCreateEpisode} className="space-y-4">
  
                  {/* Title Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Epizod Nomi
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-500/50"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Epizod nomini kiriting"
                      required
                    />
                  </div>
  
                  {/* Episode Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Epizod Raqami
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="number"
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-500/50"
                        value={episodeNumber}
                        onChange={(e) => setEpisodeNumber(Number(e.target.value))}
                        min={1}
                        required
                      />
                    </div>
                  </div>
  
                  {/* Anime Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Anime Tanlash
                    </label>
                    <select
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-500/50"
                      value={animeId}
                      onChange={(e) => setAnimeId(e.target.value)}
                      required
                    >
                      <option value="">Anime tanlang</option>
                      {animeList.map((anime) => (
                        <option key={anime.id} value={anime.id}>{anime.title}</option>
                      ))}
                    </select>
                  </div>
  
                  {/* Video Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Video Yuklash
                    </label>
                    <div className="border-2 border-dashed border-gray-600/50 rounded-lg p-4 text-center hover:border-purple-500/50 transition cursor-pointer">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="hidden"
                        id="video-upload"
                        required
                      />
                      <label htmlFor="video-upload" className="cursor-pointer">
                        <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                        <p className="text-sm text-gray-400">
                          {videoPreview ? "Video tanlandi" : "Video tanlang yoki tashlang"}
                        </p>
                      </label>
                    </div>
  
                    {videoPreview && (
                      <video
                        src={videoPreview}
                        controls
                        className="mt-3 w-full h-32 object-cover rounded-lg bg-black"
                      />
                    )}
                  </div>
  
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                        Qo'shilmoqda...
                      </>
                    ) : (
                      <>
                        <Plus size={18} /> Epizod Qo'shish
                      </>
                    )}
                  </button>
  
                </form>
              </div>
            </div>
  
            {/* ================= EPISODES LIST ================= */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 shadow-lg">
  
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Play className="text-blue-400" size={24} />
                    <h2 className="text-xl font-bold">Barcha Epizodlar</h2>
                  </div>
                  <div className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                    {episodes.length} ta epizod
                  </div>
                </div>
  
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
                  </div>
                ) : episodes.length === 0 ? (
                  <div className="text-center py-12">
                    <Film className="mx-auto mb-4 text-gray-500" size={48} />
                    <p className="text-gray-400 text-lg">Hozircha epizod yo‘q</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {episodes.map((episode) => (
                      <div key={episode.id} className="bg-gray-700/30 p-4 rounded-lg border border-gray-600/30">
                        <div className="flex gap-4">
  
                          <video
                            src={episode.videoUrl}
                            className="w-32 h-20 object-cover rounded-lg bg-black"
                          />
  
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{episode.title}</h3>
                            <p className="text-gray-400 text-sm">{getAnimeTitle(episode.animeId)}</p>
  
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={async () => {
                                  const newTitle = prompt("Yangi epizod nomini kiriting", episode.title);
                                  if (!newTitle) return;
                                  await handleUpdateEpisode(episode.id, { title: newTitle });
                                  alert("Epizod yangilandi!");
                                }}
                                className="px-3 py-2 bg-blue-600/20 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-colors"
                              >
                                Tahrirlash
                              </button>
  
                              <button
                                onClick={() => handleDeleteEpisode(episode.id)}
                                className="px-3 py-2 bg-red-600/20 text-red-300 rounded-lg"
                              >
                                O‘chirish
                              </button>
  
                              <Link
                                href={`/admin/episode/${episode.id}`}
                                className="px-3 py-2 bg-gray-600/20 text-gray-300 rounded-lg"
                              >
                                Ko‘rish
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