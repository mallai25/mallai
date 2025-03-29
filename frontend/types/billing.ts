
import { ReactNode } from 'react';

export interface PlanFeature {
  name: string;
  icon: ReactNode;
  free: boolean;
  premium: boolean;
}

export interface SubscriptionPlan {
  title: string;
  description: string;
  price: string | null;
  features: PlanFeature[];
  current: boolean;
}
