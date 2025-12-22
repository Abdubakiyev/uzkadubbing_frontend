"use client";

import { useEffect, useState } from "react";
import { 
  Plus, 
  Crown, 
  Calendar, 
  User, 
  CreditCard, 
  Trash2, 
  Zap, 
  Users, 
  Clock, 
  DollarSign,
  Edit,
  X,
  Search,
  Filter,
  Loader2,
  RefreshCw,
  ChevronRight,
  Check,
  XCircle,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import Sidebar from "@/src/components/AdminSideber";
import { UserSubscription } from "@/src/features/types/User-subscrition";
import { SubscriptionPlan } from "@/src/features/types/Subscription-plan";
import { UserForm } from "@/src/features/types/User";
import {
  createSubscription,
  deleteSubscription,
  fetchSubscriptions,
  updateSubscription
} from "@/src/features/api/User-subscription";
import { fetchPlans } from "@/src/features/api/Subscription-plan";
import { fetchUsers } from "@/src/features/api/Users";

export default function UserSubscriptionAdminPage() {
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [users, setUsers] = useState<UserForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "form">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "EXPIRED">("ALL");
  const [planFilter, setPlanFilter] = useState<string>("ALL");

  /* ================= FORM STATE ================= */
  const [editingSubscription, setEditingSubscription] = useState<UserSubscription | null>(null);
  const [userId, setUserId] = useState("");
  const [planId, setPlanId] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [subsData, plansData, usersData] = await Promise.all([
        fetchSubscriptions(),
        fetchPlans(),
        fetchUsers(),
      ]);
      setSubscriptions(subsData);
      setPlans(plansData);
      setUsers(usersData);
    } catch (err) {
      console.error("Load error:", err);
      alert("❌ Ma'lumotlarni yuklashda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET FORM ================= */
  const resetForm = () => {
    setEditingSubscription(null);
    setUserId("");
    setPlanId("");
  };

  /* ================= START EDIT ================= */
  const startEdit = (sub: UserSubscription) => {
    setEditingSubscription(sub);
    setUserId(sub.userId);
    setPlanId(sub.planId);
    setActiveTab("form");
  };

  /* ================= CREATE / UPDATE ================= */
  const handleSaveSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !planId) {
      alert("⚠️ Iltimos, foydalanuvchi va reja tanlang!");
      return;
    }
    
    setIsSubmitting(true);

    try {
      let savedSub: UserSubscription;

      if (editingSubscription) {
        // UPDATE
        savedSub = await updateSubscription(editingSubscription.id, { userId, planId });
        setSubscriptions(prev =>
          prev.map(s => s.id === savedSub.id ? savedSub : s)
        );
        alert("✅ Obuna yangilandi!");
      } else {
        // CREATE
        savedSub = await createSubscription({ userId, planId }, plans);
        setSubscriptions(prev => [savedSub, ...prev]);
        alert("✅ Yangi obuna qo'shildi!");
      }

      resetForm();
      
      // Mobile uchun avtomatik ro'yxatga o'tish
      if (window.innerWidth < 1024) {
        setActiveTab("list");
      }
    } catch (err: any) {
      console.error("Save error:", err);
      alert(err.message || "❌ Server xatosi!");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDeleteSubscription = async (id: string) => {
    if (!confirm("⚠️ Ushbu obuna o'chiriladi. Tasdiqlaysizmi?")) return;
    try {
      await deleteSubscription(id);
      setSubscriptions(prev => prev.filter(s => s.id !== id));
      alert("✅ Obuna muvaffaqiyatli o'chirildi!");
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Server xatosi!");
    }
  };

  /* ================= UTILS ================= */
  const formatPrice = (price: number) => new Intl.NumberFormat("uz-UZ").format(price);

  const getDaysRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getPlanColor = (planName: string) => {
    const colors: Record<string, string> = {
      Basic: "from-blue-500 to-cyan-500",
      Standard: "from-green-500 to-emerald-500",
      Premium: "from-purple-500 to-pink-500",
      Pro: "from-orange-500 to-red-500",
      VIP: "from-yellow-500 to-amber-500",
    };
    return colors[planName] || "from-gray-500 to-gray-700";
  };

  /* ================= FILTERED SUBSCRIPTIONS ================= */
  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = 
      sub.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.plan.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "ALL" || 
      (statusFilter === "ACTIVE" && sub.isActive) ||
      (statusFilter === "EXPIRED" && !sub.isActive);
    
    const matchesPlan = 
      planFilter === "ALL" || 
      sub.plan.id === planFilter ||
      sub.plan.name === planFilter;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  /* ================= STATS ================= */
  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.isActive).length,
    expired: subscriptions.filter(s => !s.isActive).length,
    expiringSoon: subscriptions.filter(s => {
      if (!s.isActive) return false;
      const days = getDaysRemaining(s.expiresAt);
      return days <= 7 && days > 0;
    }).length,
  };

  /* ================= MOBILE NAVIGATION ================= */
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
          📋 Obunalar
        </button>
        <button
          onClick={() => setActiveTab("form")}
          className={`flex-1 py-2 rounded-md text-center ${
            activeTab === "form" 
              ? "bg-purple-600/30 text-purple-300" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          {editingSubscription ? "✏️ Tahrirlash" : "➕ Yangi"}
        </button>
      </div>
    </div>
  );

  /* ================= FORM COMPONENT ================= */
  const FormSection = () => (
    <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-gray-700/50 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {window.innerWidth < 1024 && (
            <button
              onClick={() => setActiveTab("list")}
              className="p-2 hover:bg-gray-700/50 rounded-lg"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-2 rounded-lg">
              {editingSubscription ? (
                <Edit className="text-yellow-400" size={20} />
              ) : (
                <Plus className="text-green-400" size={20} />
              )}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">
                {editingSubscription ? "Obunani tahrirlash" : "Yangi obuna yaratish"}
              </h2>
              <p className="text-sm text-gray-400">
                {editingSubscription ? "Mavjud obunani yangilang" : "Yangi obuna qo'shing"}
              </p>
            </div>
          </div>
        </div>
        {editingSubscription && (
          <button
            onClick={resetForm}
            className="p-2 hover:bg-gray-700/50 rounded-lg"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <form onSubmit={handleSaveSubscription} className="space-y-5">
        {/* Foydalanuvchi tanlash */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
            <User size={16} />
            Foydalanuvchi tanlash
          </label>
          <select
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            disabled={!!editingSubscription}
          >
            <option value="">Foydalanuvchi tanlang...</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username || user.email} {user.isSubscribed && " (obuna)"}
              </option>
            ))}
          </select>
          {editingSubscription && (
            <p className="text-xs text-gray-400 mt-1">
              ⚠️ Obuna davomida foydalanuvchini o'zgartirib bo'lmaydi
            </p>
          )}
        </div>

        {/* Reja tanlash */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
            <CreditCard size={16} />
            Obuna rejasi
          </label>
          <div className="space-y-2">
            {plans.map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => setPlanId(plan.id)}
                className={`w-full p-3 rounded-lg border flex items-start gap-3 text-left ${
                  planId === plan.id
                    ? "bg-purple-600/20 border-purple-500"
                    : "bg-gray-700/30 border-gray-600 hover:bg-gray-700/50"
                }`}
              >
                <div className={`p-2 rounded-lg bg-gradient-to-r ${getPlanColor(plan.name)}`}>
                  <Crown size={18} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold">{plan.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      plan.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {plan.isActive ? 'Faol' : 'Nofaol'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-300">
                    <span className="flex items-center gap-1">
                      <DollarSign size={14} />
                      {formatPrice(plan.price)} so'm
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {plan.duration} kun
                    </span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </button>
            ))}
          </div>
          {planId && (
            <div className="mt-3 p-3 bg-gray-700/30 rounded-lg">
              <p className="text-sm text-gray-300 flex items-center gap-2">
                <Check className="text-green-400" size={16} />
                Reja tanlandi
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Saqlanmoqda...
              </>
            ) : editingSubscription ? (
              "💾 Yangilash"
            ) : (
              "➕ Qo'shish"
            )}
          </button>

          {(editingSubscription || window.innerWidth < 1024) && (
            <button
              type="button"
              onClick={() => {
                resetForm();
                if (window.innerWidth < 1024) setActiveTab("list");
              }}
              className="px-6 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg"
            >
              Bekor qilish
            </button>
          )}
        </div>
      </form>
    </div>
  );

  /* ================= LIST COMPONENT ================= */
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
              <h2 className="text-lg sm:text-xl font-bold">Barcha obunalar</h2>
              <p className="text-sm text-gray-400">
                {filteredSubscriptions.length} ta ko'rsatilmoqda • Jami {subscriptions.length} ta
              </p>
            </div>
          </div>
          <button
            onClick={loadAll}
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
              placeholder="Foydalanuvchi yoki reja nomi bo'yicha qidirish..."
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
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                statusFilter === "ALL"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700/50 text-gray-300"
              }`}
            >
              👥 Barchasi
            </button>
            <button
              onClick={() => setStatusFilter("ACTIVE")}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                statusFilter === "ACTIVE"
                  ? "bg-green-600 text-white"
                  : "bg-gray-700/50 text-gray-300"
              }`}
            >
              ✅ Faol
            </button>
            <button
              onClick={() => setStatusFilter("EXPIRED")}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                statusFilter === "EXPIRED"
                  ? "bg-red-600 text-white"
                  : "bg-gray-700/50 text-gray-300"
              }`}
            >
              ❌ Muddati tugagan
            </button>
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setPlanFilter(planFilter === plan.id ? "ALL" : plan.id)}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                  planFilter === plan.id
                    ? `bg-gradient-to-r ${getPlanColor(plan.name)} text-white`
                    : "bg-gray-700/50 text-gray-300"
                }`}
              >
                {plan.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards (Mobile) */}
      <div className="lg:hidden grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gray-700/30 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-gray-400">Jami</p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold">{stats.active}</p>
          <p className="text-xs text-gray-400">Faol</p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold">{stats.expired}</p>
          <p className="text-xs text-gray-400">Tugagan</p>
        </div>
        <div className="bg-gray-700/30 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold">{stats.expiringSoon}</p>
          <p className="text-xs text-gray-400">Tugash arafasi</p>
        </div>
      </div>

      {/* Subscriptions List */}
      {loading ? (
        <div className="text-center py-10">
          <Loader2 className="animate-spin mx-auto mb-3" size={32} />
          <p className="text-gray-400">Obunalar yuklanmoqda...</p>
        </div>
      ) : filteredSubscriptions.length === 0 ? (
        <div className="text-center py-10 bg-gray-800/30 rounded-lg">
          <CreditCard className="mx-auto mb-3 text-gray-500" size={48} />
          <p className="text-gray-400 mb-2">
            {searchTerm || statusFilter !== "ALL" || planFilter !== "ALL" 
              ? "Qidiruv bo'yicha obuna topilmadi" 
              : "Hozircha obunalar mavjud emas"}
          </p>
          {(searchTerm || statusFilter !== "ALL" || planFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("ALL");
                setPlanFilter("ALL");
              }}
              className="text-purple-400 hover:text-purple-300 text-sm"
            >
              Filterni tozalash
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
          {filteredSubscriptions.map((sub) => {
            const daysRemaining = getDaysRemaining(sub.expiresAt);
            const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;
            const isExpired = daysRemaining < 0;

            return (
              <div
                key={sub.id}
                className="bg-gray-700/30 rounded-lg border border-gray-600/30 hover:bg-gray-700/50 p-3 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Plan Icon */}
                  <div className={`p-2.5 rounded-lg bg-gradient-to-r ${getPlanColor(sub.plan.name)} flex-shrink-0`}>
                    <Crown size={18} className="text-white" />
                  </div>

                  {/* Subscription Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0">
                        <h3 className="font-bold truncate">{sub.user?.username || sub.user?.email}</h3>
                        <p className="text-gray-400 text-sm truncate">{sub.user?.email}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0 ml-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          sub.isActive 
                            ? isExpiringSoon 
                              ? 'bg-orange-500/20 text-orange-300'
                              : 'bg-green-500/20 text-green-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {isExpired ? '❌' : isExpiringSoon ? '⏳' : '✅'}
                        </span>
                      </div>
                    </div>

                    {/* Plan Details */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{sub.plan.name}</span>
                        <span className="text-sm font-bold">{formatPrice(sub.plan.price)} so'm</span>
                      </div>
                      
                      {/* Dates */}
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>Boshlanish:</span>
                        </div>
                        <span>{new Date(sub.startedAt).toLocaleDateString('uz-UZ')}</span>
                        
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>Tugash:</span>
                        </div>
                        <span className={isExpiringSoon ? 'text-orange-300' : ''}>
                          {new Date(sub.expiresAt).toLocaleDateString('uz-UZ')}
                        </span>
                      </div>

                      {/* Days Remaining */}
                      {!isExpired && (
                        <div className={`text-xs px-2 py-1 rounded ${
                          isExpiringSoon 
                            ? 'bg-orange-500/20 text-orange-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {isExpiringSoon 
                            ? `⏳ ${daysRemaining} kun qoldi`
                            : `${daysRemaining} kun qoldi`
                          }
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(sub)}
                        className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm"
                      >
                        <Edit size={12} />
                        <span className="hidden sm:inline">Tahrirlash</span>
                        <span className="sm:hidden">Tahrir</span>
                      </button>

                      <button
                        onClick={() => handleDeleteSubscription(sub.id)}
                        className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm"
                      >
                        <Trash2 size={12} />
                        <span className="hidden sm:inline">O'chirish</span>
                        <span className="sm:hidden">O'chir</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  /* ================= STATS GRID (DESKTOP) ================= */
  const StatsGrid = () => (
    <div className="hidden lg:grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-5 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Jami Obunalar</p>
            <p className="text-2xl font-bold mt-2">{stats.total}</p>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
            <CreditCard size={24} className="text-white" />
          </div>
        </div>
      </div>
      <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-5 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Faol Obunalar</p>
            <p className="text-2xl font-bold mt-2">{stats.active}</p>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
            <Zap size={24} className="text-white" />
          </div>
        </div>
      </div>
      <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-5 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Muddati Tugagan</p>
            <p className="text-2xl font-bold mt-2">{stats.expired}</p>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-r from-red-500 to-rose-500">
            <Clock size={24} className="text-white" />
          </div>
        </div>
      </div>
      <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-5 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Tugash Arafasi</p>
            <p className="text-2xl font-bold mt-2">{stats.expiringSoon}</p>
          </div>
          <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500">
            <AlertCircle size={24} className="text-white" />
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
                <Crown className="text-purple-400" size={28} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Foydalanuvchi Obunalari
                </h1>
                <p className="text-gray-400 text-sm sm:text-base">
                  Foydalanuvchi obunalarini boshqaring va yangilarini qo'shing
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <MobileNav />

          {/* Desktop Stats */}
          <StatsGrid />

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-1 gap-8">
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