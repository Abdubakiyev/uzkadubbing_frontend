import { Episode } from "../types/Episode";

const BASE_URL = "https://uzkadubbing.onrender.com/episodes";

// 🇦🇿 Token olish helper
const getToken = () => localStorage.getItem("access_token");

// 🇦🇿 Barcha episodes olish
export const getAllEpisodes = async (animeId?: string): Promise<Episode[]> => {
  const url = animeId ? `${BASE_URL}?animeId=${animeId}` : BASE_URL;
  const token = getToken();

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Episodes fetch xatosi");
  return res.json();
};

// 🇦🇿 Video upload qilish
export const uploadEpisodeVideo = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const token = getToken();

  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`, // token qo‘shildi
    },
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
  const token = getToken();

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
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
  const token = getToken();

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Episode delete xatosi");
  }

  return res.json();
};

// 🇦🇿 Episode yangilash
export const updateEpisodeApi = async (
  id: string,
  body: {
    title?: string;
    episodeNumber?: number;
    animeId?: string;
    videoUrl?: string;
  }
): Promise<Episode> => {
  const token = getToken();

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Episode update xatosi");
  }

  return res.json();
};
