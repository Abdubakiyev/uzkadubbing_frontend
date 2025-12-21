"use client";

import { useEffect, useState } from "react";
import { Plus, CreditCard } from "lucide-react";
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

  /* ================= FORM STATE ================= */
  const [editingPlan, setEditingPlan] =
    useState<SubscriptionPlan | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [duration, setDuration] = useState(30);
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
    setPrice(0);
    setDuration(30);
    setIsActive(true);
  };

  /* ================= START EDIT ================= */
  const startEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setName(plan.name);
    setPrice(plan.price);
    setDuration(plan.duration);
    setIsActive(plan.isActive);
  };

  /* ================= SAVE (CREATE / UPDATE) ================= */
  const savePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dto = {
        name,
        price,
        duration,
        isActive,
      };

      let savedPlan: SubscriptionPlan;

      if (editingPlan) {
        // UPDATE
        savedPlan = await updatePlan(editingPlan.id, dto);
        setPlans((prev) =>
          prev.map((p) => (p.id === savedPlan.id ? savedPlan : p))
        );
        alert("Reja yangilandi!");
      } else {
        // CREATE
        savedPlan = await createPlan(dto);
        setPlans((prev) => [savedPlan, ...prev]);
        alert("Yangi reja qo‘shildi!");
      }

      resetForm();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Xatolik yuz berdi!");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    if (!confirm("Rostdan ham o‘chirmoqchimisiz?")) return;

    try {
      await deletePlan(id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
      alert("Reja o‘chirildi!");
    } catch (err) {
      console.error(err);
      alert("Server xatosi!");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Sidebar />

      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="mb-8 flex items-center gap-3">
            <CreditCard className="text-purple-400" size={32} />
            <h1 className="text-3xl font-bold">
              Obuna Rejalari
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* FORM */}
            <div>
              <div className="bg-gray-800/40 p-6 rounded-xl border border-gray-700/50 sticky top-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Plus size={20} />
                  {editingPlan ? "Rejani tahrirlash" : "Yangi reja"}
                </h2>

                <form onSubmit={savePlan} className="space-y-4">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Reja nomi"
                    className="w-full px-4 py-3 bg-gray-700 rounded-lg"
                    required
                  />

                  <input
                    type="number"
                    value={price}
                    min={0}
                    onChange={(e) =>
                      setPrice(Number(e.target.value))
                    }
                    placeholder="Narx (so‘m)"
                    className="w-full px-4 py-3 bg-gray-700 rounded-lg"
                    required
                  />

                  <input
                    type="number"
                    value={duration}
                    min={1}
                    onChange={(e) =>
                      setDuration(Number(e.target.value))
                    }
                    placeholder="Muddat (kun)"
                    className="w-full px-4 py-3 bg-gray-700 rounded-lg"
                    required
                  />

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) =>
                        setIsActive(e.target.checked)
                      }
                    />
                    Faol reja
                  </label>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-purple-600 py-3 rounded-lg"
                    >
                      {editingPlan
                        ? "Saqlash"
                        : "Qo‘shish"}
                    </button>

                    {editingPlan && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 bg-gray-600 rounded-lg"
                      >
                        Bekor
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* LIST */}
            <div className="lg:col-span-2 space-y-4">
              {loading ? (
                <p>Yuklanmoqda...</p>
              ) : plans.length === 0 ? (
                <p className="text-gray-400">
                  Hozircha reja yo‘q
                </p>
              ) : (
                plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-gray-700/40 p-5 rounded-xl border border-gray-600/30"
                  >
                    <h3 className="text-lg font-bold">
                      {plan.name}
                    </h3>
                    <p>Narx: {plan.price} so‘m</p>
                    <p>Muddat: {plan.duration} kun</p>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => startEdit(plan)}
                        className="px-3 py-2 bg-blue-600/20 text-blue-300 rounded-lg"
                      >
                        Tahrirlash
                      </button>
                      <button
                        onClick={() => handleDelete(plan.id)}
                        className="px-3 py-2 bg-red-600/20 text-red-300 rounded-lg"
                      >
                        O‘chirish
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
