"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  User,
  Mail,
  Lock,
  Crown,
  Calendar,
  Upload,
  Users,
  X,
  Search,
  Filter,
  Check,
  XCircle,
  ArrowLeft,
  Shield,
  CreditCard,
  Loader2,
  RefreshCw
} from "lucide-react";
import Sidebar from "@/src/components/AdminSideber";
import { UserForm } from "@/src/features/types/User";
import {
  createUser,
  deleteUser,
  fetchUsers,
  uploadAvatar,
  updateUser
} from "@/src/features/api/Users";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "form">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "USER" | "ADMIN">("ALL");
  const [subscriptionFilter, setSubscriptionFilter] = useState<"ALL" | "SUBSCRIBED" | "NOT_SUBSCRIBED">("ALL");

  // FORM STATES
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      console.error("User fetch xatosi:", err);
    } finally {
      setLoading(false);
    }
  };

  // Avatar preview
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Image size validation (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Rasm hajmi 2MB dan oshmasligi kerak!");
      return;
    }
    
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // Clear avatar
  const clearAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview("");
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
  };

  // CREATE or UPDATE USER
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      alert("Iltimos, to'g'ri email kiriting!");
      return;
    }
    if (!username.trim()) {
      alert("Username kiriting!");
      return;
    }
    if (!editingUserId && !password) {
      alert("Parol kiriting!");
      return;
    }

    setIsSubmitting(true);

    let avatarUrl: string | null = null;
    if (avatarFile) {
      try {
        avatarUrl = await uploadAvatar("temp", avatarFile);
      } catch (err: any) {
        alert(err.message || "Avatar yuklashda xatolik!");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      if (editingUserId) {
        // UPDATE USER
        const updated = await updateUser(editingUserId, {
          username,
          email,
          role,
          avatar: avatarUrl || undefined
        });
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUserId ? updated : u))
        );
        alert("✅ Foydalanuvchi yangilandi!");
      } else {
        // CREATE USER
        const newUser = await createUser({
          username,
          email,
          password,
          role,
          avatar: avatarUrl
        });
        setUsers((prev) => [newUser, ...prev]);
        alert("✅ Foydalanuvchi muvaffaqiyatli qo'shildi!");
      }

      // Reset form
      setEmail("");
      setUsername("");
      setPassword("");
      clearAvatar();
      setRole("USER");
      setEditingUserId(null);

      // Mobile uchun avtomatik ro'yxatga o'tish
      if (window.innerWidth < 1024) {
        setActiveTab("list");
      }

    } catch (err: any) {
      console.error(err);
      alert(err.message || "❌ Server xatosi!");
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
      alert("✅ Foydalanuvchi muvaffaqiyatli o'chirildi!");
    } catch (err) {
      console.error("Delete xatosi:", err);
      alert("❌ Server xatosi!");
    }
  };

  // EDIT USER
  const handleEditUser = (user: UserForm) => {
    setEditingUserId(user.id);
    setEmail(user.email || "");
    setUsername(user.username);
    setRole(user.role || "USER");
    setAvatarPreview(user.avatar || "");
    setActiveTab("form");
  };

  // FILTERED USERS
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    
    const matchesSubscription = subscriptionFilter === "ALL" || 
      (subscriptionFilter === "SUBSCRIBED" && user.isSubscribed) ||
      (subscriptionFilter === "NOT_SUBSCRIBED" && !user.isSubscribed);
    
    return matchesSearch && matchesRole && matchesSubscription;
  });

  // USER STATS
  const getStats = () => {
    const totalUsers = users.length;
    const subscribedUsers = users.filter((u) => u.isSubscribed).length;
    const adminUsers = users.filter((u) => u.role === "ADMIN").length;
    return { totalUsers, subscribedUsers, adminUsers };
  };

  const stats = getStats();

  // RESET FORM
  const resetForm = () => {
    setEditingUserId(null);
    setEmail("");
    setUsername("");
    setPassword("");
    clearAvatar();
    setRole("USER");
  };

  // MOBILE NAVIGATION
  const MobileNav = () => (
    <div className="lg:hidden mb-6">
      <div className="flex bg-gray-800/50 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("list")}
          className={`flex-1 py-2 rounded-md text-center ${
            activeTab === "list" 
              ? "bg-purple-600/30 text-purple-300" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          👥 Foydalanuvchilar
        </button>
        <button
          onClick={() => setActiveTab("form")}
          className={`flex-1 py-2 rounded-md text-center ${
            activeTab === "form" 
              ? "bg-purple-600/30 text-purple-300" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          {editingUserId ? "✏️ Tahrirlash" : "➕ Yangi"}
        </button>
      </div>
    </div>
  );

  // FORM COMPONENT
  const FormSection = () => (
    <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-gray-700/50 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {window.innerWidth < 1024 ? (
            <button
              onClick={() => setActiveTab("list")}
              className="p-2 hover:bg-gray-700/50 rounded-lg"
            >
              <ArrowLeft size={20} />
            </button>
          ) : null}
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-2 rounded-lg">
              {editingUserId ? (
                <Edit className="text-yellow-400" size={20} />
              ) : (
                <Plus className="text-green-400" size={20} />
              )}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">
                {editingUserId ? "Foydalanuvchini tahrirlash" : "Yangi foydalanuvchi"}
              </h2>
              <p className="text-sm text-gray-400">
                {editingUserId ? "Mavjud foydalanuvchi ma'lumotlarini o'zgartiring" : "Yangi foydalanuvchi yarating"}
              </p>
            </div>
          </div>
        </div>
        {editingUserId && (
          <button
            onClick={resetForm}
            className="p-2 hover:bg-gray-700/50 rounded-lg"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
            <Mail size={16} />
            Email manzil
          </label>
          <input
            type="email"
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="foydalanuvchi@email.com"
            required
          />
        </div>

        {/* Username */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
            <User size={16} />
            Foydalanuvchi nomi
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            required
          />
        </div>

        {/* Password (only for creating new user) */}
        {!editingUserId && (
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <Lock size={16} />
              Parol
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kuchli parol kiriting"
                required
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {passwordVisible ? "🙈" : "👁"}
              </button>
            </div>
          </div>
        )}

        {/* Role */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
            <Shield size={16} />
            Foydalanuvchi roli
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("USER")}
              className={`py-3 rounded-lg border flex items-center justify-center gap-2 ${
                role === "USER"
                  ? "bg-blue-600/20 border-blue-500 text-blue-300"
                  : "bg-gray-700/50 border-gray-600 text-gray-300"
              }`}
            >
              <User size={16} />
              Foydalanuvchi
            </button>
            <button
              type="button"
              onClick={() => setRole("ADMIN")}
              className={`py-3 rounded-lg border flex items-center justify-center gap-2 ${
                role === "ADMIN"
                  ? "bg-purple-600/20 border-purple-500 text-purple-300"
                  : "bg-gray-700/50 border-gray-600 text-gray-300"
              }`}
            >
              <Crown size={16} />
              Admin
            </button>
          </div>
        </div>

        {/* Avatar Upload */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
            <Upload size={16} />
            Profil rasmi
          </label>
          
          {avatarPreview ? (
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-purple-500"
                />
                <button
                  type="button"
                  onClick={clearAvatar}
                  className="absolute -top-1 -right-1 bg-red-600 p-1 rounded-full hover:bg-red-700"
                >
                  <X size={14} />
                </button>
              </div>
              <p className="text-sm text-gray-400">Rasm tanlandi</p>
            </div>
          ) : (
            <label className="block border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-2">
                <div className="bg-gray-700/50 p-3 rounded-full">
                  <Upload className="text-gray-400" size={24} />
                </div>
                <div>
                  <p className="text-gray-300 font-medium">Rasm yuklash</p>
                  <p className="text-sm text-gray-400">PNG, JPG, GIF • maks. 2MB</p>
                </div>
              </div>
            </label>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Saqlanmoqda...
            </>
          ) : editingUserId ? (
            "💾 Yangilash"
          ) : (
            "➕ Qo'shish"
          )}
        </button>

        {/* Cancel Button (mobile) */}
        {window.innerWidth < 1024 && (
          <button
            type="button"
            onClick={() => setActiveTab("list")}
            className="w-full bg-gray-700/50 hover:bg-gray-700 py-3 rounded-lg"
          >
            Bekor qilish
          </button>
        )}
      </form>
    </div>
  );

  // LIST COMPONENT
  const ListSection = () => (
    <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-gray-700/50 shadow-lg">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-2 rounded-lg">
              <Users className="text-blue-400" size={20} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Barcha foydalanuvchilar</h2>
              <p className="text-sm text-gray-400">
                {filteredUsers.length} ta ko'rsatilmoqda • Jami {users.length} ta
              </p>
            </div>
          </div>
          <button
            onClick={loadUsers}
            className="p-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg"
            title="Yangilash"
          >
            <RefreshCw size={20} />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Foydalanuvchi qidirish..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setRoleFilter("ALL")}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                roleFilter === "ALL"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700/50 text-gray-300"
              }`}
            >
              👥 Barchasi
            </button>
            <button
              onClick={() => setRoleFilter("USER")}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                roleFilter === "USER"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700/50 text-gray-300"
              }`}
            >
              <User size={14} className="inline mr-1" /> User
            </button>
            <button
              onClick={() => setRoleFilter("ADMIN")}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                roleFilter === "ADMIN"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700/50 text-gray-300"
              }`}
            >
              <Crown size={14} className="inline mr-1" /> Admin
            </button>
            <button
              onClick={() => setSubscriptionFilter("SUBSCRIBED")}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                subscriptionFilter === "SUBSCRIBED"
                  ? "bg-green-600 text-white"
                  : "bg-gray-700/50 text-gray-300"
              }`}
            >
              <CreditCard size={14} className="inline mr-1" /> Obuna
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards (Mobile) */}
      <div className="lg:hidden grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gray-700/30 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
          <p className="text-xs text-gray-400">Jami</p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold">{stats.subscribedUsers}</p>
          <p className="text-xs text-gray-400">Obuna</p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold">{stats.adminUsers}</p>
          <p className="text-xs text-gray-400">Admin</p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold">{users.filter(u => u.isVerify).length}</p>
          <p className="text-xs text-gray-400">Tasdiqlangan</p>
        </div>
      </div>

      {/* Users List */}
      {loading ? (
        <div className="text-center py-10">
          <Loader2 className="animate-spin mx-auto mb-3" size={32} />
          <p className="text-gray-400">Foydalanuvchilar yuklanmoqda...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-10 bg-gray-800/30 rounded-lg">
          <User className="mx-auto mb-3 text-gray-500" size={48} />
          <p className="text-gray-400 mb-2">
            {searchTerm || roleFilter !== "ALL" || subscriptionFilter !== "ALL" 
              ? "Qidiruv bo'yicha foydalanuvchi topilmadi" 
              : "Hozircha foydalanuvchilar mavjud emas"}
          </p>
          {(searchTerm || roleFilter !== "ALL" || subscriptionFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setRoleFilter("ALL");
                setSubscriptionFilter("ALL");
              }}
              className="text-purple-400 hover:text-purple-300 text-sm"
            >
              Filterni tozalash
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-gray-700/30 rounded-lg border border-gray-600/30 hover:bg-gray-700/50 p-3 transition-colors"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={user.avatar || "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"}
                    alt="avatar"
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-gray-600 object-cover"
                  />
                  {user.role === 'ADMIN' && (
                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1 shadow-lg">
                      <Crown size={10} className="text-white" />
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{user.username || "Foydalanuvchi"}</h3>
                      <p className="text-gray-400 text-sm truncate">{user.email}</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0 ml-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        user.isSubscribed ? 'bg-green-500/20 text-green-300' : 'bg-gray-600/50 text-gray-400'
                      }`}>
                        {user.isSubscribed ? "💎" : "—"}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {user.role === 'ADMIN' ? 'A' : 'U'}
                      </span>
                    </div>
                  </div>

                  {/* Verification and ID */}
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      {user.isVerify ? <Check size={12} className="text-green-400" /> : <XCircle size={12} className="text-red-400" />}
                      {user.isVerify ? "Tasdiqlangan" : "Tasdiqlanmagan"}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="truncate">ID: {user.id.slice(0, 6)}...</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm"
                    >
                      <Edit size={12} />
                      <span className="hidden sm:inline">Tahrirlash</span>
                      <span className="sm:hidden">Tahrir</span>
                    </button>

                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm"
                    >
                      <Trash2 size={12} />
                      <span className="hidden sm:inline">O'chirish</span>
                      <span className="sm:hidden">O'chir</span>
                    </button>

                    <Link
                      href={`/admin/users/${user.id}`}
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm"
                    >
                      <Eye size={12} />
                      <span className="hidden sm:inline">Ko'rish</span>
                      <span className="sm:hidden">Ko'rish</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Stats Grid (Desktop)
  const StatsGrid = () => (
    <div className="hidden lg:grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-5 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Jami Foydalanuvchilar</p>
            <p className="text-2xl font-bold mt-2">{stats.totalUsers}</p>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
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
          <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
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
          <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
            <User size={24} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-3 rounded-xl">
                <Users className="text-purple-400" size={28} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Foydalanuvchilar Boshqaruvi
                </h1>
                <p className="text-gray-400 text-sm sm:text-base">
                  Foydalanuvchilarni boshqaring va yangilarini qo'shing
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <MobileNav />

          {/* Desktop Stats */}
          <StatsGrid />

          {/* Desktop Layout */}
          <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <FormSection />
            </div>
            <div className="lg:col-span-2">
              <ListSection />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden">
            {activeTab === "form" ? <FormSection /> : <ListSection />}
          </div>
        </div>
      </main>
    </div>
  );
}