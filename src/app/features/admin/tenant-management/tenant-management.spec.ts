import { of } from 'rxjs';
import { TenantManagementComponent } from './tenant-management';
import { mockLease, mockUser } from '../../../mock-data.spec';

describe('TenantManagementComponent', () => {
  it('creates tenant management component and checks fallback tenant lookup', () => {
    const leaseService = { getAll: () => of([mockLease]) };
    const authService = { get: () => of([mockUser]) };

    const tenant = new TenantManagementComponent(leaseService as any, authService as any);
    expect(tenant.getTenantDetails({ tenantId: 99 }).name).toBe('Unknown');
  });
});
