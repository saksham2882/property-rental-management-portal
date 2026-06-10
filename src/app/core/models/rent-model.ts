export type RentStatus = 'paid' | 'pending' | 'overdue';

export interface Rent {
  id: number;
  leaseId: number;
  tenantId: number;
  month: string;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: RentStatus;
}
