'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Register: React.FC = () => {
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setAlertMsg('Email manzilingizni kiriting!');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/verify');
    }, 1500);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
        {/* HEADER QISMI - Orange gradient */}
        <div className="bg-gradient-to-r from-orange-400 to-red-500 p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <h2 className="text-3xl font-bold text-white drop-shadow-lg relative z-10">
            Ro'yxatdan o'tish
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Email manzilingiz
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  placeholder="example@email.com"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Yuklanmoqda...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Ro'yxatdan o'tish</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </button>
          </form>

          {/* Qo'shimcha info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ro'yxatdan o'tish orqali siz{' '}
              <span className="text-orange-500 dark:text-orange-400 font-semibold">shartlar</span> 
              ga rozilik bildirasiz
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;