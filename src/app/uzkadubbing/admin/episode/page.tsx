"use client";

import { useEffect, useState } from "react";
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
  Check,
  Loader2,
  Search,
  Filter,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from "lucide-react";
import Sidebar from "@/src/components/AdminSideber";

// Types
interface Episode {
  id: string;
  title: string;
  episodeNumber: number;
  animeId: string;
  videoUrl: string;
  duration?: number;
  views?: number;
  isPublished?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Anime {
  id: string;
  title: string;
  image: string;
  slug: string;
}

// Mock API functions - bu yerda o'zingizning API lar bilan almashtiring
const mockEpisodes: Episode[] = [
  {
    id: "1",
    title: "Yangi boshlanish",
    episodeNumber: 1,
    animeId: "anime1",
    videoUrl: "https://example.com/video1.mp4",
    duration: 1320,
    views: 1500,
    isPublished: true,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    title: "Jang maydoni",
    episodeNumber: 2,
    animeId: "anime1",
    videoUrl: "https://example.com/video2.mp4",
    duration: 1280,
    views: 1200,
    isPublished: true,
    createdAt: "2024-01-16T10:30:00Z",
    updatedAt: "2024-01-16T10:30:00Z"
  },
  {
    id: "3",
    title: "Sirli kuch",
    episodeNumber: 3,
    animeId: "anime2",
    videoUrl: "https://example.com/video3.mp4",
    duration: 1400,
    views: 900,
    isPublished: false,
    createdAt: "2024-01-17T10:30:00Z",
    updatedAt: "2024-01-17T10:30:00Z"
  }
];

const mockAnimeList: Anime[] = [
  {
    id: "anime1",
    title: "Naruto Shippuden",
    image: "https://example.com/naruto.jpg",
    slug: "naruto-shippuden"
  },
  {
    id: "anime2",
    title: "One Piece",
    image: "https://example.com/onepiece.jpg",
    slug: "one-piece"
  },
  {
    id: "anime3",
    title: "Attack on Titan",
    image: "https://example.com/aot.jpg",
    slug: "attack-on-titan"
  }
];

// Mock API calls
const getAllEpisodes = async (): Promise<Episode[]> => {
  // API dan qaytgan ma'lumot formatini o'zgartiring
  return new Promise(resolve => {
    setTimeout(() => resolve(mockEpisodes), 500);
  });
};

const getAllAnime = async (): Promise<Anime[]> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(mockAnimeList), 300);
  });
};

const createEpisodeApi = async (data: Omit<Episode, 'id' | 'createdAt' | 'updatedAt'>): Promise<Episode> => {
  const newEpisode: Episode = {
    id: `ep${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  return new Promise(resolve => {
    setTimeout(() => resolve(newEpisode), 500);
  });
};

const updateEpisodeApi = async (id: string, data: Partial<Episode>): Promise<Episode> => {
  const updatedEpisode = {
    ...mockEpisodes.find(e => e.id === id)!,
    ...data,
    updatedAt: new Date().toISOString()
  };
  return new Promise(resolve => {
    setTimeout(() => resolve(updatedEpisode), 500);
  });
};

const deleteEpisodeApi = async (id: string): Promise<void> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(), 300);
  });
};

const uploadEpisodeVideo = async (file: File): Promise<string> => {
  // Video upload logic - bu yerda o'zingizning upload API ga so'rov qilishingiz kerak
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`https://cdn.example.com/uploads/${Date.now()}_${file.name}`);
    }, 1000);
  });
};

