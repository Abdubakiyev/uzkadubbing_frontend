import { Episode } from "../types/Episode";

const BASE_URL = "http://localhost:3000/episodes";

// 🇦🇿 Barcha episodes olish
export const getAllEpisodes = async (animeId?: string): Promise<Episode[]> => {
    // URLga query qo'shish
    const url = animeId ? `${BASE_URL}?animeId=${animeId}` : BASE_URL;
  
    const res = await fetch(url);
    if (!res.ok) throw new Error("Episodes fetch xatosi");
    
    return res.json();
  };
  
// 🇦🇿 Video upload qilish
export const uploadEpisodeVideo = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Video upload xatosi");
  }

  const data = await res.json();
  return data.url;
};

// 🇦🇿 Episode yaratish
export const createEpisodeApi = async (body: {
  title: string;
  episodeNumber: number;
  animeId: string;
  videoUrl: string;
}): Promise<Episode> => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Episode create xatosi");
  }

  return res.json();
};

// 🇦🇿 Episode o'chirish
export const deleteEpisodeApi = async (id: string) => {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Episode delete xatosi");
  }
  return res.json();
};

// 🇦🇿 Episode yangilash
export const updateEpisodeApi = async (id: string, body: {
  title?: string;
  episodeNumber?: number;
  animeId?: string;
  videoUrl?: string;
}): Promise<Episode> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Episode update xatosi");
  }

  return res.json();
};
