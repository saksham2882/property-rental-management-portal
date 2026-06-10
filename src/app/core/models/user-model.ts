export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: 'customer' | 'admin';
  phone?: string;
  city?: string;
  preferredLocations?: string[];
  budgetMin?: number;
  budgetMax?: number;
  emailAlerts?: boolean;
  smsAlerts?: boolean;
  createdAt?: string;
}
