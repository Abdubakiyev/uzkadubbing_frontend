"use client";

import { useState } from "react";
import Image from "next/image";
import { FiEdit2, FiLogOut, FiStar, FiCreditCard } from "react-icons/fi";
import { useRouter } from "next/navigation";
import MainHeader from "@/src/components/MainHeader";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<"tariflar" | "tanlanganlar">(
    "tariflar"
  );
  const router = useRouter();

  const tariffs = [
    { id: 1, name: "1 oylik", price: 15000, popular: false },
    { id: 3, name: "3 oylik", price: 39000, popular: true },
    { id: 6, name: "6 oylik", price: 66000, popular: false },
    { id: 12, name: "1 Yillik", price: 110000, popular: false },
  ];

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white">
      <MainHeader/>
      <div className="max-w-5xl mx-auto mt-20">

        {/* USER PANEL */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-2xl rounded-2xl p-8 flex items-center gap-8 relative border border-gray-700">
          
          {/* Avatar */}
          <div className="relative group">
            <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center relative overflow-hidden">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">A</span>
              </div>
            </div>

            {/* Edit avatar */}
            <button
              onClick={() => router.push("/create_profile")}
              className="absolute bottom-2 right-2 bg-gray-900 p-2 rounded-full shadow-lg border border-gray-700 hover:bg-gray-800 transition-all duration-300 group-hover:scale-110"
            >
              <FiEdit2 className="text-orange-500 text-lg" />
            </button>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-3 flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                abdulloh
              </h2>
              <FiEdit2
                onClick={() => router.push("/create_profile")}
                className="text-orange-500 cursor-pointer hover:text-orange-400 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <p className="text-gray-300">
                <span className="font-semibold text-white">ID:</span> 10592870
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
            onClick={() => {
              // LocalStorage-dan token o'chirish
              localStorage.removeItem("token"); // yoki siz ishlatayotgan key nomi
              // Register sahifasiga yo'naltirish
              router.push("/register");
            }}
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
              activeTab === "tariflar"
                ? "text-orange-500"
                : "text-gray-400 hover:text-gray-300"
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
            {tariffs.map((item) => (
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
                    {item.id === 12 && (
                      <p className="text-green-400 text-sm mt-2 font-semibold">
                        💰 45% skitka
                      </p>
                    )}
                    {item.id === 6 && (
                      <p className="text-green-400 text-sm mt-2 font-semibold">
                        💰 27% skitka
                      </p>
                    )}
                  </div>
                </div>

                {/* Obuna tugmasi */}
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
                  Obuna olish uchun admin bilan bog‘laning va to‘lov qiling
                  adminga murojat uchun obuna tugmasini bosing
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}