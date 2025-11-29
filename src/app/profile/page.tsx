"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FiEdit2, FiLogOut, FiStar } from "react-icons/fi";
import { useRouter } from "next/navigation";
import MainHeader from "@/src/components/MainHeader";
import { UserForm } from "@/src/features/types/User";
import { fetchMyProfile, uploadAvatar, updateUser, fetchUsers } from "@/src/features/api/Users";
import { fetchPlans } from "@/src/features/api/Subscription-plan";
import { jwtDecode } from "jwt-decode";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<"tariflar" | "tanlanganlar">("tariflar");
  const [user, setUser] = useState<UserForm | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [tariffs, setTariffs] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/register");
      return;
    }

    const loadUser = async () => {
      try {
        // Misol: barcha foydalanuvchilarni olish
        const users = await fetchUsers();
        
        // Agar faqat hozirgi user kerak bo‘lsa, token sub bilan match qilamiz
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("Token topilmadi");
    
        const payload = jwtDecode<{ sub: string }>(token);
        const currentUser = users.find(u => u.id === payload.sub);
    
        if (!currentUser) throw new Error("User topilmadi");
    
        console.log("Current user:", currentUser);
        setUser(currentUser);
      } catch (err: any) {
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

  // ✅ Avatar upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !user) return;
    setAvatarUploading(true);

    try {
      // 1️⃣ User ID bilan avatarni upload qilamiz
      const url = await uploadAvatar(user.id, e.target.files[0]);

      // 2️⃣ User object ni yangilaymiz
      const updatedUser = await updateUser(user.id, { avatar: url });
      setUser(updatedUser);
    } catch (err: any) {
      console.error(err.message || err);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/register");
  };

  if (loading || !user) return <p className="text-center mt-10 text-white">Loading...</p>;

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white">
      <MainHeader />
      <div className="max-w-5xl mx-auto mt-20">

        {/* USER PANEL */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-2xl rounded-2xl p-8 flex items-center gap-8 relative border border-gray-700">
          
          {/* Avatar */}
          <div className="relative group">
            <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center relative overflow-hidden">
              {user.avatar ? (
                <Image src={user.avatar} alt="Avatar" fill className="object-cover rounded-full" />
              ) : (
                <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {user.username?.[0].toUpperCase() || "A"}
                  </span>
                </div>
              )}
            </div>

            <label
              htmlFor="avatar-upload"
              className="absolute bottom-2 right-2 cursor-pointer bg-gray-900 p-2 rounded-full shadow-lg border border-gray-700 hover:bg-gray-800 transition-all duration-300 group-hover:scale-110"
            >
              <FiEdit2 className="text-orange-500 text-lg" />
            </label>
            <input type="file" id="avatar-upload" className="hidden" onChange={handleAvatarChange} />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-3 flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                {user.username}
              </h2>
              <FiEdit2
                onClick={() => router.push("/create_profile")}
                className="text-orange-500 cursor-pointer hover:text-orange-400 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <p className="text-gray-300">
                <span className="font-semibold text-white">ID:</span> {user.id}
              </p>

              <div className="flex items-center gap-2">
                <p className="text-gray-300">
                  <span className="font-semibold text-white">Obuna:</span> 1 oylik
                </p>
                <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                <span className="text-red-400 text-sm">● Aktiv emas</span>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="absolute right-8 top-8 text-gray-400 hover:text-orange-500 flex items-center gap-2 transition-all duration-300 hover:bg-gray-800 px-4 py-2 rounded-xl border border-gray-700"
          >
            Chiqish <FiLogOut />
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-12 flex items-center gap-10 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("tariflar")}
            className={`pb-4 font-semibold text-lg relative transition-all duration-300 ${
              activeTab === "tariflar" ? "text-orange-500" : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Taríflar
            {activeTab === "tariflar" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-red-500"></div>
            )}
          </button>
        </div>

        {/* Tariff Section */}
        {activeTab === "tariflar" && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tariffs.map((item: any) => (
              <div
                key={item.id}
                className={`bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl p-6 rounded-2xl border flex flex-col gap-6 relative transition-all duration-300 hover:scale-105 hover:from-gray-800 hover:to-gray-700 ${
                  item.popular
                    ? "border-orange-500 ring-2 ring-orange-500 ring-opacity-20"
                    : "border-gray-700"
                }`}
              >
                {item.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <FiStar className="text-yellow-300" />
                      Popular
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-xl font-bold text-white">{item.name}</h3>
                  <div className="mt-4">
                    <p className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                      {item.price.toLocaleString()} so'm
                    </p>
                  </div>
                </div>

                <a
                  href="https://t.me/kine_one"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 inline-block text-center ${
                    item.popular
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg"
                      : "bg-gray-700 text-white hover:bg-gray-600 border border-gray-600"
                  }`}
                >
                  Obuna bo'lish
                </a>

                <p className="text-sm text-gray-400 mt-2 text-center">
                  Obuna olish uchun admin bilan bog‘laning
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
