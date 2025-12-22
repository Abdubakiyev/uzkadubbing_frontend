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
  Link, 
  Type, 
  Video,
  Loader2,
  ExternalLink
} from "lucide-react";

import {
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  getAllAdvertisements,
  uploadAdvertisementVideo,
  CreateAdvertisementDto,
} from "@/src/features/api/Reklama";
import { Advertisement } from "@/src/features/types/Reklama";

export default function AdminAdvertisementPage() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // form state
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState("");

  // auth
  const [token, setToken] = useState("");

  // edit
  const [editingAd, setEditingAd] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"list" | "form">("list");

  // token faqat browserda
  useEffect(() => {
    const t = localStorage.getItem("access_token") || "";
    setToken(t);
    loadAds();
  }, []);

  const loadAds = async () => {
    try {
      setLoading(true);
      const data = await getAllAdvertisements();
      setAds(data);
    } catch (e) {
      console.error("Fetch xato:", e);
    } finally {
      setLoading(false);
    }
  };

  // video tanlash
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Video hajmi tekshirish (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert("Video hajmi 10MB dan oshmasligi kerak");
      return;
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  // edit boshlash
  const startEdit = (ad: any) => {
    setEditingAd(ad);
    setText(ad.text || "");
    setLink(ad.link || "");
    setVideoPreview(ad.video || "");
    setVideoFile(null);
    setActiveTab("form");
  };

  // create + update
  const createAd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress(0);

    if (!token) {
      alert("Token yo'q, qayta login qiling");
      setIsSubmitting(false);
      return;
    }

    try {
      let videoUrl = editingAd?.video || "";

      // video yuklash
      if (videoFile) {
        const uploaded = await uploadAdvertisementVideo(videoFile, token);
        videoUrl = uploaded.url;
        
        // Simulate progress (aslida API dan progress kelishi mumkin)
        for (let i = 0; i <= 100; i += 20) {
          setTimeout(() => setUploadProgress(i), i * 50);
        }
      }

      const dto: CreateAdvertisementDto = {};
      if (text.trim()) dto.text = text.trim();
      if (link.trim()) dto.link = link.trim();
      if (videoUrl) dto.video = videoUrl;

      let savedAd: Advertisement;

      if (editingAd) {
        // ✏️ UPDATE
        savedAd = await updateAdvertisement(editingAd.id, dto, token);
        setAds((prev) =>
          prev.map((a) => (a.id === editingAd.id ? savedAd : a))
        );
      } else {
        // ➕ CREATE
        savedAd = await createAdvertisement(dto, token);
        setAds((prev) => [savedAd, ...prev]);
      }

      // reset
      setEditingAd(null);
      setText("");
      setLink("");
      setVideoFile(null);
      setVideoPreview("");
      setUploadProgress(0);

      // Telefon uchun avtomatik ro'yxatga o'tish
      if (window.innerWidth < 1024) {
        setActiveTab("list");
      }

      alert(editingAd ? "✅ Reklama yangilandi" : "✅ Reklama qo'shildi");
    } catch (err: any) {
      console.error("Xato:", err);
      alert(err.message || "Xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  // delete
  const deleteAd = async (id: string) => {
    if (!token) return alert("Token yo'q");

    if (!confirm("Rostdan o'chirmoqchimisiz?")) return;

    try {
      await deleteAdvertisement(id, token);
      setAds((prev) => prev.filter((a) => a.id !== id));
      alert("✅ Reklama o'chirildi");
    } catch (e) {
      console.error(e);
      alert("O'chirishda xato");
    }
  };

  // Video previewni tozalash
  const clearVideo = () => {
    setVideoFile(null);
    setVideoPreview("");
    if (videoPreview) URL.revokeObjectURL(videoPreview);
  };

  // Mobile navigation
  const MobileNav = () => (
    <div className="lg:hidden mb-6">
      <div className="flex bg-gray-800/50 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("list")}
          className={`flex-1 py-2 rounded-md text-center ${
            activeTab === "list" 
              ? "bg-purple-600/30 text-purple-300" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          📋 Reklamalar
        </button>
        <button
          onClick={() => setActiveTab("form")}
          className={`flex-1 py-2 rounded-md text-center ${
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

  // Form component
  const FormSection = () => (
    <div className="bg-gray-800/40 p-4 sm:p-6 rounded-xl border border-gray-700/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {editingAd ? (
            <Edit className="text-yellow-400" size={20} />
          ) : (
            <Plus className="text-green-400" size={20} />
          )}
          <h2 className="text-lg sm:text-xl font-bold">
            {editingAd ? "Reklamani tahrirlash" : "Yangi reklama qo'shish"}
          </h2>
        </div>
        {editingAd && (
          <button
            onClick={() => {
              setEditingAd(null);
              setText("");
              setLink("");
              clearVideo();
            }}
            className="p-1 hover:bg-gray-700/50 rounded"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <form onSubmit={createAd} className="space-y-4">
        {/* Matn input */}
        <div>
          <label className="flex items-center gap-2 text-sm text-gray-300 mb-1">
            <Type size={16} />
            Reklama matni
          </label>
          <input
            className="w-full bg-gray-700/50 border border-gray-600 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Reklama matni (ixtiyoriy)"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Link input */}
        <div>
          <label className="flex items-center gap-2 text-sm text-gray-300 mb-1">
            <Link size={16} />
            Havola (URL)
          </label>
          <input
            className="w-full bg-gray-700/50 border border-gray-600 px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="https://example.com"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>

        {/* Video upload */}
        <div>
          <label className="flex items-center gap-2 text-sm text-gray-300 mb-1">
            <Video size={16} />
            Video
          </label>
          <div className="space-y-3">
            <label className="border-2 border-dashed border-gray-500 hover:border-purple-500 p-4 sm:p-6 rounded-lg block text-center cursor-pointer transition-colors">
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleUpload}
              />
              <Upload className="mx-auto mb-2 text-gray-400" size={24} />
              <span className="text-gray-300">Video yuklash (max 10MB)</span>
              <p className="text-sm text-gray-500 mt-1">MP4, WebM, MOV</p>
            </label>

            {videoPreview && (
              <div className="relative">
                <video
                  src={videoPreview}
                  className="w-full h-40 sm:h-48 object-cover rounded-lg"
                  controls
                />
                <button
                  type="button"
                  onClick={clearVideo}
                  className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 p-1.5 rounded-full"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Yuklanmoqda...
              </>
            ) : editingAd ? (
              "💾 Saqlash"
            ) : (
              "➕ Qo'shish"
            )}
          </button>

          {(editingAd || window.innerWidth < 1024) && (
            <button
              type="button"
              onClick={() => {
                setEditingAd(null);
                setText("");
                setLink("");
                clearVideo();
                if (window.innerWidth < 1024) setActiveTab("list");
              }}
              className="px-6 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg"
            >
              Bekor qilish
            </button>
          )}
        </div>
      </form>
    </div>
  );

  // List component
  const ListSection = () => (
    <div className="bg-gray-800/40 p-4 sm:p-6 rounded-xl border border-gray-700/50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold">📋 Barcha reklamalar</h2>
        <span className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm">
          {ads.length} ta
        </span>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <Loader2 className="animate-spin mx-auto mb-3" size={32} />
          <p className="text-gray-400">Yuklanmoqda...</p>
        </div>
      ) : ads.length === 0 ? (
        <div className="text-center py-10 bg-gray-800/30 rounded-lg">
          <Film className="mx-auto mb-3 text-gray-500" size={48} />
          <p className="text-gray-400">Hozircha reklamalar mavjud emas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="bg-gray-700/30 hover:bg-gray-700/50 rounded-lg overflow-hidden border border-gray-600/30 transition-all"
            >
              {/* Video preview */}
              {ad.video && (
                <div className="relative">
                  <video
                    src={ad.video}
                    className="w-full h-40 object-cover"
                    controls
                  />
                  <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs">
                    Video
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-4">
                {ad.text && (
                  <p className="text-gray-300 mb-3 line-clamp-2">{ad.text}</p>
                )}
                
                {ad.link && (
                  <div className="flex items-center gap-2 mb-4">
                    <Link size={14} className="text-blue-400" />
                    <a
                      href={ad.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm truncate flex items-center gap-1"
                    >
                      {ad.link.replace(/^https?:\/\//, '')}
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(ad)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 py-2 rounded text-sm"
                  >
                    <Edit size={14} />
                    Tahrirlash
                  </button>
                  <button
                    onClick={() => deleteAd(ad.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 py-2 rounded text-sm"
                  >
                    <Trash2 size={14} />
                    O'chirish
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-2 rounded-lg">
                <Film className="text-purple-400" size={24} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Reklama Boshqaruvi
                </h1>
                <p className="text-gray-400 text-sm sm:text-base">
                  Reklamalarni qo'shish va tahrirlash
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <MobileNav />

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-1 gap-8">
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