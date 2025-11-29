"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Eye, User, Mail, Lock, Crown, Calendar, Upload, Users } from "lucide-react";
import Sidebar from "@/src/components/AdminSideber";
import { UserForm } from "@/src/features/types/User";
import { createUser, deleteUser, fetchUsers, uploadAvatar } from "@/src/features/api/Users";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // CREATE FORM STATE
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Fetch all users
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      console.error("User fetch xatosi:", err);
    } finally {
      setLoading(false);
    }
  };

  // Avatar tanlanganda preview
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // CREATE USER
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let avatarUrl: string | null = null;

    if (avatarFile) {
      try {
        // Foydalanuvchi hali yaratilmagan, shuning uchun uploadAvatar'ga null yoki temp id berish kerak
        avatarUrl = await uploadAvatar("temp", avatarFile);
      } catch (err: any) {
        alert(err.message || "Avatar upload xatosi!");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const newUser = await createUser({
        username: username || null,
        avatar: avatarUrl,
        role,
      });

      setUsers((prev) => [newUser, ...prev]);

      // Reset form
      setEmail("");
      setUsername("");
      setAvatarFile(null);
      setAvatarPreview("");
      setPassword("");
      setRole("USER");

      alert("Foydalanuvchi muvaffaqiyatli qo'shildi!");
    } catch (err: any) {
      console.error("User create xatosi:", err);
      alert(err.message || "Server xatosi!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // DELETE USER
  const handleDeleteUser = async (id: string) => {
    if (!confirm("Ushbu foydalanuvchi o'chiriladi. Davom etasizmi?")) return;

    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      alert("Foydalanuvchi muvaffaqiyatli o'chirildi!");
    } catch (err) {
      console.error("Delete xatosi:", err);
      alert("Server xatosi!");
    }
  };

  // USER STATS
  const getStats = () => {
    const totalUsers = users.length;
    const subscribedUsers = users.filter(u => u.isSubscribed).length;
    const adminUsers = users.filter(u => u.role === "ADMIN").length;
    return { totalUsers, subscribedUsers, adminUsers };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex">
      {/* Sidebar */}
      <Sidebar />
  
      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Users className="text-purple-400" size={32} />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Foydalanuvchilar Boshqaruvi
              </h1>
            </div>
            <p className="text-gray-400">Foydalanuvchilarni boshqaring va yangilarini qo'shing</p>
          </div>
  
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-5 border border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Jami Foydalanuvchilar</p>
                  <p className="text-2xl font-bold mt-2">{stats.totalUsers}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500">
                  <Users size={24} className="text-white" />
                </div>
              </div>
            </div>
  
            <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-5 border border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Obuna Bo'lganlar</p>
                  <p className="text-2xl font-bold mt-2">{stats.subscribedUsers}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-500">
                  <Crown size={24} className="text-white" />
                </div>
              </div>
            </div>
  
            <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-5 border border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Adminlar</p>
                  <p className="text-2xl font-bold mt-2">{stats.adminUsers}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500">
                  <User size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>
  
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ================= CREATE FORM ================= */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 shadow-lg sticky top-6">
                <div className="flex items-center gap-2 mb-6">
                  <Plus className="text-green-400" size={24} />
                  <h2 className="text-xl font-bold">Yangi Foydalanuvchi</h2>
                </div>
  
                <form onSubmit={handleCreateUser} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="email"
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="foydalanuvchi@email.com"
                        required
                      />
                    </div>
                  </div>
  
                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="username"
                      />
                    </div>
                  </div>
  
                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Parol
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type={passwordVisible ? "text" : "password"}
                        className="w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                      >
                        {passwordVisible ? "🙈" : "👁"}
                      </button>
                    </div>
                  </div>
  
                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Role
                    </label>
                    <select
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="user">Foydalanuvchi</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
  
                  {/* Avatar Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Avatar
                    </label>
                    <div className="border-2 border-dashed border-gray-600/50 rounded-lg p-4 text-center hover:border-purple-500/50 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                        id="avatar-upload"
                      />
                      <label htmlFor="avatar-upload" className="cursor-pointer">
                        <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                        <p className="text-sm text-gray-400">
                          {avatarPreview ? "Avatar tanlandi" : "Avatar tanlang"}
                        </p>
                      </label>
                    </div>
                    
                    {avatarPreview && (
                      <div className="mt-3 flex justify-center">
                        <img
                          src={avatarPreview}
                          alt="Avatar preview"
                          className="w-20 h-20 rounded-full object-cover border-2 border-purple-500/50"
                        />
                      </div>
                    )}
                  </div>
  
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        Qo'shilmoqda...
                      </>
                    ) : (
                      <>
                        <Plus size={18} />
                        Foydalanuvchi Qo'shish
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
  
            {/* ================= USERS LIST ================= */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Users className="text-blue-400" size={24} />
                    <h2 className="text-xl font-bold">Barcha Foydalanuvchilar</h2>
                  </div>
                  <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                    {users.length} ta foydalanuvchi
                  </div>
                </div>
  
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-12">
                    <User className="mx-auto mb-4 text-gray-500" size={48} />
                    <p className="text-gray-400 text-lg">Hozircha foydalanuvchilar mavjud emas.</p>
                    <p className="text-gray-500 text-sm mt-2">Yuqoridagi form orqali yangi foydalanuvchi qo'shing</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="bg-gray-700/30 rounded-lg border border-gray-600/30 hover:bg-gray-700/50 transition-all p-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img
                              src={
                                user.avatar ||
                                "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                              }
                              alt="avatar"
                              className="w-16 h-16 rounded-full border-2 border-gray-600 bg-gray-700 object-cover"
                            />
                            {user.role === 'ADMIN' && (
                              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1 shadow-lg">
                                <Crown size={12} className="text-white" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-lg truncate">
                                  {user.username || "Foydalanuvchi"}
                                </h3>
                                <p className="text-gray-400 text-sm truncate">{user.email}</p>
                              </div>
                              <div className="flex gap-2">
                                <div className={`px-2 py-1 rounded-full text-xs ${
                                  user.isSubscribed 
                                    ? 'bg-green-500/20 text-green-300' 
                                    : 'bg-gray-600/50 text-gray-400'
                                }`}>
                                  {user.isSubscribed ? "💎 Obuna" : "Obuna emas"}
                                </div>
                                <div className={`px-2 py-1 rounded-full text-xs ${
                                  user.role === 'ADMIN'
                                    ? 'bg-purple-500/20 text-purple-300'
                                    : 'bg-blue-500/20 text-blue-300'
                                }`}>
                                  {user.role === 'ADMIN' ? 'Admin' : 'User'}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar size={14} />
                                <span>{user.isVerify ? "✅ Tasdiqlangan" : "❌ Tasdiqlanmagan"}</span>
                              </div>
                              <div className="text-xs bg-gray-600/50 px-2 py-1 rounded">
                                ID: {user.id.slice(0, 8)}...
                              </div>
                            </div>
  
                            <div className="flex gap-2">
                              <Link
                                href={`/admin/users/edit/${user.id}`}
                                className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-colors text-sm"
                              >
                                <Edit size={14} />
                                Tahrirlash
                              </Link>
  
                              <button
                                onClick={() => deleteUser(user.id)}
                                className="flex items-center gap-2 px-3 py-2 bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600/30 transition-colors text-sm"
                              >
                                <Trash2 size={14} />
                                O'chirish
                              </button>
  
                              <Link
                                href={`/admin/users/${user.id}`}
                                className="flex items-center gap-2 px-3 py-2 bg-gray-600/20 text-gray-300 rounded-lg hover:bg-gray-600/30 transition-colors text-sm"
                              >
                                <Eye size={14} />
                                Ko'rish
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
  
        </div>
      </main>
    </div>
  );
}