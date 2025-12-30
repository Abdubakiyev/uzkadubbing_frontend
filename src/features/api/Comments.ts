import { Comment, CreateCommentDto, UpdateCommentDto } from "../types/Comment";

// 🔹 Backend URLingiz
const BASE_URL = "https://uzkadubbing.onrender.com/comments";

// 🇦🇿 Barcha animega oid commentlarni olish
export const getCommentsByAnimeId = async (
  animeId: string,
  episodeId?: string,  // optional
  token?: string
): Promise<Comment[]> => {
  try {
    const url = new URL(`${BASE_URL}/anime/${animeId}`);
    if (episodeId) url.searchParams.append("episodeId", episodeId);

    const res = await fetch(url.toString(), {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Server javobi:", text);
      throw new Error("Commentlar olishda xatolik yuz berdi");
    }

    const data: Comment[] = await res.json();
    return data;
  } catch (error) {
    console.error("Comments fetch xatosi:", error);
    throw new Error("Commentlar olishda xatolik yuz berdi");
  }
};  
// 🇦🇿 Comment yaratish
export const createComment = async (dto: CreateCommentDto, token: string): Promise<Comment> => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });

    const data = await res.json(); // Server javobini olish

    if (!res.ok) {
      console.error("Server xatosi:", data); // Xatoni log qilamiz
      throw new Error("Comment yaratishda xatolik yuz berdi: " + JSON.stringify(data));
    }

    return data;
  } catch (error) {
    console.error("createComment xatosi:", error);
    throw error;
  }
};


// 🇦🇿 Comment update qilish (faqat o‘z comment)
export const updateComment = async (
  id: string,
  dto: UpdateCommentDto,
  token: string
): Promise<Comment> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dto),
  });

  if (!res.ok) throw new Error("Commentni yangilashda xatolik yuz berdi");
  return res.json();
};

// 🇦🇿 Comment o‘chirish (faqat o‘z comment)
export const deleteComment = async (id: string, token: string): Promise<Comment> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Commentni o‘chirishda xatolik yuz berdi");
  return res.json();
};
