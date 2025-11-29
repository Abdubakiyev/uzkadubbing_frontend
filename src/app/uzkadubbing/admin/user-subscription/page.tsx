"use client";

import { useEffect, useState } from "react";
import { Plus, Crown, Calendar, User, CreditCard, Trash2, Zap, Users, Clock, DollarSign } from "lucide-react";
import Sidebar from "@/src/components/AdminSideber";
import { UserSubscription } from "@/src/features/types/User-subscrition";
import { SubscriptionPlan } from "@/src/features/types/Subscription-plan";
import { UserForm } from "@/src/features/types/User";
import { createSubscription, deleteSubscription, fetchSubscriptions } from "@/src/features/api/User-subscription";
import { fetchPlans } from "@/src/features/api/Subscription-plan";
import { fetchUsers } from "@/src/features/api/Users";

export default function UserSubscriptionAdminPage() {
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [users, setUsers] = useState<UserForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FORM STATE
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
      alert("Ma'lumotlarni yuklashda xatolik yuz berdi!");
    } finally {
      setLoading(false);
    }
  };

  // CREATE SUBSCRIPTION
  const handleCreateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !planId) return alert("Foydalanuvchi va reja tanlanishi kerak!");
    
    setIsSubmitting(true);
    try {
      const newSub = await createSubscription({ userId, planId });
      setSubscriptions(prev => [newSub, ...prev]);
      setUserId("");
      setPlanId("");
      alert("Obuna muvaffaqiyatli qo'shildi!");
    } catch (err: any) {
      console.error("Create error:", err);
      alert(err.message || "Server xatosi!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // DELETE
  const handleDeleteSubscription = async (id: string) => {
    if (!confirm("Ushbu obuna o'chiriladi. Tasdiqlaysizmi?")) return;

    try {
      await deleteSubscription(id);
      setSubscriptions(prev => prev.filter(s => s.id !== id));
      alert("Obuna muvaffaqiyatli o'chirildi!");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Server xatosi!");
    }
  };

  // STATS
  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.isActive).length,
    expired: subscriptions.filter(s => !s.isActive).length,
  };

  const formatPrice = (price: number) => new Intl.NumberFormat("uz-UZ").format(price);

  const getDaysRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getPlanColor = (planName: string) => {
    const colors = {
      Basic: "from-blue-500 to-cyan-500",
      Standard: "from-green-500 to-emerald-500",
      Premium: "from-purple-500 to-pink-500",
      Pro: "from-orange-500 to-red-500",
      VIP: "from-yellow-500 to-amber-500",
    };
    return colors[planName as keyof typeof colors] || "from-gray-500 to-gray-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex">
      
      {/* ================= SIDEBAR ================= */}
      <Sidebar/>
      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Crown className="text-purple-400" size={32} />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Foydalanuvchi Obunalari
              </h1>
            </div>
            <p className="text-gray-400">Foydalanuvchi obunalarini boshqaring va yangilarini qo'shing</p>
          </div>
  
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-5 border border-gray-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Jami Obunalar</p>
                  <p className="text-2xl font-bold mt-2">{stats.total}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500">
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
                <div className="p-3 rounded-lg bg-green-500">
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
                <div className="p-3 rounded-lg bg-red-500">
                  <Clock size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ================= CREATE FORM ================= */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 shadow-lg sticky top-6">
                <div className="flex items-center gap-2 mb-6">
                  <Plus className="text-green-400" size={24} />
                  <h2 className="text-xl font-bold">Yangi Obuna Qo'shish</h2>
                </div>
  
                <form onSubmit={handleCreateSubscription} className="space-y-4">
                  {/* User Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Foydalanuvchi Tanlash
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <select
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all appearance-none"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                      >
                        <option value="">Foydalanuvchi tanlang...</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.username || user.email}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
  
                  {/* Plan Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Obuna Rejasi
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <select
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all appearance-none"
                        value={planId}
                        onChange={(e) => setPlanId(e.target.value)}
                        required
                      >
                        <option value="">Reja tanlang...</option>
                        {plans.map((plan) => (
                          <option key={plan.id} value={plan.id}>
                            {plan.name} — {formatPrice(plan.price)} so'm ({plan.duration} kun)
                          </option>
                        ))}
                      </select>
                    </div>
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
                        Obuna Qo'shish
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
  
            {/* ================= SUBSCRIPTIONS LIST ================= */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Users className="text-blue-400" size={24} />
                    <h2 className="text-xl font-bold">Barcha Obunalar</h2>
                  </div>
                  <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                    {subscriptions.length} ta obuna
                  </div>
                </div>
  
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : subscriptions.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="mx-auto mb-4 text-gray-500" size={48} />
                    <p className="text-gray-400 text-lg">Hozircha obunalar mavjud emas.</p>
                    <p className="text-gray-500 text-sm mt-2">Yuqoridagi form orqali yangi obuna qo'shing</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {subscriptions.map((sub) => {
                      const daysRemaining = getDaysRemaining(sub.expiresAt);
                      const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;
                      
                      return (
                        <div
                          key={sub.id}
                          className="bg-gray-700/30 rounded-lg border border-gray-600/30 hover:bg-gray-700/50 transition-all p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <div className={`p-3 rounded-lg bg-gradient-to-r ${getPlanColor(sub.plan.name)}`}>
                                <Crown size={20} className="text-white" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h3 className="font-bold text-lg">
                                      {sub.user?.username || sub.user?.email}
                                    </h3>
                                    <p className="text-gray-400 text-sm">
                                      {sub.user?.email}
                                    </p>
                                  </div>
                                  
                                  <div className="flex gap-2">
                                    <div className={`px-2 py-1 rounded-full text-xs ${
                                      sub.isActive 
                                        ? 'bg-green-500/20 text-green-300' 
                                        : 'bg-red-500/20 text-red-300'
                                    }`}>
                                      {sub.isActive ? '🟢 Faol' : '🔴 Muddati Tugagan'}
                                    </div>
                                    {sub.isActive && isExpiringSoon && (
                                      <div className="px-2 py-1 rounded-full text-xs bg-orange-500/20 text-orange-300">
                                        ⏳ {daysRemaining} kun qoldi
                                      </div>
                                    )}
                                  </div>
                                </div>
  
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                      <CreditCard size={14} className="text-gray-400" />
                                      <span className="text-gray-300">Reja:</span>
                                      <span className="font-semibold">{sub.plan.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                      <DollarSign size={14} className="text-gray-400" />
                                      <span className="text-gray-300">Narx:</span>
                                      <span className="font-semibold">{formatPrice(sub.plan.price)} so'm</span>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                      <Calendar size={14} className="text-gray-400" />
                                      <span className="text-gray-300">Boshlanish:</span>
                                      <span>{new Date(sub.startedAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                      <Clock size={14} className="text-gray-400" />
                                      <span className="text-gray-300">Tugash:</span>
                                      <span className={isExpiringSoon ? 'text-orange-300' : ''}>
                                        {new Date(sub.expiresAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
  
                            <button
                              onClick={() => deleteSubscription(sub.id)}
                              className="flex items-center gap-2 px-3 py-2 bg-red-600/20 text-red-300 rounded-lg hover:bg-red-600/30 transition-colors text-sm ml-4"
                            >
                              <Trash2 size={14} />
                              O'chirish
                            </button>
                          </div>
                        </div>
                      );
                    })}
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