export default function AdminEpisodePage() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAnime, setSelectedAnime] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // FORM STATE
  const [editingEpisode, setEditingEpisode] = useState<Episode | null>(null);
  const [title, setTitle] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState(1);
  const [animeId, setAnimeId] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isPublished, setIsPublished] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [eps, anime] = await Promise.all([
        getAllEpisodes(),
        getAllAnime()
      ]);
      
      setEpisodes(eps);
      setAnimeList(anime);
    } catch (err) {
      console.error("Ma'lumotlarni yuklashda xatolik:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('video/')) {
      alert('Faqat video fayllarni yuklashingiz mumkin');
      return;
    }
    
    if (file.size > 500 * 1024 * 1024) {
      alert('Video hajmi 500MB dan oshmasligi kerak');
      return;
    }
    
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  // CREATE / UPDATE Episode
  const saveEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert("Episode nomini kiriting!");
      return;
    }
    
    if (!animeId) {
      alert("Anime tanlang!");
      return;
    }
    
    if (!videoFile && !editingEpisode?.videoUrl) {
      alert("Video faylni tanlang!");
      return;
    }
    
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      let videoUrl = editingEpisode?.videoUrl || "";
      
      if (videoFile) {
        setUploadProgress(30);
        videoUrl = await uploadEpisodeVideo(videoFile);
        setUploadProgress(100);
      }

      const episodeData = { 
        title: title.trim(), 
        episodeNumber, 
        animeId, 
        videoUrl,
        isPublished,
        duration: videoFile ? 1200 : editingEpisode?.duration,
        views: editingEpisode?.views || 0
      };

      if (editingEpisode) {
        const savedEpisode = await updateEpisodeApi(editingEpisode.id, episodeData);
        setEpisodes(prev => prev.map(ep => 
          ep.id === savedEpisode.id ? savedEpisode : ep
        ));
      } else {
        const savedEpisode = await createEpisodeApi(episodeData);
        setEpisodes(prev => [savedEpisode, ...prev]);
      }

      resetForm();
      alert(editingEpisode ? "Episode yangilandi!" : "Episode qo'shildi!");
    } catch (err: any) {
      console.error("Episode saqlashda xatolik:", err);
      alert(err.message || "Xatolik yuz berdi!");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const startEdit = (episode: Episode) => {
    setEditingEpisode(episode);
    setTitle(episode.title);
    setEpisodeNumber(episode.episodeNumber);
    setAnimeId(episode.animeId);
    setVideoPreview(episode.videoUrl);
    setVideoFile(null);
    setIsPublished(episode.isPublished ?? true);
    
    if (window.innerWidth < 1024) {
      document.getElementById('episode-form')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const resetForm = () => {
    setEditingEpisode(null);
    setTitle("");
    setEpisodeNumber(1);
    setAnimeId("");
    setVideoFile(null);
    setVideoPreview("");
    setIsPublished(true);
    setUploadProgress(0);
  };

  const handleDeleteEpisode = async (id: string) => {
    if (!confirm("Rostdan ham bu epizodni o'chirmoqchimisiz?")) return;
    
    try {
      await deleteEpisodeApi(id);
      setEpisodes(prev => prev.filter(ep => ep.id !== id));
      alert("Episode o'chirildi!");
    } catch (err) {
      console.error("O'chirishda xatolik:", err);
      alert("Server xatosi!");
    }
  };

  const getAnimeTitle = (animeId: string) => {
    const anime = animeList.find(a => a.id === animeId);
    return anime ? anime.title : "Noma'lum Anime";
  };

  const getAnimeImage = (animeId: string) => {
    const anime = animeList.find(a => a.id === animeId);
    return anime ? anime.image : "";
  };

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds: number = 0) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Filter episodes
  const filteredEpisodes = episodes.filter(episode => {
    const matchesSearch = episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getAnimeTitle(episode.animeId).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAnime = selectedAnime === "all" || episode.animeId === selectedAnime;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "published" && episode.isPublished) ||
                         (statusFilter === "draft" && !episode.isPublished);
    
    return matchesSearch && matchesAnime && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEpisodes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEpisodes = filteredEpisodes.slice(startIndex, startIndex + itemsPerPage);

  // Stats calculations
  const totalEpisodes = episodes.length;
  const publishedEpisodes = episodes.filter(ep => ep.isPublished).length;
  const totalViews = episodes.reduce((sum, ep) => sum + (ep.views || 0), 0);
  const totalDuration = episodes.reduce((sum, ep) => sum + (ep.duration || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="flex">
        <Sidebar />
        
        <div className="flex-1 p-3 sm:p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl">
                    <Play className="text-white w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Epizodlar Boshqaruvi
                    </h1>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">
                      Anime epizodlarini boshqaring va tahrirlang
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Qidirish..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-full sm:w-48"
                    />
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-xs">Jami Epizod</p>
                      <p className="text-lg sm:text-xl font-bold mt-1">{totalEpisodes}</p>
                    </div>
                    <Play className="text-blue-400 w-5 h-5" />
                  </div>
                </div>
                <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-xs">Nashr qilingan</p>
                      <p className="text-lg sm:text-xl font-bold mt-1">{publishedEpisodes}</p>
                    </div>
                    <Eye className="text-green-400 w-5 h-5" />
                  </div>
                </div>
                <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-xs">Umumiy ko'rish</p>
                      <p className="text-lg sm:text-xl font-bold mt-1">{totalViews.toLocaleString()}</p>
                    </div>
                    <Eye className="text-purple-400 w-5 h-5" />
                  </div>
                </div>
                <div className="bg-gray-800/40 p-3 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-xs">Jami vaqt</p>
                      <p className="text-lg sm:text-xl font-bold mt-1">{Math.floor(totalDuration/3600)} soat</p>
                    </div>
                    <Clock className="text-yellow-400 w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* FORM CARD - Mobile first */}
              <div className="lg:col-span-1 order-2 lg:order-1" id="episode-form">
                <div className="lg:sticky lg:top-6">
                  <div className="bg-gray-800/50 rounded-xl p-4 sm:p-5 border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold flex items-center gap-2">
                        {editingEpisode ? (
                          <>
                            <Edit className="text-yellow-400 w-5 h-5" />
                            <span className="text-yellow-400">Tahrirlash</span>
                          </>
                        ) : (
                          <>
                            <Plus className="text-green-400 w-5 h-5" />
                            <span className="text-green-400">Yangi Epizod</span>
                          </>
                        )}
                      </h2>
                      {editingEpisode && (
                        <button
                          onClick={resetForm}
                          className="p-1.5 hover:bg-gray-700 rounded-lg"
                          title="Bekor qilish"
                        >
                          <X className="text-gray-400 w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <form onSubmit={saveEpisode} className="space-y-4">
                      {/* Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                          Epizod nomi *
                        </label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Masalan: Yangi boshlanish"
                          className="w-full px-3 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                          required
                        />
                      </div>

                      {/* Episode Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                          Epizod raqami *
                        </label>
                        <div className="relative">
                          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="number"
                            value={episodeNumber}
                            onChange={(e) => setEpisodeNumber(Math.max(1, parseInt(e.target.value) || 1))}
                            min={1}
                            className="w-full pl-9 pr-3 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </div>

                      {/* Anime Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                          Anime tanlang *
                        </label>
                        <select
                          value={animeId}
                          onChange={(e) => setAnimeId(e.target.value)}
                          className="w-full px-3 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
                          required
                        >
                          <option value="">Tanlang...</option>
                          {animeList.map((anime) => (
                            <option key={anime.id} value={anime.id}>
                              {anime.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Video Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                          Video yuklash *
                        </label>
                        <div className="space-y-3">
                          <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-900/30 hover:bg-gray-800/50 transition-colors">
                            <div className="flex flex-col items-center justify-center p-4">
                              <Upload className="w-6 h-6 mb-2 text-gray-400" />
                              <p className="text-sm text-gray-400 text-center">
                                <span className="font-semibold">Video tanlang</span>
                                <br />
                                <span className="text-xs">MP4, MOV (max 500MB)</span>
                              </p>
                            </div>
                            <input
                              type="file"
                              accept="video/*"
                              onChange={handleVideoChange}
                              className="hidden"
                            />
                          </label>
                          
                          {/* Upload Progress */}
                          {uploadProgress > 0 && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-300">Yuklanmoqda...</span>
                                <span className="text-blue-400">{uploadProgress}%</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-1.5">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1.5 rounded-full transition-all"
                                  style={{ width: `${uploadProgress}%` }}
                                />
                              </div>
                            </div>
                          )}
                          
                          {/* Video Preview */}
                          {(videoPreview || editingEpisode?.videoUrl) && (
                            <div className="relative rounded-lg overflow-hidden bg-black">
                              <div className="aspect-video bg-gray-900 flex items-center justify-center">
                                <Play className="text-gray-700 w-12 h-12" />
                              </div>
                              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs">
                                {formatDuration(1200)}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Publish Status */}
                      <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded ${isPublished ? 'bg-green-500/20' : 'bg-gray-700'}`}>
                            <Eye className={`w-4 h-4 ${isPublished ? 'text-green-400' : 'text-gray-400'}`} />
                          </div>
                          <div>
                            <p className="font-medium text-sm">Nashr qilish</p>
                            <p className="text-xs text-gray-400">
                              {isPublished ? "Hamma ko'rishi mumkin" : "Faqlat admin ko'rishi mumkin"}
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isPublished}
                            onChange={(e) => setIsPublished(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="animate-spin w-4 h-4" />
                              <span className="text-sm">Kutilmoqda...</span>
                            </>
                          ) : editingEpisode ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span className="text-sm">Saqlash</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4" />
                              <span className="text-sm">Qo'shish</span>
                            </>
                          )}
                        </button>
                        
                        {editingEpisode && (
                          <button
                            type="button"
                            onClick={resetForm}
                            className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg transition-colors border border-gray-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* EPISODES LIST */}
              <div className="lg:col-span-2 order-1 lg:order-2">
                <div className="bg-gray-800/50 rounded-xl p-4 sm:p-5 border border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <Play className="text-blue-400 w-5 h-5" />
                      <span className="text-blue-400">Epizodlar Ro'yxati</span>
                    </h2>
                    
                    <div className="flex flex-wrap gap-2">
                      <div className="relative flex-1 sm:flex-none sm:w-auto">
                        <Filter className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <select
                          value={selectedAnime}
                          onChange={(e) => setSelectedAnime(e.target.value)}
                          className="pl-8 pr-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none w-full sm:w-auto"
                        >
                          <option value="all">Barcha Animelar</option>
                          {animeList.map(anime => (
                            <option key={anime.id} value={anime.id}>{anime.title}</option>
                          ))}
                        </select>
                      </div>
                      
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
                      >
                        <option value="all">Barchasi</option>
                        <option value="published">Nashr qilingan</option>
                        <option value="draft">Qoralama</option>
                      </select>
                      
                      <div className="text-sm text-gray-400 bg-gray-900/50 px-3 py-2 rounded-lg">
                        {filteredEpisodes.length} ta
                      </div>
                    </div>
                  </div>

                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="relative">
                        <div className="w-12 h-12 border-3 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
                        <Play className="absolute inset-0 m-auto text-blue-400 w-6 h-6" />
                      </div>
                      <p className="mt-4 text-gray-400">Yuklanmoqda...</p>
                    </div>
                  ) : filteredEpisodes.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Play className="text-gray-500 w-8 h-8" />
                      </div>
                      <h3 className="text-base font-medium text-gray-300 mb-2">
                        Epizod topilmadi
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {searchTerm || selectedAnime !== "all" 
                          ? "Qidiruv natijasi bo'yicha epizod topilmadi" 
                          : "Hozircha epizod mavjud emas"}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        {paginatedEpisodes.map((episode) => (
                          <div
                            key={episode.id}
                            className="bg-gray-900/30 hover:bg-gray-900/50 p-3 rounded-lg border border-gray-700/50 transition-all"
                          >
                            <div className="flex flex-col sm:flex-row gap-3">
                              {/* Episode Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full">
                                    Ep {episode.episodeNumber}
                                  </span>
                                  {!episode.isPublished && (
                                    <span className="px-2.5 py-1 bg-gray-700 text-gray-300 text-xs font-medium rounded-full">
                                      Qoralama
                                    </span>
                                  )}
                                  <span className="text-xs text-gray-500">
                                    {formatDuration(episode.duration)}
                                  </span>
                                </div>
                                
                                <h3 className="font-bold text-base mb-1 line-clamp-1">
                                  {episode.title}
                                </h3>
                                
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="flex items-center gap-1.5">
                                    <Film className="text-gray-500 w-3.5 h-3.5" />
                                    <span className="text-xs text-gray-400">
                                      {getAnimeTitle(episode.animeId)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Calendar className="text-gray-500 w-3.5 h-3.5" />
                                    <span className="text-xs text-gray-500">
                                      {formatDate(episode.createdAt)}
                                    </span>
                                  </div>
                                  {episode.views !== undefined && (
                                    <div className="flex items-center gap-1.5">
                                      <Eye className="text-gray-500 w-3.5 h-3.5" />
                                      <span className="text-xs text-gray-500">
                                        {episode.views.toLocaleString()}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-700/30">
                                  <button
                                    onClick={() => startEdit(episode)}
                                    className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded text-sm flex items-center gap-1.5"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                    Tahrirlash
                                  </button>
                                  <button
                                    onClick={() => handleDeleteEpisode(episode.id)}
                                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded text-sm flex items-center gap-1.5"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    O'chirish
                                  </button>
                                  <a
                                    href={episode.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm flex items-center gap-1.5"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    Ko'rish
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700/30">
                          <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded flex items-center gap-1.5 text-sm"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            Oldingi
                          </button>
                          
                          <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                              let pageNum;
                              if (totalPages <= 3) {
                                pageNum = i + 1;
                              } else if (currentPage === 1) {
                                pageNum = i + 1;
                              } else if (currentPage === totalPages) {
                                pageNum = totalPages - 2 + i;
                              } else {
                                pageNum = currentPage - 1 + i;
                              }
                              
                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={`w-8 h-8 rounded text-sm ${currentPage === pageNum 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-800 hover:bg-gray-700'}`}
                                >
                                  {pageNum}
                                </button>
                              );
                            })}
                          </div>
                          
                          <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded flex items-center gap-1.5 text-sm"
                          >
                            Keyingi
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}