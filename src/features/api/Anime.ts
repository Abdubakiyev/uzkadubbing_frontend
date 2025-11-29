import { Anime } from "../types/Anime";

const BASE_URL = "http://localhost:3000/anime";

// 🇦🇿 Barcha anime olish
export const getAllAnime = async (): Promise<Anime[]> => {
  const res = await fetch(BASE_URL);
  return await res.json();
};

export const getAnimeById = async (id: string): Promise<Anime> => {
    console.log("Fetching anime with id:", id);
    const res = await fetch(`${BASE_URL}/${id}`);
    console.log("Response status:", res.status);
    if (!res.ok) throw new Error("Anime topilmadi");
    console.log("Anime data:", res);
    return await res.json();
  };

// 🇦🇿 Rasm upload qilish
export const uploadAnimeImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/upload-image`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data.url;
};

// 🇦🇿 Yangi anime yaratish
export const createAnimeApi = async (body: any): Promise<Anime> => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return await res.json();
};

// 🇦🇿 Anime o‘chirish
export const deleteAnimeApi = async (id: string) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  return await res.json();
};
// 🇦🇿 Anime yangilash (UPDATE)
export const updateAnimeApi = async (
    id: string,
    body: Partial<Anime>
  ): Promise<Anime> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  
    if (!res.ok) {
      throw new Error("Anime yangilashda xatolik");
    }
  
    return await res.json();
  };
  
