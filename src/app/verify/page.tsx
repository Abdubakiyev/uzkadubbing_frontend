"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Login: React.FC = () => {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.length !== 6) {
      setAlertMsg('Iltimos, 6 xonali kodni kiriting!');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
        {/* HEADER QISMI - Orange gradient */}
        <div className="bg-gradient-to-r from-orange-400 to-red-500 p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <h2 className="text-3xl font-bold text-white drop-shadow-lg relative z-10">
            Kodni Tasdiqlash
          </h2>
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white dark:bg-gray-800 rotate-45 rounded-lg"></div>
        </div>

        {/* Ichki kontent */}
        <div className="p-8 pt-12">
          {/* Alert xabari - Orange theme */}
          {alertMsg && (
            <div className="mb-6 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 flex items-start justify-between animate-fade-in">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm">!</span>
                </div>
                <div>
                  <strong className="block text-sm font-semibold text-orange-800 dark:text-orange-300">Diqqat</strong>
                  <p className="text-sm text-orange-700 dark:text-orange-200 mt-1">{alertMsg}</p>
                </div>
              </div>
              <button
                onClick={() => setAlertMsg(null)}
                className="text-orange-500 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 ml-2 p-1 rounded-md transition-colors duration-200"
                aria-label="Close alert"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Tasdiqlash matni */}
          <div className="text-center mb-8">
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">
              Emailingizga yuborilgan 6 xonali kodni kiriting
            </p>
            <div className="flex items-center justify-center space-x-2 text-orange-500 dark:text-orange-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Gmail orqali yuborildi</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <label
                htmlFor="otp"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center"
              >
                6 xonali tasdiqlash kodi
              </label>
              <div className="relative">
                <input
                  id="otp"
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setOtp(value);
                  }}
                  className="w-full px-4 py-5 tracking-[0.5em] text-center text-2xl font-bold bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  placeholder="• • • • • •"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              
              {/* OTP raqamlarini ko'rsatish */}
              <div className="flex justify-center space-x-3 mt-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-bold transition-all duration-200 ${
                      otp.length > index
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-400'
                    }`}
                  >
                    {otp[index] || "•"}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={loading || otp.length !== 6}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Tekshirilmoqda...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Kodni Tasdiqlash</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          </form>

          {/* Qo'shimcha amallar */}
          <div className="mt-6 text-center space-y-3">
            <button
              type="button"
              className="text-orange-500 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 text-sm font-medium transition-colors duration-200"
            >
              Kod qayta yuborish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;