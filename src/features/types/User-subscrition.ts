import { SubscriptionPlan } from "./Subscription-plan";
import { UserForm } from "./User";

 export interface UserSubscription {
    id: string;
    userId: string;
    planId: string;
    startedAt: string;
    expiresAt: string;
    isActive: boolean;
    user: UserForm;
    plan: SubscriptionPlan;
  }