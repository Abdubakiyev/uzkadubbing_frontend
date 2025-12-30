import { Advertisement, CreateAdvertisementDto, UpdateAdvertisementDto } from "../types/Reklama";

const API_BASE = "https://uzkadubbing-back.onrender.com/advertisements";

// =================== TYPES ===================

// =================== GET ALL ===================
export const getAllAdvertisements = async (token?: string): Promise<Advertisement[]> => {
  const res = await fetch(API_BASE, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Failed to fetch advertisements");
  }

  return res.json();
};

// =================== GET ONE ===================
export const getAdvertisementById = async (id: string, token?: string): Promise<Advertisement> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Failed to fetch advertisement");
  }

  return res.json();
};

// =================== CREATE ===================
export const createAdvertisement = async (
  dto: CreateAdvertisementDto,
  token: string
): Promise<Advertisement> => {
  const res = await fetch(`${API_BASE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dto),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("Backend error:", data);
    throw new Error(data.message || "Failed to create advertisement");
  }

  return data;
};

// =================== UPDATE ===================
export const updateAdvertisement = async (
  id: string,
  dto: UpdateAdvertisementDto,
  token: string
): Promise<Advertisement> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dto),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("Backend error:", data);
    throw new Error(data.message || "Failed to update advertisement");
  }

  return data;
};

// =================== DELETE ===================
export const deleteAdvertisement = async (id: string, token: string): Promise<Advertisement> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("Backend error:", data);
    throw new Error(data.message || "Failed to delete advertisement");
  }

  return data;
};

// =================== UPLOAD VIDEO ===================
export const uploadAdvertisementVideo = async (file: File, token: string): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/upload-video`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    console.error("Backend error:", data);
    throw new Error(data.message || "Failed to upload video");
  }

  return data; // { url: "http://..." }
};
