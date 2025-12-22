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
  RefreshCw
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
      alert("Reja nomini kiriting!");
      return;
    }
    if (!price || price < 0) {
      alert("To'g'ri narx kiriting!");
      return;
    }
    if (!duration || duration < 1) {
      alert("Muddatni kiriting (kamida 1 kun)!");
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
      if (window.innerWidth < 1024) {
        setActiveTab("list");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "❌ Xatolik yuz berdi!");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    if (!confirm("Rostdan ham o'chirmoqchimisiz?")) return;

    try {
      await deletePlan(id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
      alert("✅ Reja o'chirildi!");
    } catch (err) {
      console.error(err);
      alert("❌ Server xatosi!");
    }
  };

  /* ================= FILTER PLANS ================= */
  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.price.toString().includes(searchTerm)
  );

  /* ================= FORMAT PRICE ================= */
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + " so'm";
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
          📋 Rejalar
        </button>
        <button
          onClick={() => setActiveTab("form")}
          className={`flex-1 py-2 rounded-md text-center ${
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
    <div className="bg-gray-800/40 p-4 sm:p-6 rounded-xl border border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-2 rounded-lg">
            {editingPlan ? (
              <Edit className="text-yellow-400" size={20} />
            ) : (
              <Plus className="text-green-400" size={20} />
            )}
          </div>
          <h2 className="text-lg sm:text-xl font-bold">
            {editingPlan ? "Rejani tahrirlash" : "Yangi reja yaratish"}
          </h2>
        </div>
        {editingPlan && (
          <button
            onClick={resetForm}
            className="p-2 hover:bg-gray-700/50 rounded-lg"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <form onSubmit={savePlan} className="space-y-5">
        {/* Reja nomi */}
        <div>
          <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
            <Tag size={16} />
            Reja nomi
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masalan: Premium reja"
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        {/* Narx */}
        <div>
          <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
            <DollarSign size={16} />
            Narx (so'm)
          </label>
          <input
            type="number"
            value={price}
            min={0}
            step={1000}
            onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : "")}
            placeholder="Masalan: 50000"
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        {/* Muddat */}
        <div>
          <label className="flex items-center gap-2 text-sm text-gray-300 mb-2">
            <Calendar size={16} />
            Muddat (kun)
          </label>
          <input
            type="number"
            value={duration}
            min={1}
            onChange={(e) => setDuration(e.target.value ? Number(e.target.value) : "")}
            placeholder="Masalan: 30"
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        {/* Status */}
        <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
          <div className="flex items-center gap-3">
            {isActive ? (
              <div className="bg-green-500/20 p-1.5 rounded">
                <Check className="text-green-400" size={18} />
              </div>
            ) : (
              <div className="bg-red-500/20 p-1.5 rounded">
                <XCircle className="text-red-400" size={18} />
              </div>
            )}
            <div>
              <p className="font-medium">Status</p>
              <p className="text-sm text-gray-400">
                {isActive ? "Faol reja" : "Nofaol reja"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isActive ? 'bg-green-500' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isActive ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
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
            ) : editingPlan ? (
              "💾 Saqlash"
            ) : (
              "➕ Qo'shish"
            )}
          </button>

          {(editingPlan || window.innerWidth < 1024) && (
            <button
              type="button"
              onClick={resetForm}
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
    <div className="bg-gray-800/40 p-4 sm:p-6 rounded-xl border border-gray-700/50">
      {/* Header with search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold mb-1">📋 Barcha rejalar</h2>
          <p className="text-sm text-gray-400">
            Jami {plans.length} ta reja ({filteredPlans.length} ta ko'rsatilmoqda)
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Qidirish..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Tag className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <button
            onClick={loadPlans}
            className="p-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg"
            title="Yangilash"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <Loader2 className="animate-spin mx-auto mb-3" size={32} />
          <p className="text-gray-400">Rejalar yuklanmoqda...</p>
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="text-center py-10 bg-gray-800/30 rounded-lg">
          <CreditCard className="mx-auto mb-3 text-gray-500" size={48} />
          <p className="text-gray-400 mb-2">
            {searchTerm ? "Qidiruv bo'yicha reja topilmadi" : "Hozircha reja mavjud emas"}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-purple-400 hover:text-purple-300"
            >
              Filterni tozalash
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative overflow-hidden rounded-xl border transition-all ${
                plan.isActive
                  ? 'border-green-500/30 bg-gray-800/40 hover:bg-gray-800/60'
                  : 'border-red-500/30 bg-gray-800/20 hover:bg-gray-800/40'
              }`}
            >
              {/* Status badge */}
              <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${
                plan.isActive
                  ? 'bg-green-500/20 text-green-300'
                  : 'bg-red-500/20 text-red-300'
              }`}>
                {plan.isActive ? 'Faol' : 'Nofaol'}
              </div>

              <div className="p-5">
                {/* Plan name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-2 rounded-lg">
                    <TrendingUp size={20} />
                  </div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="text-green-400" size={18} />
                    <span className="text-2xl font-bold">{formatPrice(plan.price)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="text-blue-400" size={18} />
                    <span className="text-gray-300">{plan.duration} kun</span>
                  </div>

                  <div className="text-sm text-gray-400 mt-4">
                    Kunlik: {formatPrice(Math.round(plan.price / plan.duration))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(plan)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 py-2.5 rounded-lg text-sm"
                  >
                    <Edit size={16} />
                    Tahrirlash
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 py-2.5 rounded-lg text-sm"
                  >
                    <Trash2 size={16} />
                    O'chirish
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-3 rounded-xl">
                <CreditCard className="text-purple-400" size={28} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Obuna Rejalari
                </h1>
                <p className="text-gray-400 text-sm sm:text-base">
                  Obuna rejalarini boshqarish paneli
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <MobileNav />

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
      </div>
    </div>
  );
}