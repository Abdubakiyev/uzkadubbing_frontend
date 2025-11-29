const BASE_URL = "http://localhost:3000/auth";

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

// ------------------------------------------------------------
// 🇦🇿 Verify (code tekshirish va token qaytarish)
// ------------------------------------------------------------
export const verifyAuth = async (email: string, code: string) => {
    const res = await fetch(`${BASE_URL}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
  
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Tasdiqlashda xatolik");
    }
  
    return await res.json();
};
export const resendCode = async (email: string) => {
    return request(`${BASE_URL}/resend`, {
      method: "POST",
      body: JSON.stringify({ email }),
    });
};
