export interface UserForm {
    id: string;
    email?: string; 
    password: string;
    firstName?: string;
    lastName?: string;
    username: string;
    avatar?: string;
    role?: "USER" | "ADMIN"; // yoki UserRole enumini import qilishingiz mumkin
    isSubscribed?: boolean;
    isVerify?: boolean;
  };
  