import { of } from 'rxjs';
import { AdminDashboard } from './admin-dashboard';
import {
  mockProperty,
  mockApplication,
  mockMaintenanceRequest,
  mockNotification
} from '../../../mock-data.spec';

describe('AdminDashboard', () => {
  it('creates admin dashboard and initializes totals', () => {
    const propertyService = { getAll: () => of([mockProperty]) };
    const appService = { getAll: () => of([mockApplication]) };
    const maintenanceService = { getAll: () => of([mockMaintenanceRequest]) };
    const notificationService = { getAll: () => of([mockNotification]) };

    const dashboard = new AdminDashboard(
      propertyService as any,
      appService as any,
      maintenanceService as any,
      notificationService as any
    );
    dashboard.ngOnInit();
    expect(dashboard.totalProperties()).toBe(1);
  });
});
