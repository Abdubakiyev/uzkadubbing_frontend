'use client';

import { registerApi } from '@/src/features/api/Auth';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiArrowRight, FiAlertCircle } from 'react-icons/fi';
import { FaFire, FaCrown } from 'react-icons/fa';

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
      return setAlertMsg('Parol kamida 6 ta belgidan iborat bo\'lishi kerak!');

    try {
      setLoading(true);

      // 🚀 Backendga register request
      const result = await registerApi(email, password);

      // 🔹 USER ID va TOKEN saqlash
      if (result.userId) {
        localStorage.setItem("user_id", result.userId);
      }

      if (result.tokens) {
        localStorage.setItem("access_token", result.tokens.accessToken);
        localStorage.setItem("refresh_token", result.tokens.refreshToken);
      }

      // 🔹 Redirect backenddan kelgan redirectTo ga
      if (result.redirectTo) {
        router.push(result.redirectTo);
      } else {
        router.push("/");
      }

    } catch (err: any) {
      setAlertMsg(err.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900/30 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-600/5 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 animate-bounce">
        <div className="w-4 h-4 bg-purple-500 rounded-full opacity-50"></div>
      </div>
      <div className="absolute bottom-20 right-10 animate-pulse">
        <div className="w-6 h-6 bg-amber-500 rounded-full opacity-30"></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center min-h-screen px-4 py-8">
        {/* Left Side - Welcome Section */}
        <div className="lg:w-1/2 max-w-xl lg:pr-16 mb-12 lg:mb-0">
          <div className="space-y-8">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-amber-600 rounded-2xl flex items-center justify-center">
                <FaCrown className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                  AnimeStream
                </h1>
                <p className="text-gray-400 text-sm">Premium Anime Platform</p>
              </div>
            </div>

            {/* Hero Text */}
            <div className="space-y-4">
              <h2 className="text-5xl font-bold leading-tight">
                Dastlabki qadamni{' '}
                <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
                  hozir qo'ying
                </span>
              </h2>
              <p className="text-gray-400 text-lg">
                Dunyoning eng yaxshi animelariga cheksiz kirish. Premium kontent, yuqori sifat va shaxsiy rejalar.
              </p>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600/20 to-purple-800/20 rounded-lg flex items-center justify-center">
                  <FiUser className="text-purple-300" />
                </div>
                <span className="font-medium">Shaxsiy profil</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-600/20 to-yellow-800/20 rounded-lg flex items-center justify-center">
                  <FaFire className="text-amber-300" />
                </div>
                <span className="font-medium">Trending kontent</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600/20 to-emerald-800/20 rounded-lg flex items-center justify-center">
                  <FiEye className="text-green-300" />
                </div>
                <span className="font-medium">Cheksiz ko'rish</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="w-10 h-10 bg-gradient-to-r from-pink-600/20 to-rose-800/20 rounded-lg flex items-center justify-center">
                  <FiLock className="text-pink-300" />
                </div>
                <span className="font-medium">Xavfsiz</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="lg:w-1/2 max-w-md w-full">
          <div className="relative group">
            {/* Card Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-40 transition duration-1000"></div>
            
            {/* Main Card */}
            <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              {/* Card Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-amber-600 rounded-2xl mb-4">
                  <FiUser className="text-white text-2xl" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent">
                  Ro'yxatdan o'tish
                </h2>
                <p className="text-gray-400 mt-2">
                  Hisobingizni yarating va animelar olamiga sho'ng'ing
                </p>
              </div>

              {/* Alert Message */}
              {alertMsg && (
                <div className="mb-6 bg-gradient-to-r from-orange-900/30 to-red-900/30 backdrop-blur-sm rounded-xl p-4 border border-orange-500/30">
                  <div className="flex items-start gap-3">
                    <FiAlertCircle className="text-orange-400 text-xl flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-orange-300 text-sm">{alertMsg}</p>
                    </div>
                    <button
                      onClick={() => setAlertMsg(null)}
                      className="text-orange-400 hover:text-orange-300 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <FiMail className="text-gray-400" />
                    Email manzilingiz
                  </label>
                  <div className="relative group/input">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-amber-600/0 rounded-xl opacity-0 group-hover/input:opacity-100 transition duration-300"></div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="relative w-full px-4 py-4 bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 transition-colors duration-300 placeholder-gray-500"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    <FiLock className="text-gray-400" />
                    Parolingiz
                  </label>
                  <div className="relative group/input">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-amber-600/0 rounded-xl opacity-0 group-hover/input:opacity-100 transition duration-300"></div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="relative w-full px-4 py-4 bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 transition-colors duration-300 placeholder-gray-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">Kamida 6 ta belgi</p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group/btn relative w-full overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 hover:from-purple-700 hover:via-pink-700 hover:to-amber-700 text-white font-bold py-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Yuklanmoqda...</span>
                      </>
                    ) : (
                      <>
                        <span>Ro'yxatdan o'tish</span>
                        <FiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                  </div>
                </div>

                {/* Login Link */}
              </form>

              {/* Terms & Privacy */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-xs text-gray-500 text-center">
                  Ro'yxatdan o'tish orqali siz{' '}
                  <button className="text-gray-400 hover:text-gray-300 transition-colors">
                    Foydalanish shartlari
                  </button>{' '}
                  va{' '}
                  <button className="text-gray-400 hover:text-gray-300 transition-colors">
                    Maxfiylik siyosati
                  </button>{' '}
                  bilan rozilik bildirasiz
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">10K+</div>
              <div className="text-gray-400 text-sm">Foydalanuvchi</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-gray-400 text-sm">Anime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-gray-400 text-sm">Qo'llab-quvvat</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;