export interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    duration: number;
    isActive: boolean;
    createdAt: string; // ❗ required
  }
  