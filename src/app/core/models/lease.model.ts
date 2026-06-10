export interface Lease {
  id: number;
  applicationId: number;
  propertyId: number;
  tenantId: number;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  deposit: number;
  status: 'active' | 'expired' | 'terminated';
  conditions: string;
  propertyTitle: string;
}
