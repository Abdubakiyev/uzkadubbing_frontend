"use client";

import { verifyAuth, resendCode } from "@/src/features/api/Auth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

const VerifyPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // Emailni olish va tekshirish
  useEffect(() => {
    const queryEmail = searchParams.get("email");
    const savedEmail = localStorage.getItem("verify_email");
    const finalEmail = queryEmail || savedEmail;

    if (!finalEmail) {
      setAlertMsg("Email topilmadi. Iltimos, qayta ro‘yxatdan o‘ting.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(finalEmail)) {
      setAlertMsg("Email noto‘g‘ri formatda!");
      return;
    }

    setEmail(finalEmail);
  }, [searchParams]);

  // Kodni tekshirish
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim().length !== 6) {
      setAlertMsg("Iltimos, 6 xonali kodni kiriting!");
      return;
    }

    setLoading(true);
    setAlertMsg(null);

    try {
      const data = await verifyAuth(email, otp);

      // Tokenlarni saqlash
      localStorage.setItem("access_token", data.tokens.accessToken);
      localStorage.setItem("refresh_token", data.tokens.refreshToken);

      router.push(data.redirectTo);
    } catch (error: any) {
      // 🔹 error object bo‘lsa message chiqaramiz
      if (error?.message) setAlertMsg(error.message);
      else setAlertMsg("Kod tasdiqlashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  // Kodni qayta yuborish
  const handleResend = async () => {
    if (!email) return;

    setResendLoading(true);
    setAlertMsg(null);

    try {
      const message = await resendCode(email);
      setAlertMsg(typeof message === "string" ? message : JSON.stringify(message));
    } catch (error: any) {
      setAlertMsg(error?.message || "Kodni qayta yuborishda xatolik");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-orange-400 to-red-500 p-6 text-center">
          <h2 className="text-3xl font-bold text-white">Kod Tasdiqlash</h2>
        </div>

        <div className="p-8">
          {/* Alert */}
          {alertMsg && (
            <div className="mb-6 p-4 rounded-xl bg-orange-50 border border-orange-300 text-orange-700">
              {alertMsg}
            </div>
          )}

          {/* Email ko‘rsatiladi */}
          <div className="text-center mb-6">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Emailga yuborilgan 6 xonali kodni kiriting
            </p>
            {email && <p className="text-sm text-gray-400 mt-1">Email: {email}</p>}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <input
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full px-4 py-5 text-center text-2xl font-bold bg-gray-50 dark:bg-gray-700 border rounded-xl mb-4"
              placeholder="••••••"
            />

            <button
              type="submit"
              disabled={loading || otp.trim().length !== 6}
              className="w-full py-4 mb-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Tekshirilmoqda..." : "Kodni Tasdiqlash"}
            </button>
          </form>

          {/* Qayta yuborish */}
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="w-full py-3 text-center bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendLoading ? "Yuborilmoqda..." : "Kodni Qayta Yuborish"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
