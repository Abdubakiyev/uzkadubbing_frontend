import { Anime } from "../types/Anime";

const BASE_URL = "https://uzkadubbingbackend-uzka.up.railway.app/anime";

// ----------------------------------------
// 🇦🇿 Barcha anime olish
// ----------------------------------------
export const getAllAnime = async (): Promise<Anime[]> => {
  const res = await fetch(BASE_URL);

  if (!res.ok) {
    throw new Error("Anime ro‘yxatini olishda xatolik");
  }

  return await res.json();
};

// ----------------------------------------
// 🇦🇿 ID bo‘yicha anime olish
// ----------------------------------------
export const getAnimeById = async (id: string, token?: string): Promise<Anime> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Anime topilmadi");
  }

  return res.json();
};

// ----------------------------------------
// 🇦🇿 Rasm yuklash
// ----------------------------------------
export const uploadAnimeImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const token = localStorage.getItem("access_token"); // yoki sizning auth saqlash joyingiz

  const res = await fetch(`${BASE_URL}/upload-image`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`, // token qo‘shish juda muhim
    },
  });

  if (!res.ok) {
    throw new Error("Rasm uploadda xatolik");
  }

  const data = await res.json();
  return data.url;
};

export const increaseAnimeView = async (id: string): Promise<Anime> => {
  const res = await fetch(`${BASE_URL}/${id}/view`);

  if (!res.ok) {
    throw new Error("Anime view oshirishda xatolik");
  }

  return await res.json();
};

// ----------------------------------------
// 🇦🇿 Yangi anime yaratish
// ----------------------------------------
export const createAnimeApi = async (body: any): Promise<Anime> => {
  const token = localStorage.getItem("access_token"); // yoki sizning auth saqlash joyingiz

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` // token qo‘shildi
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Anime yaratishda xatolik");
  }

  return await res.json();
};

// ----------------------------------------
// 🇦🇿 Anime o‘chirish
// ----------------------------------------
// 🇦🇿 Anime o‘chirish (DELETE)
export const deleteAnimeApi = async (id: string) => {
  const token = localStorage.getItem("access_token"); // tokenni olish

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`, // token qo‘shildi
    },
  });

  if (!res.ok) {
    throw new Error("Anime o‘chirishda xatolik");
  }

  return await res.json();
};

// 🇦🇿 Anime yangilash (PATCH)
export const updateAnimeApi = async (
  id: string,
  body: Partial<Anime>
): Promise<Anime> => {
  const token = localStorage.getItem("access_token"); // tokenni olish

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // token qo‘shildi
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Anime yangilashda xatolik");
  }

  return await res.json();
};

