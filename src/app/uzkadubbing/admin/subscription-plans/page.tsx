"use client";

import { useEffect, useState } from "react";
import { Plus, Crown, Calendar, DollarSign, Trash2, Eye, CreditCard, Zap, Star } from "lucide-react";
import Sidebar from "@/src/components/AdminSideber";
import { SubscriptionPlan } from "@/src/features/types/Subscription-plan";
import { createPlan, deletePlan, fetchPlans, updatePlan } from "@/src/features/api/Subscription-plan";

export default function AdminSubscriptionPlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [duration, setDuration] = useState<number>(30);
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    loadPlans();
  }, []);

  // Fetch all plans
  const loadPlans = async () => {
    try {
      const data = await fetchPlans();
      setPlans(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create plan
  const handleCreatePlan = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      // API faqat kerakli fieldlarni qabul qiladi
      const newPlan = await createPlan({
        name,
        price,
        duration,
        isActive,
      }); // ❌ createPlan tipini Omit<"id" | "createdAt"> qilib o'zgartiring
  
      // Plans ro'yxatiga qo'shish
      setPlans(prev => [newPlan, ...prev]);
  
      // Formni tozalash
      setName("");
      setPrice(0);
      setDuration(30);
      setIsActive(true);
  
      alert("Yangi obuna rejasi qo'shildi!");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Server xatosi!");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  // Update plan
  const handleUpdatePlan = async (plan: SubscriptionPlan) => {
    const newName = prompt("Yangi nom:", plan.name);
    if (!newName) return;
    try {
      const updated = await updatePlan(plan.id, { name: newName });
      setPlans(prev => prev.map(p => (p.id === plan.id ? updated : p)));
      alert("Obuna rejasi yangilandi!");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Yangilashda xatolik!");
    }
  };

  // Delete plan
  const handleDeletePlan = async (id: string) => {
    if (!confirm("Bu obunani o'chirishni istaysizmi?")) return;
    try {
      await deletePlan(id);
      setPlans(prev => prev.filter(p => p.id !== id));
      alert("Obuna rejasi o'chirildi!");
    } catch (err) {
      console.error(err);
      alert("Server xatosi!");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
  
      {/* SIDEBAR */}
      <Sidebar />
  
      {/* MAIN CONTENT */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="text-purple-400" size={32} />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Obuna Rejalari
              </h1>
            </div>
            <p className="text-gray-400">Obuna rejalarini boshqaring va yangilarini qo'shing</p>
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* CREATE FORM */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 shadow-lg sticky top-6">
                <div className="flex items-center gap-2 mb-6">
                  <Plus className="text-green-400" size={24} />
                  <h2 className="text-xl font-bold">Yangi Obuna Rejasi</h2>
                </div>
  
                <form onSubmit={handleCreatePlan} className="space-y-4">
                  
                  {/* Plan Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Reja Nomi
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg"
                      placeholder="Masalan: Premium"
                      required
                    />
                  </div>
  
                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Narx (so'm)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="number"
                        value={price}
                        min={0}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg"
                        placeholder="20000"
                        required
                      />
                    </div>
                  </div>
  
                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Muddat (kun)
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="number"
                        value={duration}
                        min={1}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg"
                        placeholder="30"
                        required
                      />
                    </div>
                  </div>
  
                  {/* Active Switch */}
                  <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600/30">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
                      <span className="text-sm font-medium">Faol Reja</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 rounded-full peer-checked:bg-green-600 
                        after:absolute after:top-[2px] after:left-[2px] 
                        after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all
                        peer-checked:after:translate-x-full">
                      </div>
                    </label>
                  </div>
  
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 rounded-lg"
                  >
                    {isSubmitting ? "Qo‘shilmoqda..." : "Reja Qo‘shish"}
                  </button>
                </form>
              </div>
            </div>
  
            {/* PLANS LIST */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/40 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50 shadow-lg">
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Crown className="text-blue-400" size={24} />
                    <h2 className="text-xl font-bold">Barcha Obuna Rejalari</h2>
                  </div>
                  <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                    {plans.length} ta reja
                  </span>
                </div>
  
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {plans.map((plan) => (
                      <div
                        key={plan.id}
                        className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 p-6 rounded-xl border border-gray-600/30"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="font-bold text-lg">{plan.name}</h3>
                        </div>
  
                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Narx:</span>
                            <span className="font-semibold">{plan.price} so'm</span>
                          </div>
  
                          <div className="flex justify-between">
                            <span className="text-gray-400">Muddat:</span>
                            <span>{plan.duration} kun</span>
                          </div>
                        </div>
  
                        <div className="flex gap-2 pt-4 border-t border-gray-600/30">
                          <button
                            onClick={() => deletePlan(plan.id)}
                            className="flex-1 px-3 py-2 bg-red-600/20 rounded-lg text-red-300"
                          >
                            O‘chirish
                          </button>
  
                          <button className="flex-1 px-3 py-2 bg-gray-600/20 rounded-lg text-gray-300">
                            Ko‘rish
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
  
              </div>
            </div>
  
          </div>
        </div>
      </div>
  
    </div>
  );
  
}