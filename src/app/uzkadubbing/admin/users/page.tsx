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
  ArrowLeft,
  Shield,
  Check,
  XCircle,
  Loader2,
  RefreshCw,
  Filter,
  ChevronDown,
  ChevronUp
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
  const [showFilters, setShowFilters] = useState(false);

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
      alert("❌ Foydalanuvchilarni yuklashda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  // Avatar preview
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Image validation (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert("⚠️ Rasm hajmi 2MB dan oshmasligi kerak!");
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      alert("⚠️ Faqat rasm fayllari qabul qilinadi!");
      return;
    }
    
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

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
      alert("⚠️ Iltimos, to'g'ri email kiriting!");
      return;
    }
    
    if (!username.trim()) {
      alert("⚠️ Username kiriting!");
      return;
    }
    
    if (!editingUserId && !password) {
      alert("⚠️ Parol kiriting!");
      return;
    }

    setIsSubmitting(true);

    let avatarUrl: string | null = null;
    if (avatarFile) {
      try {
        avatarUrl = await uploadAvatar("temp", avatarFile);
      } catch (err: any) {
        alert(err.message || "❌ Avatar yuklashda xatolik!");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      if (editingUserId) {
        // UPDATE USER
        const updated = await updateUser(editingUserId, {
          username: username.trim(),
          email: email.trim(),
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
          username: username.trim(),
          email: email.trim(),
          password: password.trim(),
          role,
          avatar: avatarUrl
        });
        setUsers((prev) => [newUser, ...prev]);
        alert("✅ Foydalanuvchi muvaffaqiyatli qo'shildi!");
      }

      // Reset form
      resetForm();
      
      // Mobile uchun avtomatik ro'yxatga o'tish

    } catch (err: any) {
      console.error(err);
      alert(err.message || "❌ Server xatosi!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // DELETE USER
  const handleDeleteUser = async (id: string) => {
    if (!confirm("⚠️ Ushbu foydalanuvchi o'chiriladi. Davom etasizmi?")) return;

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
    setUsername(user.username || "");
    setRole(user.role || "USER");
    setAvatarPreview(user.avatar || "");
    setActiveTab("form");
  };

  // RESET FORM
  const resetForm = () => {
    setEditingUserId(null);
    setEmail("");
    setUsername("");
    setPassword("");
    clearAvatar();
    setRole("USER");
    setPasswordVisible(false);
  };

  // FILTERED USERS
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.username?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    
    const matchesSubscription = subscriptionFilter === "ALL" || 
      (subscriptionFilter === "SUBSCRIBED" && user.isSubscribed) ||
      (subscriptionFilter === "NOT_SUBSCRIBED" && !user.isSubscribed);
    
    return matchesSearch && matchesRole && matchesSubscription;
  });

  // USER STATS
  const stats = {
    totalUsers: users.length,
    subscribedUsers: users.filter((u) => u.isSubscribed).length,
    adminUsers: users.filter((u) => u.role === "ADMIN").length,
    verifiedUsers: users.filter((u) => u.isVerify).length,
  };

  // MOBILE NAVIGATION
  const MobileNav = () => (
    <div className="lg:hidden mb-6">
      <div className="flex bg-gray-800/50 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("list")}
          className={`flex-1 py-2 rounded-md text-center text-sm ${
            activeTab === "list" 
              ? "bg-purple-600/30 text-purple-300" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          👥 Foydalanuvchilar
        </button>
        <button
          onClick={() => setActiveTab("form")}
          className={`flex-1 py-2 rounded-md text-center text-sm ${
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
                {editingUserId ? "Foydalanuvchi tahrirlash" : "Yangi foydalanuvchi"}
              </h2>
              <p className="text-sm text-gray-400">
                {editingUserId ? "Mavjud foydalanuvchini yangilang" : "Yangi foydalanuvchi qo'shing"}
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

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
            <Mail size={16} />
            Email manzil
          </label>
          <input
            type="email"
            className="w-full px-3 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="foydalanuvchi@email.com"
            required
          />
        </div>

        {/* Username */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
            <User size={16} />
            Foydalanuvchi nomi
          </label>
          <input
            type="text"
            className="w-full px-3 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            required
          />
        </div>

        {/* Password (only for creating new user) */}
        {!editingUserId && (
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
              <Lock size={16} />
              Parol
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                className="w-full px-3 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kuchli parol kiriting"
                required
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {passwordVisible ? "🙈" : "👁"}
              </button>
            </div>
          </div>
        )}

        {/* Role */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
            <Shield size={16} />
            Foydalanuvchi roli
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole("USER")}
              className={`py-2.5 rounded-lg border text-sm ${
                role === "USER"
                  ? "bg-blue-600/20 border-blue-500 text-blue-300"
                  : "bg-gray-700/30 border-gray-600 text-gray-300"
              }`}
            >
              <User size={14} className="inline mr-1" /> User
            </button>
            <button
              type="button"
              onClick={() => setRole("ADMIN")}
              className={`py-2.5 rounded-lg border text-sm ${
                role === "ADMIN"
                  ? "bg-purple-600/20 border-purple-500 text-purple-300"
                  : "bg-gray-700/30 border-gray-600 text-gray-300"
              }`}
            >
              <Crown size={14} className="inline mr-1" /> Admin
            </button>
          </div>
        </div>

        {/* Avatar Upload */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-1">
            <Upload size={16} />
            Profil rasmi
          </label>
          
          {avatarPreview ? (
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-purple-500"
                />
                <button
                  type="button"
                  onClick={clearAvatar}
                  className="absolute -top-1 -right-1 bg-red-600 p-1 rounded-full"
                >
                  <X size={12} />
                </button>
              </div>
              <p className="text-xs text-gray-400">Rasm tanlandi</p>
            </div>
          ) : (
            <label className="block border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <Upload className="mx-auto mb-1 text-gray-400" size={20} />
              <p className="text-sm text-gray-400">Rasm tanlang</p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF • maks. 2MB</p>
            </label>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-2.5 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Saqlanmoqda...
            </>
          ) : editingUserId ? (
            "💾 Yangilash"
          ) : (
            "➕ Qo'shish"
          )}
        </button>

        {/* Cancel Button (mobile) */}
        {(
          <button
            type="button"
            onClick={() => setActiveTab("list")}
            className="w-full bg-gray-700/50 hover:bg-gray-700 py-2.5 rounded-lg text-sm"
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-2 rounded-lg">
            <Users className="text-blue-400" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold">Barcha foydalanuvchilar</h2>
            <p className="text-sm text-gray-400">
              {filteredUsers.length} ta • Jami {users.length} ta
            </p>
          </div>
        </div>
        <button
          onClick={loadUsers}
          className="p-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Qidirish..."
            className="w-full pl-9 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-between w-full px-3 py-2 bg-gray-700/50 rounded-lg text-sm"
        >
          <div className="flex items-center gap-2">
            <Filter size={14} />
            <span>Filtrlar</span>
          </div>
          {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showFilters && (
          <div className="grid grid-cols-2 gap-2 p-3 bg-gray-700/30 rounded-lg">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as "ALL" | "USER" | "ADMIN")}
              className="w-full px-2 py-1.5 bg-gray-700/50 border border-gray-600 rounded text-sm"
            >
              <option value="ALL">Barcha rollar</option>
              <option value="USER">Foydalanuvchi</option>
              <option value="ADMIN">Admin</option>
            </select>
            <select
              value={subscriptionFilter}
              onChange={(e) => setSubscriptionFilter(e.target.value as "ALL" | "SUBSCRIBED" | "NOT_SUBSCRIBED")}
              className="w-full px-2 py-1.5 bg-gray-700/50 border border-gray-600 rounded text-sm"
            >
              <option value="ALL">Barcha obuna</option>
              <option value="SUBSCRIBED">Obuna bo'lgan</option>
              <option value="NOT_SUBSCRIBED">Obuna bo'lmagan</option>
            </select>
          </div>
        )}
      </div>

      {/* Stats Cards (Mobile) */}
      <div className="lg:hidden grid grid-cols-2 gap-2 mb-4">
        <div className="bg-gray-700/30 rounded p-2 text-center">
          <div className="text-lg font-bold">{stats.totalUsers}</div>
          <div className="text-xs text-gray-400">Jami</div>
        </div>
        <div className="bg-gray-700/30 rounded p-2 text-center">
          <div className="text-lg font-bold">{stats.subscribedUsers}</div>
          <div className="text-xs text-gray-400">Obuna</div>
        </div>
        <div className="bg-gray-700/30 rounded p-2 text-center">
          <div className="text-lg font-bold">{stats.adminUsers}</div>
          <div className="text-xs text-gray-400">Admin</div>
        </div>
        <div className="bg-gray-700/30 rounded p-2 text-center">
          <div className="text-lg font-bold">{stats.verifiedUsers}</div>
          <div className="text-xs text-gray-400">Tasdiqlangan</div>
        </div>
      </div>

      {/* Users List */}
      {loading ? (
        <div className="text-center py-8">
          <Loader2 className="animate-spin mx-auto mb-2" size={24} />
          <p className="text-sm text-gray-400">Yuklanmoqda...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-8">
          <User className="mx-auto mb-2 text-gray-500" size={32} />
          <p className="text-gray-400 text-sm">
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
                setShowFilters(false);
              }}
              className="text-purple-400 hover:text-purple-300 text-xs mt-2"
            >
              Filterni tozalash
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-gray-700/30 rounded-lg border border-gray-600/30 hover:bg-gray-700/50 p-3"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={user.avatar || "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"}
                    alt="avatar"
                    className="w-12 h-12 rounded-full border-2 border-gray-600 object-cover"
                  />
                  {user.role === 'ADMIN' && (
                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-0.5">
                      <Crown size={10} className="text-white" />
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm truncate">{user.username || "Foydalanuvchi"}</h3>
                      <p className="text-gray-400 text-xs truncate">{user.email}</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0 ml-2">
                      <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                        user.isSubscribed ? 'bg-green-500/20 text-green-300' : 'bg-gray-600/50 text-gray-400'
                      }`}>
                        {user.isSubscribed ? "💎" : "—"}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                        user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {user.role === 'ADMIN' ? 'A' : 'U'}
                      </span>
                    </div>
                  </div>

                  {/* Verification and ID */}
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                    <span className="flex items-center gap-1">
                      {user.isVerify ? <Check size={10} className="text-green-400" /> : <XCircle size={10} className="text-red-400" />}
                      {user.isVerify ? "Tasdiqlangan" : "Tasdiqlanmagan"}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="truncate text-xs">ID: {user.id.slice(0, 6)}...</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="flex-1 flex items-center justify-center gap-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 py-1.5 rounded text-xs"
                    >
                      <Edit size={12} />
                      Tahrir
                    </button>

                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="flex-1 flex items-center justify-center gap-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 py-1.5 rounded text-xs"
                    >
                      <Trash2 size={12} />
                      O'chir
                    </button>

                    <Link
                      href={`/admin/users/${user.id}`}
                      className="flex-1 flex items-center justify-center gap-1 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 py-1.5 rounded text-xs"
                    >
                      <Eye size={12} />
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
  );

  // Stats Grid (Desktop)
  const StatsGrid = () => (
    <div className="hidden lg:grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Jami Foydalanuvchilar</p>
            <p className="text-xl font-bold mt-1">{stats.totalUsers}</p>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
            <Users size={20} className="text-white" />
          </div>
        </div>
      </div>
      <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Obuna Bo'lganlar</p>
            <p className="text-xl font-bold mt-1">{stats.subscribedUsers}</p>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
            <Crown size={20} className="text-white" />
          </div>
        </div>
      </div>
      <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Adminlar</p>
            <p className="text-xl font-bold mt-1">{stats.adminUsers}</p>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
            <User size={20} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 md:ml-64 pt-16 md:pt-0">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-2 rounded-lg">
                <Users className="text-purple-400" size={20} />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Foydalanuvchilar
              </h1>
            </div>
            <p className="text-gray-400 text-sm">
              Foydalanuvchilarni boshqaring va yangilarini qo'shing
            </p>
          </div>

          {/* Mobile Navigation */}
          <MobileNav />

          {/* Desktop Stats */}
          <StatsGrid />

          {/* Desktop Layout */}
          <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-6">
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