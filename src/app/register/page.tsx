'use client';

import { registerApi } from '@/src/features/api/Auth';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Register: React.FC = () => {
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // ⭐ MAIN SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) return setAlertMsg('Email manzilingizni kiriting!');
    if (!password.trim()) return setAlertMsg('Parolni kiriting!');
    if (password.length < 6)
      return setAlertMsg('Parol kamida 6 ta belgidan iborat bo‘lishi kerak!');

    try {
      setLoading(true);

      // 🚀 BACKEND REGISTER API CALL
      const result = await registerApi(email, password);
      console.log("Backend javobi:", result);


      // 🔍 Backend javobida redirectTo bo'ladi: "/" yoki "/verify"
      const redirect = result.redirectTo;

      // 🟢 AGAR TOKENLAR KELGAN BO'LSA (user oldin ro'yxatdan o'tgan)
      if (typeof window !== "undefined" && result.tokens) {
        localStorage.setItem("access_token", result.tokens.accessToken);
        localStorage.setItem("refresh_token", result.tokens.refreshToken);
        console.log("Tokens saved to localStorage ✅");
      }
        

      // 🔵 AGAR VERIFY GA O'TISH KERAK BO'LSA — emailni query orqali uzatamiz
      if (redirect === "/verify") {
        router.push(`/verify?email=${email}`);
      } 
      // 🟢 AGAR "/" GA O'TISH KERAK BO'LSA
      else {
        router.push("/");
      }

    } catch (err: any) {
      setAlertMsg(err.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">

        <div className="bg-gradient-to-r from-orange-400 to-red-500 p-6 text-center relative">
          <h2 className="text-3xl font-bold text-white relative z-10">Ro'yxatdan o'tish</h2>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white dark:bg-gray-800 rotate-45 rounded-lg"></div>
        </div>

        <div className="p-8 pt-12">

          {alertMsg && (
            <div className="mb-6 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 flex justify-between">
              <div className="flex space-x-3">
                <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                  <span className="text-white text-sm">!</span>
                </div>
                <p className="text-sm text-orange-700 dark:text-orange-200">{alertMsg}</p>
              </div>
              <button
                onClick={() => setAlertMsg(null)}
                className="text-orange-500 hover:text-orange-700"
              >✕</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-semibold">Email manzilingiz</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 mt-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500"
                placeholder="example@email.com"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-semibold">Parolingiz</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:scale-105 transition disabled:opacity-50"
            >
              {loading ? "Yuklanmoqda..." : "Ro'yxatdan o'tish"}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default Register;
