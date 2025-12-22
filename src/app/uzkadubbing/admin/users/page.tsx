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
  Users
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
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // CREATE or UPDATE USER
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let avatarUrl: string | null = null;
    if (avatarFile) {
      try {
        avatarUrl = await uploadAvatar("temp", avatarFile);
      } catch (err: any) {
        alert(err.message || "Avatar upload xatosi!");
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
        alert("Foydalanuvchi yangilandi!");
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
        alert("Foydalanuvchi muvaffaqiyatli qo'shildi!");
      }

      // Reset form
      setEmail("");
      setUsername("");
      setPassword("");
      setAvatarFile(null);
      setAvatarPreview("");
      setRole("USER");
      setEditingUserId(null);

    } catch (err: any) {
      console.error(err);
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

  // EDIT USER
  const handleEditUser = (user: UserForm) => {
    setEditingUserId(user.id);
    setEmail(user.email || "");
    setUsername(user.username);
    setRole(user.role || "USER");
    setAvatarPreview(user.avatar || "");
  };

  // USER STATS
  const getStats = () => {
    const totalUsers = users.length;
    const subscribedUsers = users.filter((u) => u.isSubscribed).length;
    const adminUsers = users.filter((u) => u.role === "ADMIN").length;
    return { totalUsers, subscribedUsers, adminUsers };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Users className="text-purple-400" size={32} />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Foydalanuvchilar Boshqaruvi
              </h1>
            </div>
            <p className="text-gray-400">
              Foydalanuvchilarni boshqaring va yangilarini qo'shing
            </p>
          </div>

          {/* STATS GRID */}
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

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* CREATE / EDIT FORM */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 shadow-lg sticky top-6">
                <div className="flex items-center gap-2 mb-6">
                  <Plus className="text-green-400" size={24} />
                  <h2 className="text-xl font-bold">
                    {editingUserId ? "Foydalanuvchini Tahrirlash" : "Yangi Foydalanuvchi"}
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="email"
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-500/50"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="foydalanuvchi@email.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="username"
                        required
                      />
                    </div>
                  </div>

                  {/* Password (only for creating new user) */}
                  {!editingUserId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Parol</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type={passwordVisible ? "text" : "password"}
                          className="w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-500/50"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setPasswordVisible(!passwordVisible)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        >
                          {passwordVisible ? "🙈" : "👁"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                    <select
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-purple-500/50"
                      value={role}
                      onChange={(e) => setRole(e.target.value as "USER" | "ADMIN")}
                    >
                      <option value="USER">Foydalanuvchi</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>

                  {/* Avatar Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Avatar</label>
                    <div className="border-2 border-dashed border-gray-600/50 rounded-lg p-4 text-center cursor-pointer hover:border-purple-500/50">
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

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                        {editingUserId ? "Yangilanmoqda..." : "Qo'shilmoqda..."}
                      </>
                    ) : (
                      <>
                        <Plus size={18} /> {editingUserId ? "Yangilash" : "Foydalanuvchi Qo'shish"}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* USERS LIST */}
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
                      <div key={user.id} className="bg-gray-700/30 rounded-lg border border-gray-600/30 hover:bg-gray-700/50 p-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img
                              src={user.avatar || "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"}
                              alt="avatar"
                              className="w-16 h-16 rounded-full border-2 border-gray-600 object-cover"
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
                                <h3 className="font-semibold text-lg truncate">{user.username || "Foydalanuvchi"}</h3>
                                <p className="text-gray-400 text-sm truncate">{user.email}</p>
                              </div>
                              <div className="flex gap-2">
                                <div className={`px-2 py-1 rounded-full text-xs ${
                                  user.isSubscribed ? 'bg-green-500/20 text-green-300' : 'bg-gray-600/50 text-gray-400'
                                }`}>
                                  {user.isSubscribed ? "💎 Obuna" : "Obuna emas"}
                                </div>
                                <div className={`px-2 py-1 rounded-full text-xs ${
                                  user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
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
                              <button
                                onClick={() => handleEditUser(user)}
                                className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 text-blue-300 rounded-lg hover:bg-blue-600/30 text-sm"
                              >
                                <Edit size={14} />
                                Tahrirlash
                              </button>

                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="flex items-center gap-2 px-3 py-2 bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600/30 text-sm"
                              >
                                <Trash2 size={14} />
                                O'chirish
                              </button>

                              <Link
                                href={`/admin/users/${user.id}`}
                                className="flex items-center gap-2 px-3 py-2 bg-gray-600/20 text-gray-300 rounded-lg hover:bg-gray-600/30 text-sm"
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
