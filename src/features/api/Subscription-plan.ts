import { SubscriptionPlan } from "../types/Subscription-plan";

const BASE_URL = "http://localhost:3000/subscription-plans";

// 1. Get all plans
export const fetchPlans = async (): Promise<SubscriptionPlan[]> => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Fetch error");
  return res.json();
};

// 2. Create plan
// api/subscriptionPlans.ts
export const createPlan = async (
    body: Omit<SubscriptionPlan, "id" | "createdAt">
  ): Promise<SubscriptionPlan> => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(JSON.stringify(error));
    }
    return res.json();
  };  

// 3. Update plan
export const updatePlan = async (
  id: string,
  body: Partial<Omit<SubscriptionPlan, "id">>
): Promise<SubscriptionPlan> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH", // yoki PUT sizning backendga qarab
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(JSON.stringify(error));
  }
  return res.json();
};

// 4. Delete plan
export const deletePlan = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Delete error");
};