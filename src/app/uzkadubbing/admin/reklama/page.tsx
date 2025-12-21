"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/src/components/AdminSideber";
import { Film, Upload, Plus } from "lucide-react";

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
  };

  // create + update
  const createAd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!token) {
      alert("Token yo‘q, qayta login qiling");
      setIsSubmitting(false);
      return;
    }

    try {
      let videoUrl = editingAd?.video || "";

      // video yuklash
      if (videoFile) {
        const uploaded = await uploadAdvertisementVideo(videoFile, token);
        videoUrl = uploaded.url;
      }

      const dto: CreateAdvertisementDto = {};
      if (text.trim()) dto.text = text.trim();
      if (link.trim()) dto.link = link.trim(); // ⚠️ to‘liq URL bo‘lishi shart
      if (videoUrl) dto.video = videoUrl;

      console.log("Yuborilayotgan DTO:", dto);

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

      alert(editingAd ? "Reklama yangilandi" : "Reklama qo‘shildi");
    } catch (err: any) {
      console.error("Xato:", err);
      alert(err.message || "Xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  // delete
  const deleteAd = async (id: string) => {
    if (!token) return alert("Token yo‘q");

    if (!confirm("Rostdan o‘chirmoqchimisiz?")) return;

    try {
      await deleteAdvertisement(id, token);
      setAds((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      console.error(e);
      alert("O‘chirishda xato");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Film className="text-purple-400" size={32} />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Reklama Boshqaruvi
              </h1>
            </div>
            <p className="text-gray-400">Reklamalarni qo‘shish va tahrirlash</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* FORM */}
            <div>
              <div className="bg-gray-800/40 p-6 rounded-xl border border-gray-700/50">
                <div className="flex items-center gap-2 mb-4">
                  <Plus className="text-green-400" />
                  <h2 className="text-xl font-bold">
                    {editingAd ? "Reklamani tahrirlash" : "Yangi reklama"}
                  </h2>
                </div>

                <form onSubmit={createAd} className="space-y-4">
                  <input
                    className="w-full bg-gray-700 px-3 py-2 rounded"
                    placeholder="Reklama matni"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />

                  <input
                    className="w-full bg-gray-700 px-3 py-2 rounded"
                    placeholder="https://example.com"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                  />

                  <label className="border-2 border-dashed border-gray-500 p-4 rounded block text-center cursor-pointer">
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleUpload}
                    />
                    <Upload className="mx-auto mb-1" />
                    {videoPreview ? "Video tanlandi" : "Video tanlang"}
                  </label>

                  {videoPreview && (
                    <video
                      src={videoPreview}
                      className="w-full h-32 object-cover rounded"
                      controls
                    />
                  )}

                  <button
                    className="w-full bg-purple-600 py-2 rounded disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Yuklanmoqda..."
                      : editingAd
                      ? "Saqlash"
                      : "Qo‘shish"}
                  </button>

                  {editingAd && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAd(null);
                        setText("");
                        setLink("");
                        setVideoFile(null);
                        setVideoPreview("");
                      }}
                      className="w-full bg-gray-600/30 py-2 rounded"
                    >
                      Bekor qilish
                    </button>
                  )}
                </form>
              </div>
            </div>

            {/* LIST */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/40 p-6 rounded-xl border border-gray-700/50">
                <h2 className="text-xl font-bold mb-4">Barcha reklamalar</h2>

                {loading ? (
                  <div className="text-center py-10">Yuklanmoqda...</div>
                ) : (
                  <div className="space-y-4">
                    {ads.map((ad) => (
                      <div
                        key={ad.id}
                        className="bg-gray-700/30 p-4 rounded flex gap-4"
                      >
                        <div className="flex-1">
                          {ad.video && (
                            <video
                              src={ad.video}
                              className="w-full h-32 object-cover rounded"
                              controls
                            />
                          )}
                          {ad.text && <p className="mt-2">{ad.text}</p>}
                          {ad.link && (
                            <a
                              href={ad.link}
                              target="_blank"
                              className="text-blue-400 underline"
                            >
                              {ad.link}
                            </a>
                          )}

                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => startEdit(ad)}
                              className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded"
                            >
                              Tahrirlash
                            </button>

                            <button
                              onClick={() => deleteAd(ad.id)}
                              className="px-3 py-1 bg-red-600/20 text-red-300 rounded"
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
