"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserForm } from "@/src/features/types/User";
import { createUser, updateUser, uploadAvatar } from "@/src/features/api/Users";

// CREATE uchun type
type CreateUserPayload = {
  firstName: string;
  lastName: string;
  username: string;
  avatar?: string | null;
  role: "USER" | "ADMIN";
  isSubscribed?: boolean;
  isVerify?: boolean;
};

// UPDATE uchun type
type UpdateUserPayload = {
  firstName?: string;
  lastName?: string;
  username?: string;
  avatar?: string | null;
  role?: "USER" | "ADMIN";
  isSubscribed?: boolean;
  isVerify?: boolean;
};

const CreateProfile: React.FC = () => {
  const router = useRouter();

  const [user, setUser] = useState<UserForm | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ============================
  // USER DATA LOCALSTORAGEDAN OLIB KELISH
  // ============================
  useEffect(() => {
    const storedUser = localStorage.getItem("user_data");
    if (storedUser) {
      const parsed: UserForm = JSON.parse(storedUser);
      setUser(parsed);

      setFirstName(parsed.firstName || "");
      setLastName(parsed.lastName || "");
      setUsername(parsed.username || "");
      setAvatarPreview(parsed.avatar || null);
    }
  }, []);

  // ============================
  // AVATAR TANLASH
  // ============================
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // ============================
  // SUBMIT (CREATE / UPDATE)
  // ============================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !username) {
      alert("Barcha maydonlarni to‘ldiring!");
      return;
    }

    setLoading(true);

    try {
      let avatarUrl = avatarPreview;

      // Avatar upload faqat update bo'lganda ishlaydi (user.id bor bo'lsa)
      if (avatarFile && user?.id) {
        avatarUrl = await uploadAvatar(user.id, avatarFile);
      }

      if (user?.id) {
        // UPDATE USER
        const body: UpdateUserPayload = {
          firstName,
          lastName,
          username,
          avatar: avatarUrl,
        };

        const updatedUser = await updateUser(user.id, body);
        localStorage.setItem("user_data", JSON.stringify(updatedUser));
      } else {
        // CREATE USER
        const body: CreateUserPayload = {
          firstName,
          lastName,
          username,
          avatar: null, // create qilganda avatar upload bo‘lmaydi
          role: "USER",
          isSubscribed: false,
          isVerify: true,
        };

        const newUser = await createUser(body);
        localStorage.setItem("user_data", JSON.stringify(newUser));
      }

      router.push("/");
    } catch (error) {
      console.error(error);
      alert("Xatolik yuz berdi");
    }

    setLoading(false);
  };

  // ============================
  // UI
  // ============================
  return (
    <div className="w-full flex justify-center items-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="w-full max-w-lg">
        <div className="bg-gradient-to-r from-orange-400 to-red-500 p-6 text-center rounded-t-3xl relative overflow-hidden">
          <h2 className="text-3xl font-bold text-white relative z-10">
            {user ? "Profilni Yangilash" : "Yangi Profil"}
          </h2>
          <p className="text-orange-100 mt-2">
            Shaxsiy ma'lumotlaringizni to'ldiring
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-b-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-8">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-8">
              <label
                htmlFor="avatar"
                className="cursor-pointer w-32 h-32 rounded-full overflow-hidden border-4 border-orange-400 relative"
              >
                <Image
                  src={avatarPreview ?? "/default-avatar.png"}
                  alt="Avatar Preview"
                  fill
                  className="object-cover"
                />
              </label>

              <input
                id="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />

              <p className="text-sm text-gray-500 mt-3">
                Rasm yuklash uchun bosing
              </p>
            </div>

            {/* FIELDS */}
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label>Ism</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-4 border rounded-xl"
                  />
                </div>

                <div className="w-1/2">
                  <label>Familiya</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-4 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-4 border rounded-xl"
                />
              </div>
            </div>

            {/* BUTTON */}
            <button
              disabled={loading}
              className="w-full py-4 mt-8 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:scale-105 transition"
            >
              {loading
                ? "Saqlanmoqda..."
                : user
                ? "Profilni Yangilash"
                : "Profil Yaratish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;
