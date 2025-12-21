"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiUser, FiUpload, FiSave, FiArrowLeft, FiMail, FiEdit2, FiCamera } from "react-icons/fi";
import { FaCrown, FaCheckCircle } from "react-icons/fa";
import { UserForm } from "@/src/features/types/User";
import { getUserById, updateUser, uploadAvatar } from "@/src/features/api/Users";

// Update uchun type
type UpdateUserPayload = {
  firstName?: string;
  lastName?: string;
  username?: string;
  avatar?: string | null;
  role?: "USER" | "ADMIN";
  isSubscribed?: boolean;
  isVerify?: boolean;
};

const UpdateProfile: React.FC = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<UserForm | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // ============================
  // USER DATA LOAD
  // ============================
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) return console.warn("LocalStorage da user_id topilmadi");

        const freshUser = await getUserById(userId);
        if (!freshUser) return console.warn("Backenddan foydalanuvchi topilmadi");

        setUser(freshUser);
        setFirstName(freshUser.firstName || "");
        setLastName(freshUser.lastName || "");
        setUsername(freshUser.username || "");
        setEmail(freshUser.email || "");
        setAvatarPreview(freshUser.avatar || null);
      } catch (error) {
        console.error("Foydalanuvchi olishda xato:", error);
      }
    };

    loadUser();
  }, []);

  // ============================
  // AVATAR TANLASH
  // ============================
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setUploading(true);
      
      // Preview yaratish
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // ============================
  // SUBMIT (UPDATE ONLY)
  // ============================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return alert("Foydalanuvchi hali yuklanmadi");
    if (!firstName || !lastName || !username) return alert("Barcha maydonlarni to'ldiring!");

    setLoading(true);
    setSaveSuccess(false);

    try {
      let avatarUrl = avatarPreview;

      if (avatarFile) {
        avatarUrl = await uploadAvatar(user.id, avatarFile);
      }

      const payload: UpdateUserPayload = {
        firstName,
        lastName,
        username,
        avatar: avatarUrl,
      };

      const updatedUser = await updateUser(user.id, payload);
      setUser(updatedUser);
      
      // Success state
      setSaveSuccess(true);
      setTimeout(() => {
        router.push("/profile");
      }, 1500);

    } catch (error) {
      console.error("Update xatolik:", error);
      alert("Xatolik yuz berdi");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => router.push("/profile")}
          className="group flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/20 transition-all duration-300 hover:scale-105"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span>Profilga qaytish</span>
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600/20 to-amber-600/20 rounded-3xl mb-6 border border-white/10">
              <FiEdit2 className="text-white text-3xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent mb-3">
              Profilni Yangilash
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Shaxsiy ma'lumotlaringizni yangilang va profilingizni shaxsiylashtiring
            </p>
          </div>

          {/* Main Card */}
          <div className="relative group">
            {/* Card Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-40 transition duration-1000"></div>
            
            <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Avatar Section */}
                <div className="lg:col-span-1">
                  <div className="sticky top-8">
                    {/* Avatar Container */}
                    <div className="relative group/avatar mb-6">
                      <div className="relative w-48 h-48 mx-auto rounded-2xl overflow-hidden border-4 border-transparent bg-gradient-to-br from-purple-600/30 to-amber-600/30 p-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-amber-600 rounded-2xl blur-sm opacity-50"></div>
                        <div className="relative w-full h-full bg-black rounded-xl overflow-hidden">
                          <Image
                            src={avatarPreview || "/default-avatar.png"}
                            alt="Avatar Preview"
                            fill
                            className="object-cover"
                            sizes="(max-width: 192px) 100vw, 192px"
                          />
                          
                          {uploading && (
                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            </div>
                          )}
                        </div>
                        
                        {/* Camera Button */}
                        <button
                          type="button"
                          onClick={triggerFileInput}
                          className="absolute bottom-3 right-3 w-12 h-12 bg-gradient-to-r from-purple-600 to-amber-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg"
                        >
                          <FiCamera className="text-white text-xl" />
                        </button>
                      </div>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                      
                      <div className="text-center mt-4">
                        <p className="text-gray-400 text-sm mb-2">JPG, PNG yoki WEBP</p>
                        <p className="text-xs text-gray-500">Max: 5MB</p>
                      </div>
                    </div>

                    {/* User Stats */}
                    <div className="space-y-4">
                      <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Status</span>
                          <span className="flex items-center gap-2 text-green-400">
                            <FaCheckCircle />
                            <span>Aktiv</span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-black/30 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">A'zolik</span>
                          <span className="text-amber-400 font-medium">Premium</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Form Section */}
                <div className="lg:col-span-2">
                  {saveSuccess && (
                    <div className="mb-6 bg-gradient-to-r from-green-900/30 to-emerald-900/30 backdrop-blur-sm rounded-xl p-4 border border-green-500/30 animate-fadeIn">
                      <div className="flex items-center gap-3">
                        <FaCheckCircle className="text-green-400 text-xl" />
                        <div className="flex-1">
                          <p className="text-green-300 font-medium">Profil muvaffaqiyatli yangilandi!</p>
                          <p className="text-green-400/80 text-sm">Siz profil sahifasiga yo'naltirilmoqdasiz...</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Fields Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* First Name */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          <FiUser className="text-gray-400" />
                          Ism
                        </label>
                        <div className="relative group/input">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-amber-600/0 rounded-xl opacity-0 group-hover/input:opacity-100 transition duration-300"></div>
                          <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="relative w-full px-4 py-4 bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 transition-colors duration-300"
                            placeholder="Ismingizni kiriting"
                            required
                          />
                        </div>
                      </div>

                      {/* Last Name */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                          <FiUser className="text-gray-400" />
                          Familiya
                        </label>
                        <div className="relative group/input">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-amber-600/0 rounded-xl opacity-0 group-hover/input:opacity-100 transition duration-300"></div>
                          <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="relative w-full px-4 py-4 bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 transition-colors duration-300"
                            placeholder="Familiyangizni kiriting"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <FiUser className="text-gray-400" />
                        Username
                      </label>
                      <div className="relative group/input">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-amber-600/0 rounded-xl opacity-0 group-hover/input:opacity-100 transition duration-300"></div>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="relative w-full px-4 py-4 bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 transition-colors duration-300"
                          placeholder="Foydalanuvchi nomi"
                          required
                        />
                      </div>
                    </div>

                    {/* Email (Readonly) */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        <FiMail className="text-gray-400" />
                        Email
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          readOnly
                          className="w-full px-4 py-4 bg-gray-900/50 border border-gray-700 rounded-xl text-gray-400 cursor-not-allowed"
                          placeholder="Email manzilingiz"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                          <FiUser />
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">Email o'zgartirish uchun support bilan bog'laning</p>
                    </div>

                    {/* Additional Info Section */}
                    <div className="bg-black/30 rounded-xl p-6 border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-4">Qo'shimcha ma'lumotlar</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-400">Foydalanuvchi ID</p>
                          <p className="font-mono text-white text-sm truncate">{user?.id || "N/A"}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-400">Roli</p>
                          <div className="flex items-center gap-2">
                            <FaCrown className="text-amber-400" />
                            <span className="text-white">{user?.role || "USER"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading || !user}
                      className="group/btn relative w-full overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 hover:from-purple-700 hover:via-pink-700 hover:to-amber-700 text-white font-bold py-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                      <div className="relative z-10 flex items-center justify-center gap-3">
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Saqlanmoqda...</span>
                          </>
                        ) : (
                          <>
                            <FiSave />
                            <span>Profilni Yangilash</span>
                          </>
                        )}
                      </div>
                    </button>
                  </form>

                  {/* Tips */}
                  <div className="mt-8 p-4 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-xl border border-blue-500/30">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FiUser className="text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Maslahat</p>
                        <p className="text-sm text-blue-300">
                          Haqiqiy ism va familiyangizni kiriting - bu sizning profil va foydalanuvchilar 
                          orasida aniqlikni oshirishga yordam beradi.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="fixed top-20 right-20 w-3 h-3 bg-purple-500 rounded-full opacity-30 animate-ping"></div>
          <div className="fixed bottom-20 left-20 w-4 h-4 bg-amber-500 rounded-full opacity-20 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;