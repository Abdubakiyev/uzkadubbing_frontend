const API_BASE = "http://localhost:3000/advertisements";

// =================== GET ALL ===================
export const getAllAdvertisements = async () => {
    const token = localStorage.getItem("access_token"); // token olamiz
    const res = await fetch(API_BASE, {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    });
  
    if (!res.ok) throw new Error("Failed to fetch advertisements");
    return res.json();
};

// =================== GET ONE ===================
export const getAdvertisementById = async (id: string) => {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch advertisement");
  return res.json();
};

// =================== CREATE ===================
export type CreateAdvertisementDto = {
  text?: string;
  link?: string;
  video?: string;
};

export const createAdvertisement = async (
    dto: CreateAdvertisementDto,
    token: string,
  ) => {
    const res = await fetch(`${API_BASE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });
  
    const data = await res.json();
  
    // 🔥 HAQIQIY XATONI KO‘RSATADI
    if (!res.ok) {
      console.error("Backend error:", data);
      throw new Error(data.message || "Failed to create advertisement");
    }
  
    return data;
  };
  
// =================== UPDATE ===================
export type UpdateAdvertisementDto = {
  text?: string;
  link?: string;
  video?: string;
};

export const updateAdvertisement = async (
  id: string,
  dto: UpdateAdvertisementDto,
  token: string
) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Failed to update advertisement");
  return res.json();
};

// =================== DELETE ===================
export const deleteAdvertisement = async (id: string, token: string) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to delete advertisement");
  return res.json();
};

// =================== UPLOAD VIDEO ===================
export const uploadAdvertisementVideo = async (file: File, token: string) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/upload-video`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to upload video");
  return res.json(); // { url: "http://..." }
};
