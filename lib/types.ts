export interface SchoolProfile {
  schoolName: string;
  email: string;
  isEmailVerified: boolean;
  address: string;
  phoneNumber: string;
  subscriptionPlan: 'basic' | 'pro' | 'enterprise';
  subscriptionStatus: 'active' | 'inactive' | 'cancelled';
  subscriptionStartDate: Date;
  subscriptionEndDate: Date;
  lastPaymentDate: Date;
  createdAt: Date;
}

