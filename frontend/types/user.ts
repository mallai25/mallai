export type UserType = "seller" | "buyer" | "admin" | "agent";

export interface UserData {
  uid: string;
  email: string;
  userType: UserType;
  displayName: string;
  location: string;
  photoURL?: string;
  subscriptionPlan?: "Basic" | "Pro" | "Conditioned";
  subscriptionEndDate?: Date;
  phone?: string;
  listings?: string[];
  favorites?: string[];
  accountVerified?: boolean;
  lastActive?: Date;
}
