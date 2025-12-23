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
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  AlertCircle,
  Check,
  XCircle,
  Eye,
  ChevronRight
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
  const [showFilters, setShowFilters] = useState(false);

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
    <div className="lg:hidden mb-4">
      <div className="flex bg-gray-800/50 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("list")}
          className={`flex-1 py-2 rounded-md text-center text-sm ${
            activeTab === "list" 
              ? "bg-purple-600/30 text-purple-300" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          📋 Obunalar
        </button>
        <button
          onClick={() => setActiveTab("form")}
          className={`flex-1 py-2 rounded-md text-center text-sm ${
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
    <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-1.5 rounded-lg">
              {editingSubscription ? (
                <Edit className="text-yellow-400" size={18} />
              ) : (
                <Plus className="text-green-400" size={18} />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {editingSubscription ? "Obunani tahrirlash" : "Yangi obuna"}
              </h2>
              <p className="text-xs text-gray-400">
                {editingSubscription ? "Mavjud obunani yangilang" : "Yangi obuna qo'shing"}
              </p>
            </div>
          </div>
        </div>
        {editingSubscription && (
          <button
            onClick={resetForm}
            className="p-1.5 hover:bg-gray-700/50 rounded-lg"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <form onSubmit={handleSaveSubscription} className="space-y-4">
        {/* Foydalanuvchi tanlash */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Foydalanuvchi tanlash</label>
          <select
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
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
          <label className="block text-sm font-medium text-gray-300 mb-1">Obuna rejasi</label>
          <select
            className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
            required
          >
            <option value="">Reja tanlang...</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} — {formatPrice(plan.price)} so'm
              </option>
            ))}
          </select>
          {planId && (
            <div className="mt-2 p-2 bg-gray-700/30 rounded text-sm">
              {(() => {
                const plan = plans.find(p => p.id === planId);
                return plan ? (
                  <>
                    <div className="font-medium">{plan.name}</div>
                    <div className="text-gray-400 text-xs">
                      {plan.duration} kun • {formatPrice(plan.price)} so'm
                    </div>
                  </>
                ) : null;
              })()}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-2.5 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 text-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Saqlanmoqda...
              </>
            ) : editingSubscription ? (
              "💾 Yangilash"
            ) : (
              "➕ Qo'shish"
            )}
          </button>

          {(editingSubscription) && (
            <button
              type="button"
              onClick={() => {
                resetForm();
              }}
              className="px-4 py-2.5 bg-gray-700/50 hover:bg-gray-700 rounded-lg text-sm"
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
    <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-1.5 rounded-lg">
            <Users className="text-blue-400" size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold">Barcha obunalar</h2>
            <p className="text-xs text-gray-400">
              {filteredSubscriptions.length} ta • Jami {subscriptions.length} ta
            </p>
          </div>
        </div>
        <button
          onClick={loadAll}
          className="p-1.5 bg-gray-700/50 hover:bg-gray-700 rounded-lg"
          title="Yangilash"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-4 space-y-2">
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "ALL" | "ACTIVE" | "EXPIRED")}
              className="w-full px-2 py-1.5 bg-gray-700/50 border border-gray-600 rounded text-sm"
            >
              <option value="ALL">Barcha holat</option>
              <option value="ACTIVE">Faol</option>
              <option value="EXPIRED">Muddati tugagan</option>
            </select>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full px-2 py-1.5 bg-gray-700/50 border border-gray-600 rounded text-sm"
            >
              <option value="ALL">Barcha rejalar</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>{plan.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Stats Cards (Mobile) */}
      <div className="lg:hidden grid grid-cols-2 gap-2 mb-4">
        <div className="bg-gray-700/30 rounded p-2 text-center">
          <div className="text-lg font-bold">{stats.total}</div>
          <div className="text-xs text-gray-400">Jami</div>
        </div>
        <div className="bg-gray-700/30 rounded p-2 text-center">
          <div className="text-lg font-bold">{stats.active}</div>
          <div className="text-xs text-gray-400">Faol</div>
        </div>
        <div className="bg-gray-700/30 rounded p-2 text-center">
          <div className="text-lg font-bold">{stats.expired}</div>
          <div className="text-xs text-gray-400">Tugagan</div>
        </div>
        <div className="bg-gray-700/30 rounded p-2 text-center">
          <div className="text-lg font-bold">{stats.expiringSoon}</div>
          <div className="text-xs text-gray-400">Tugash arafasi</div>
        </div>
      </div>

      {/* Subscriptions List */}
      {loading ? (
        <div className="text-center py-8">
          <Loader2 className="animate-spin mx-auto mb-2" size={24} />
          <p className="text-sm text-gray-400">Obunalar yuklanmoqda...</p>
        </div>
      ) : filteredSubscriptions.length === 0 ? (
        <div className="text-center py-8">
          <CreditCard className="mx-auto mb-2 text-gray-500" size={32} />
          <p className="text-gray-400 text-sm">
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
          {filteredSubscriptions.map((sub) => {
            const daysRemaining = getDaysRemaining(sub.expiresAt);
            const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;
            const isExpired = daysRemaining < 0;

            return (
              <div
                key={sub.id}
                className="bg-gray-700/30 rounded-lg border border-gray-600/30 hover:bg-gray-700/50 p-3"
              >
                <div className="flex items-start gap-2">
                  {/* Plan Icon */}
                  <div className={`p-1.5 rounded-lg bg-gradient-to-r ${getPlanColor(sub.plan.name)} flex-shrink-0`}>
                    <Crown size={16} className="text-white" />
                  </div>

                  {/* Subscription Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm truncate">{sub.user?.username || sub.user?.email}</h3>
                        <p className="text-gray-400 text-xs truncate">{sub.user?.email}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0 ml-2">
                        <span className={`px-1.5 py-0.5 rounded-full text-xs ${
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
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-xs">{sub.plan.name}</span>
                        <span className="text-xs font-bold">{formatPrice(sub.plan.price)} so'm</span>
                      </div>
                      
                      {/* Dates */}
                      <div className="grid grid-cols-2 gap-1 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar size={10} />
                          <span>Boshlanish:</span>
                        </div>
                        <span className="text-xs">{new Date(sub.startedAt).toLocaleDateString('uz-UZ')}</span>
                        
                        <div className="flex items-center gap-1">
                          <Clock size={10} />
                          <span>Tugash:</span>
                        </div>
                        <span className={`text-xs ${isExpiringSoon ? 'text-orange-300' : ''}`}>
                          {new Date(sub.expiresAt).toLocaleDateString('uz-UZ')}
                        </span>
                      </div>
                    </div>

                    {/* Days Remaining */}
                    {!isExpired && (
                      <div className={`text-xs px-2 py-1 rounded mb-2 ${
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

                    {/* Actions */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(sub)}
                        className="flex-1 flex items-center justify-center gap-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 py-1.5 rounded text-xs"
                      >
                        <Edit size={12} />
                        Tahrir
                      </button>

                      <button
                        onClick={() => handleDeleteSubscription(sub.id)}
                        className="flex-1 flex items-center justify-center gap-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 py-1.5 rounded text-xs"
                      >
                        <Trash2 size={12} />
                        O'chir
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
    <div className="hidden lg:grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
      <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Jami Obunalar</p>
            <p className="text-xl font-bold mt-1">{stats.total}</p>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
            <CreditCard size={18} className="text-white" />
          </div>
        </div>
      </div>
      <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Faol Obunalar</p>
            <p className="text-xl font-bold mt-1">{stats.active}</p>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
            <Zap size={18} className="text-white" />
          </div>
        </div>
      </div>
      <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Muddati Tugagan</p>
            <p className="text-xl font-bold mt-1">{stats.expired}</p>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-500">
            <Clock size={18} className="text-white" />
          </div>
        </div>
      </div>
      <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Tugash Arafasi</p>
            <p className="text-xl font-bold mt-1">{stats.expiringSoon}</p>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500">
            <AlertCircle size={18} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-2 rounded-lg">
                <Crown className="text-purple-400" size={20} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Foydalanuvchi Obunalari
                </h1>
                <p className="text-gray-400 text-sm">
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
          <div className="hidden lg:grid lg:grid-cols-3 gap-6">
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