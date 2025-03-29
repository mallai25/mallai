
export type UserType = "founder" | "investor" | "eventPlanner" | undefined;

export interface UserData {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  userType?: UserType;
  location?: string;
  subscriptionPlan?: string;
  subscriptionEndDate?: Date;
}
