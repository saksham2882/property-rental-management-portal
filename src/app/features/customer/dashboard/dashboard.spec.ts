import { of } from 'rxjs';
import { Dashboard } from './dashboard';
import {
  mockApplication,
  mockLease,
  mockRent,
  mockMaintenanceRequest,
  authMock
} from '../../../mock-data.spec';

describe('Dashboard', () => {
  it('creates customer dashboard and counts applications', () => {
    const auth = authMock();
    const appService = { getByCustomer: () => of([mockApplication]), submit: () => of(mockApplication) };
    const leaseService = { getByTenant: () => of([mockLease]) };
    const rentService = { getByTenant: () => of([mockRent]) };
    const maintenanceService = { getByTenant: () => of([mockMaintenanceRequest]), submit: () => of(mockMaintenanceRequest) };

    const dashboard = new Dashboard(
      auth as any,
      appService as any,
      leaseService as any,
      rentService as any,
      maintenanceService as any
    );
    dashboard.ngOnInit();
    expect(dashboard.totalApplications()).toBe(1);
  });
});
