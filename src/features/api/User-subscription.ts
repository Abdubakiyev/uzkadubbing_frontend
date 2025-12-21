import { SubscriptionPlan } from "../types/Subscription-plan";
import { UserSubscription } from "../types/User-subscrition";

const BASE_URL = "http://localhost:3000/user-subscriptions";
const PLANS_URL = "http://localhost:3000/subscription-plans";

// 🇦🇿 Token olish helper
const getToken = () => localStorage.getItem("access_token");

// 1. Get all subscriptions
export const fetchSubscriptions = async (): Promise<UserSubscription[]> => {
  const token = getToken();
  const res = await fetch(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Fetch subscriptions error");
  return res.json();
};

// 2. Create subscription with startedAt & expiresAt
export const createSubscription = async (
  body: { userId: string; planId: string },
  plans: SubscriptionPlan[] // bu yerga barcha rejalarni yuboramiz
): Promise<UserSubscription> => {
  const token = getToken();

  // Tanlangan planni olish
  const selectedPlan = plans.find(p => p.id === body.planId);
  if (!selectedPlan) throw new Error("Reja topilmadi");

  // Sanalarni hisoblash
  const startedAt = new Date();
  const expiresAt = new Date();
  expiresAt.setDate(startedAt.getDate() + selectedPlan.duration);

  // Backendga yuboriladigan body
  const payload = {
    ...body,
    startedAt: startedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
};

// 3. Delete subscription
export const deleteSubscription = async (id: string): Promise<void> => {
  const token = getToken();
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Delete subscription error");
};

// 5. Update subscription
export const updateSubscription = async (
  id: string,
  body: { userId?: string; planId?: string }
): Promise<UserSubscription> => {
  const token = getToken();

  // Backendga yuboriladigan body
  const payload: any = { ...body };

  // Agar planId berilgan bo'lsa, startedAt va expiresAt qayta hisoblanadi
  if (body.planId) {
    const plans = await fetchPlans();
    const selectedPlan = plans.find(p => p.id === body.planId);
    if (!selectedPlan) throw new Error("Reja topilmadi");

    const startedAt = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(startedAt.getDate() + selectedPlan.duration);

    payload.startedAt = startedAt.toISOString();
    payload.expiresAt = expiresAt.toISOString();
  }

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH", // yoki PUT, agar backend shunga mos bo'lsa
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
};


// 4. Get all plans
export const fetchPlans = async (): Promise<SubscriptionPlan[]> => {
  const token = getToken();
  const res = await fetch(PLANS_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Fetch plans error");
  return res.json();
};
