const BASE_URL = "https://uzkadubbing-back.onrender.com/auth";

// ⭐ Helper — fetch + JSON
async function request(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Xatolik yuz berdi");
  }

  return data;
}

// ------------------------------------------------------------
// 🇦🇿 Register (emailga code yuborish)
// ------------------------------------------------------------
export const registerApi = async (email: string, password: string, role?: string) => {
  return request(`${BASE_URL}/register`, {
    method: "POST",
    body: JSON.stringify({ email, password, role }),
  });
};

