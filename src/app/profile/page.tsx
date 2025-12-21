"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FiEdit2, FiLogOut, FiStar, FiUser, FiCreditCard, FiSettings, FiShield, FiCheck, FiClock } from "react-icons/fi";
import { FaCrown, FaGem, FaFire } from "react-icons/fa";
import { MdOutlineDashboard, MdOutlineCardMembership } from "react-icons/md";
import { useRouter } from "next/navigation";
import MainHeader from "@/src/components/MainHeader";
import { UserForm } from "@/src/features/types/User";
import { fetchMyProfile, uploadAvatar, updateUser } from "@/src/features/api/Users";
import { fetchPlans } from "@/src/features/api/Subscription-plan";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<"tariflar" | "tanlanganlar">("tariflar");
  const [user, setUser] = useState<UserForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [tariffs, setTariffs] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const router = useRouter();

  // USER LOAD
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/register");
      return;
    }

    const loadUser = async () => {
      try {
        const data = await fetchMyProfile();
        console.log("My profile:", data);
        setUser(data);
      } catch (err) {
        console.error(err);
        router.push("/register");
      }
    };

    const loadPlans = async () => {
      try {
        const plans = await fetchPlans();
        setTariffs(plans);
      } catch (err) {
        console.error(err);
      }
    };

    Promise.all([loadUser(), loadPlans()]).finally(() => setLoading(false));
  }, [router]);

  // AVATAR URL
  const getAvatarUrl = () => {
    if (!user?.avatar) return "/avatar-placeholder.png";
    return user.avatar.startsWith("http")
      ? user.avatar.trim()
      : `http://127.0.0.1:3000/uploads/avatars/${user.avatar}`.trim();
  };

  // Avatar upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !user) return;
    setAvatarUploading(true);
    try {
      const url = await uploadAvatar(user.id, e.target.files[0]);
      const updatedUser = await updateUser(user.id, { avatar: url });
      setUser(updatedUser);
    } catch (err: any) {
      console.error(err.message || err);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/register");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-transparent border-t-purple-500 border-r-amber-500 border-b-pink-500 rounded-full animate-spin mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FiUser className="text-white text-xl animate-pulse" />
            </div>
          </div>
          <p className="text-gray-300 text-lg mt-4 animate-pulse">Profil yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <MainHeader />

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        {/* Main Profile Card */}
        <div className="relative mb-8">
          {/* Background Blur */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-black/40 to-amber-900/20 rounded-3xl blur-xl opacity-50"></div>
          
          {/* Profile Card */}
          <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Avatar Section */}
              <div className="relative group">
                <div className="relative w-40 h-40 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-amber-600/30"></div>
                  <Image
                    src={getAvatarUrl()}
                    alt="Avatar"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  
                  {/* Premium Badge */}
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-full p-2 shadow-lg">
                    <FaCrown className="text-white text-lg" />
                  </div>
                  
                  {/* Upload Overlay */}
                  {avatarUploading ? (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <label
                      htmlFor="avatar-upload"
                      className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    >
                      <div className="text-center">
                        <FiEdit2 className="text-white text-2xl mx-auto mb-2" />
                        <span className="text-white text-sm font-medium">Rasmni o'zgartirish</span>
                      </div>
                    </label>
                  )}
                </div>
                <input type="file" id="avatar-upload" className="hidden" onChange={handleAvatarChange} />
                
                {/* Level Badge */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gray-800 to-black backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 shadow-lg">
                  <div className="flex items-center gap-2">
                    <FiStar className="text-yellow-400" />
                    <span className="text-white font-bold">Level 5</span>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent">
                        {user.username}
                      </h1>
                      <button
                        onClick={() => router.push("/create_profile")}
                        className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full border border-white/20 transition-all duration-300 hover:scale-110"
                      >
                        <FiEdit2 className="text-white text-lg" />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <FiUser className="text-purple-300" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Foydalanuvchi ID</p>
                          <p className="font-mono text-white">{user.id}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/20 rounded-lg">
                          <FaGem className="text-red-300" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Obuna holati</p>
                          <div className="flex items-center gap-3">
                            <span className="text-red-400 font-semibold flex items-center gap-2">
                              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
                              Aktiv emas
                            </span>
                            <span className="text-gray-500 text-sm">• 30 kun qoldi</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <FiClock className="text-green-300" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">A'zolik</p>
                          <p className="text-white">2024 yildan beri</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                      <div className="text-2xl font-bold text-purple-400">156</div>
                      <div className="text-gray-400 text-sm">Ko'rilgan</div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                      <div className="text-2xl font-bold text-amber-400">24</div>
                      <div className="text-gray-400 text-sm">Saqlangan</div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Profil to'liqligi</span>
                    <span className="text-amber-400 font-bold">75%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-600 to-amber-600 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="group flex items-center gap-3 bg-gradient-to-r from-red-900/30 to-red-800/20 hover:from-red-900/40 hover:to-red-800/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl border border-red-500/30 transition-all duration-300 hover:scale-105"
              >
                <FiLogOut className="text-red-400 group-hover:text-red-300" />
                <span>Chiqish</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex items-center gap-2 mb-8 bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
          <button
            onClick={() => setActiveTab("tariflar")}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "tariflar"
                ? "bg-gradient-to-r from-purple-600 to-amber-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <MdOutlineCardMembership className="text-lg" />
            <span>Tariflar</span>
            {activeTab === "tariflar" && (
              <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab("tanlanganlar")}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "tanlanganlar"
                ? "bg-gradient-to-r from-purple-600 to-amber-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <FiStar className="text-lg" />
            <span>Tanlanganlar</span>
          </button>
        </div>

        {/* Content Sections */}
        {activeTab === "tariflar" && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-3">Premium Tariflar</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                O'zingizga mos tarifni tanlang va cheklovlarsiz anime tomosha qiling
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tariffs.map((plan, index) => (
                <div
                  key={plan.id}
                  className={`relative group cursor-pointer transition-all duration-500 ${
                    selectedPlan === index ? 'scale-105' : 'hover:scale-105'
                  }`}
                  onClick={() => setSelectedPlan(index)}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                        <FaFire className="text-orange-200" />
                        <span>Eng Sotilgan</span>
                      </div>
                    </div>
                  )}
                  
                  <div className={`relative h-full rounded-2xl overflow-hidden ${
                    selectedPlan === index
                      ? 'bg-gradient-to-br from-purple-900/30 via-black/50 to-amber-900/30'
                      : 'bg-gradient-to-br from-gray-900/80 to-black/80'
                  } backdrop-blur-sm border ${
                    selectedPlan === index
                      ? 'border-purple-500/50 ring-2 ring-purple-500/20'
                      : plan.popular
                      ? 'border-amber-500/30'
                      : 'border-white/10'
                  } p-6`}>
                    {/* Selection Indicator */}
                    {selectedPlan === index && (
                      <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-r from-purple-500 to-amber-500 rounded-full flex items-center justify-center">
                        <FiCheck className="text-white text-sm" />
                      </div>
                    )}
                    
                    {/* Plan Header */}
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
                          {plan.price.toLocaleString()} so'm
                        </span>
                        <span className="text-gray-400 text-sm">/ oy</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                          <FiCheck className="text-green-400 text-sm" />
                        </div>
                        <span className="text-gray-300 text-sm">Cheksiz anime</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                          <FiCheck className="text-green-400 text-sm" />
                        </div>
                        <span className="text-gray-300 text-sm">4K sifat</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                          <FiCheck className="text-green-400 text-sm" />
                        </div>
                        <span className="text-gray-300 text-sm">Reklamasiz</span>
                      </div>
                      {plan.popular && (
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-amber-500/20 rounded-full flex items-center justify-center">
                            <FaGem className="text-amber-400 text-sm" />
                          </div>
                          <span className="text-amber-300 text-sm">Premium support</span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <a
                      href="https://t.me/kine_one"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                        plan.popular || selectedPlan === index
                          ? 'bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white shadow-lg'
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                      }`}
                    >
                      <FaCrown className="text-lg" />
                      <span>Obuna bo'lish</span>
                    </a>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison Table */}
            <div className="mt-12 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Tariflar Solishtirish</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 text-gray-400">Imkoniyatlar</th>
                      {tariffs.map((plan) => (
                        <th key={plan.id} className="text-center py-4 font-bold text-white">
                          {plan.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/10">
                      <td className="py-4 text-gray-300">Cheksiz ko'rish</td>
                      {tariffs.map((plan) => (
                        <td key={plan.id} className="text-center py-4">
                          <FiCheck className="text-green-400 inline-block text-lg" />
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-4 text-gray-300">4K sifat</td>
                      {tariffs.map((plan) => (
                        <td key={plan.id} className="text-center py-4">
                          {plan.popular ? (
                            <FiCheck className="text-green-400 inline-block text-lg" />
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tanlanganlar" && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500/10 to-amber-500/10 rounded-full flex items-center justify-center mb-6">
              <FiStar className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Tanlanganlar</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Hozircha tanlagan animelaringiz yo'q. Sevimli animelaringizni saqlash uchun "Saqlash" tugmasini bosing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}