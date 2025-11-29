// frontend/src/api/userSubscriptions.ts

import { SubscriptionPlan } from "../types/Subscription-plan";
import { UserForm } from "../types/User";
import { UserSubscription } from "../types/User-subscrition";

const BASE_URL = "http://localhost:3000/user-subscriptions";

// 1. Get all subscriptions
export const fetchSubscriptions = async (): Promise<UserSubscription[]> => {
  const res = await fetch(`${BASE_URL}/user-subscriptions`);
  if (!res.ok) throw new Error("Fetch subscriptions error");
  return res.json();
};

// 2. Create subscription
export const createSubscription = async (body: { userId: string; planId: string }): Promise<UserSubscription> => {
  const res = await fetch(`${BASE_URL}/user-subscriptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
};

// 3. Delete subscription
export const deleteSubscription = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/user-subscriptions/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Delete subscription error");
};

// 4. Get all plans
export const fetchPlans = async (): Promise<SubscriptionPlan[]> => {
  const res = await fetch(`${BASE_URL}/subscription-plans`);
  if (!res.ok) throw new Error("Fetch plans error");
  return res.json();
};
