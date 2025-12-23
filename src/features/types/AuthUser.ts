export interface AuthUser {
    id: string;
    username: string;
    email?: string;
    avatar?: string;
    role?: "USER" | "ADMIN";
    isSubscribed: boolean;
    isVerify?: boolean;
  }
  