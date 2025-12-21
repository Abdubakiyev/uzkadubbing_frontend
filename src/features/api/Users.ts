import { jwtDecode } from "jwt-decode";
import { UserForm } from "../types/User";

const BASE_URL = "http://localhost:3000/users";

// Token payload interface
interface TokenPayload {
  sub: string; // userId
  role: string;
}

// Helper: localStorage dan tokenni olish
const getToken = (): string => {
  const token = localStorage.getItem("access_token");
  if (!token) throw new Error("Unauthorized: token topilmadi");
  return token;
};

// 1️⃣ Hozirgi user ma'lumotlarini olish (token asosida)
export const fetchMyProfile = async (): Promise<UserForm> => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Token topilmadi");
  
    if (token.split(".").length !== 3) throw new Error("Token noto‘g‘ri formatda");
  
    const payload = jwtDecode<TokenPayload>(token);
    const userId = payload.sub;
  
    const res = await fetch(`${BASE_URL}/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
  
    const data = await res.json();
  
    if (!res.ok) throw new Error(data?.message || "Foydalanuvchi ma'lumotini olishda xatolik");
  
    return data;
};

// 2️⃣ Barcha foydalanuvchilarni olish (admin uchun)
export const fetchUsers = async (): Promise<UserForm[]> => {
  const token = getToken();

  const res = await fetch(BASE_URL, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) throw new Error(data?.message || "Foydalanuvchilarni olishda xatolik");

  return data;
};

// 3️⃣ Foydalanuvchi yaratish (email va password shart emas)
export const createUser = async (body: {
    username?: string | null;
    avatar?: string | null;
    email?: string | null;
    role: string;
    password?: string | null;
    isSubscribed?: boolean;
    isVerify?: boolean;
  }): Promise<UserForm> => {
    const token = getToken();
  
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  
    let data;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  
    if (!res.ok) throw new Error(data?.message || "Foydalanuvchi yaratishda xatolik");
  
    return data;
  };
  
  // 4️⃣ Foydalanuvchini yangilash (email va password shart emas)
  export const updateUser = async (
    id: string,
    body: Partial<{
      username?: string | null;
      email?: string | null;
      avatar?: string | null;
      role?: string;
      isSubscribed?: boolean;
      isVerify?: boolean;
    }>
  ): Promise<UserForm> => {
    const token = getToken();
  
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  
    let data;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  
    if (!res.ok) throw new Error(data?.message || "Foydalanuvchi yangilashda xatolik");
  
    return data;
  };  

// 5️⃣ Foydalanuvchini o'chirish
export const deleteUser = async (id: string): Promise<void> => {
  const token = getToken();

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    let data;
    try { data = await res.json(); } catch { data = null; }
    throw new Error(data?.message || "Foydalanuvchini o'chirishda xatolik");
  }
};

// 6️⃣ Avatar upload
export const uploadAvatar = async (userId: string, file: File): Promise<string> => {
    const token = getToken();
    const formData = new FormData();
    formData.append("avatar", file);
  
    const res = await fetch(`${BASE_URL}/${userId}/avatar`, { // ⚠️ ID qo‘shildi
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });
  
    let data;
    try { data = await res.json(); } catch { data = null; }
  
    if (!res.ok) throw new Error(data?.message || "Avatar upload xatosi");
  
    return data.url; // serverdan qaytgan avatar URL
};
  // 7️⃣ ID bo‘yicha userni olish
  export const getUserById = async (id: string): Promise<UserForm> => {
    const token = getToken();
  
    const res = await fetch(`${BASE_URL}/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
  
    let data: any;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  
    if (!res.ok || !data) {
      throw new Error(data?.message || "Foydalanuvchini olishda xatolik");
    }
  
    return data as UserForm; // ✅ TypeScriptga UserForm ekanligini bildiradi
};
  
  