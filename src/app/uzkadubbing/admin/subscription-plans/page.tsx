"use client";

import { useEffect, useState } from "react";
import { 
  Plus, 
  CreditCard, 
  Edit, 
  Trash2, 
  X, 
  Check, 
  XCircle,
  Calendar,
  DollarSign,
  Tag,
  Loader2,
  TrendingUp,
  RefreshCw,
  ArrowLeft,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Shield,
  Zap,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Sidebar from "@/src/components/AdminSideber";
import { SubscriptionPlan } from "@/src/features/types/Subscription-plan";
import {
  createPlan,
  deletePlan,
  fetchPlans,
  updatePlan,
} from "@/src/features/api/Subscription-plan";

export default function AdminSubscriptionPlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "form">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [showFilters, setShowFilters] = useState(false);

  /* ================= FORM STATE ================= */
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [duration, setDuration] = useState<number | "">("");
  const [isActive, setIsActive] = useState(true);

  /* ================= LOAD ================= */
  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const data = await fetchPlans();
      setPlans(data);
    } catch (err) {
      console.error(err);
      alert("❌ Rejalarni yuklashda xatolik!");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET FORM ================= */
  const resetForm = () => {
    setEditingPlan(null);
    setName("");
    setPrice("");
    setDuration("");
    setIsActive(true);
  };

  /* ================= START EDIT ================= */
  const startEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setName(plan.name);
    setPrice(plan.price);
    setDuration(plan.duration);
    setIsActive(plan.isActive);
    setActiveTab("form");
  };

  /* ================= SAVE (CREATE / UPDATE) ================= */
  const savePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      alert("⚠️ Reja nomini kiriting!");
      return;
    }
    if (!price || price < 0) {
      alert("⚠️ To'g'ri narx kiriting!");
      return;
    }
    if (!duration || duration < 1) {
      alert("⚠️ Muddatni kiriting (kamida 1 kun)!");
      return;
    }

    setIsSubmitting(true);

    try {
      const dto = {
        name: name.trim(),
        price: Number(price),
        duration: Number(duration),
        isActive,
      };

      let savedPlan: SubscriptionPlan;

      if (editingPlan) {
        // UPDATE
        savedPlan = await updatePlan(editingPlan.id, dto);
        setPlans((prev) =>
          prev.map((p) => (p.id === savedPlan.id ? savedPlan : p))
        );
        alert("✅ Reja yangilandi!");
      } else {
        // CREATE
        savedPlan = await createPlan(dto);
        setPlans((prev) => [savedPlan, ...prev]);
        alert("✅ Yangi reja qo'shildi!");
      }

      resetForm();
      
      // Mobile uchun avtomatik ro'yxatga o'tish
    } catch (err: any) {
      console.error(err);
      alert(err.message || "❌ Xatolik yuz berdi!");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    if (!confirm("⚠️ Rostdan ham o'chirmoqchimisiz?")) return;

    try {
      await deletePlan(id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
      alert("✅ Reja o'chirildi!");
    } catch (err) {
      console.error(err);
      alert("❌ Server xatosi!");
    }
  };

  /* ================= FILTERED PLANS ================= */
  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.price.toString().includes(searchTerm)
  ).filter(plan =>
    statusFilter === "ALL" ||
    (statusFilter === "ACTIVE" && plan.isActive) ||
    (statusFilter === "INACTIVE" && !plan.isActive)
  );

  /* ================= FORMAT PRICE ================= */
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + " so'm";
  };

  /* ================= STATS ================= */
  const stats = {
    total: plans.length,
    active: plans.filter(p => p.isActive).length,
    inactive: plans.filter(p => !p.isActive).length,
    totalRevenue: plans.reduce((sum, plan) => sum + plan.price, 0),
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
          📋 Rejalar
        </button>
        <button
          onClick={() => setActiveTab("form")}
          className={`flex-1 py-2 rounded-md text-center text-sm ${
            activeTab === "form" 
              ? "bg-purple-600/30 text-purple-300" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          {editingPlan ? "✏️ Tahrirlash" : "➕ Yangi"}
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
              {editingPlan ? (
                <Edit className="text-yellow-400" size={18} />
              ) : (
                <Plus className="text-green-400" size={18} />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold">
                {editingPlan ? "Rejani tahrirlash" : "Yangi reja"}
              </h2>
              <p className="text-xs text-gray-400">
                {editingPlan ? "Mavjud rejani yangilang" : "Yangi reja yarating"}
              </p>
            </div>
          </div>
        </div>
        {editingPlan && (
          <button
            onClick={resetForm}
            className="p-1.5 hover:bg-gray-700/50 rounded-lg"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <form onSubmit={savePlan} className="space-y-4">
        {/* Reja nomi */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Reja nomi</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masalan: Premium reja"
            className="w-full px-3 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            required
          />
        </div>

        {/* Narx */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Narx (so'm)</label>
          <input
            type="number"
            value={price}
            min={0}
            step={1000}
            onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
            placeholder="Masalan: 50000"
            className="w-full px-3 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            required
          />
        </div>

        {/* Muddat */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Muddat (kun)</label>
          <input
            type="number"
            value={duration}
            min={1}
            onChange={(e) => setDuration(e.target.value ? Number(e.target.value) : "")}
            placeholder="Masalan: 30"
            className="w-full px-3 py-2.5 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            required
          />
        </div>

        {/* Status */}
        <div className="p-3 bg-gray-700/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isActive ? (
                <div className="bg-green-500/20 p-1 rounded">
                  <Check className="text-green-400" size={16} />
                </div>
              ) : (
                <div className="bg-red-500/20 p-1 rounded">
                  <XCircle className="text-red-400" size={16} />
                </div>
              )}
              <div>
                <p className="font-medium text-sm">Status</p>
                <p className="text-xs text-gray-400">
                  {isActive ? "Faol reja" : "Nofaol reja"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                isActive ? 'bg-green-500' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                  isActive ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Kunlik narx */}
        {price && duration && (
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <p className="text-xs text-gray-300 text-center">
              Kunlik: {formatPrice(Math.round(Number(price) / Number(duration)))}
            </p>
          </div>
        )}

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
            ) : editingPlan ? (
              "💾 Yangilash"
            ) : (
              "➕ Qo'shish"
            )}
          </button>

          {(editingPlan) && (
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
            <CreditCard className="text-blue-400" size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold">Barcha rejalar</h2>
            <p className="text-xs text-gray-400">
              {filteredPlans.length} ta • Jami {plans.length} ta
            </p>
          </div>
        </div>
        <button
          onClick={loadPlans}
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
          <div className="p-3 bg-gray-700/30 rounded-lg">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "ALL" | "ACTIVE" | "INACTIVE")}
              className="w-full px-2 py-1.5 bg-gray-700/50 border border-gray-600 rounded text-sm"
            >
              <option value="ALL">Barcha holat</option>
              <option value="ACTIVE">Faol</option>
              <option value="INACTIVE">Nofaol</option>
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
          <div className="text-lg font-bold">{stats.inactive}</div>
          <div className="text-xs text-gray-400">Nofaol</div>
        </div>
        <div className="bg-gray-700/30 rounded p-2 text-center">
          <div className="text-lg font-bold">{formatPrice(stats.totalRevenue)}</div>
          <div className="text-xs text-gray-400">Jami daromad</div>
        </div>
      </div>

      {/* Plans List */}
      {loading ? (
        <div className="text-center py-8">
          <Loader2 className="animate-spin mx-auto mb-2" size={24} />
          <p className="text-sm text-gray-400">Rejalar yuklanmoqda...</p>
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="text-center py-8">
          <CreditCard className="mx-auto mb-2 text-gray-500" size={32} />
          <p className="text-gray-400 text-sm">
            {searchTerm || statusFilter !== "ALL" 
              ? "Qidiruv bo'yicha reja topilmadi" 
              : "Hozircha reja mavjud emas"}
          </p>
          {(searchTerm || statusFilter !== "ALL") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("ALL");
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
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative overflow-hidden rounded-lg border transition-colors ${
                plan.isActive
                  ? 'border-green-500/30 bg-gray-700/30 hover:bg-gray-700/50'
                  : 'border-red-500/30 bg-gray-700/20 hover:bg-gray-700/40'
              }`}
            >
              {/* Status badge */}
              <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs ${
                plan.isActive
                  ? 'bg-green-500/20 text-green-300'
                  : 'bg-red-500/20 text-red-300'
              }`}>
                {plan.isActive ? 'Faol' : 'Nofaol'}
              </div>

              <div className="p-3">
                {/* Plan name */}
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg ${plan.isActive ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    <TrendingUp size={16} className={plan.isActive ? 'text-green-400' : 'text-red-400'} />
                  </div>
                  <h3 className="font-bold text-sm">{plan.name}</h3>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="text-green-400" size={14} />
                    <span className="font-bold">{formatPrice(plan.price)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="text-blue-400" size={14} />
                    <span className="text-gray-300 text-sm">{plan.duration} kun</span>
                  </div>

                  <div className="text-xs text-gray-400">
                    Kunlik: {formatPrice(Math.round(plan.price / plan.duration))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1">
                  <button
                    onClick={() => startEdit(plan)}
                    className="flex-1 flex items-center justify-center gap-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 py-1.5 rounded text-xs"
                  >
                    <Edit size={12} />
                    Tahrir
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="flex-1 flex items-center justify-center gap-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 py-1.5 rounded text-xs"
                  >
                    <Trash2 size={12} />
                    O'chir
                  </button>
                </div>
              </div>
            </div>
          ))}
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
            <p className="text-gray-400 text-sm">Jami Rejalar</p>
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
            <p className="text-gray-400 text-sm">Faol Rejalar</p>
            <p className="text-xl font-bold mt-1">{stats.active}</p>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
            <CheckCircle size={18} className="text-white" />
          </div>
        </div>
      </div>
      <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Nofaol Rejalar</p>
            <p className="text-xl font-bold mt-1">{stats.inactive}</p>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-500">
            <XCircle size={18} className="text-white" />
          </div>
        </div>
      </div>
      <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-4 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Jami Daromad</p>
            <p className="text-xl font-bold mt-1">{formatPrice(stats.totalRevenue)}</p>
          </div>
          <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500">
            <DollarSign size={18} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 pl-20">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-2 rounded-lg">
                <CreditCard className="text-purple-400" size={20} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Obuna Rejalari
                </h1>
                <p className="text-gray-400 text-sm">
                  Obuna rejalarini boshqarish paneli
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
      </div>
    </div>
  );
}