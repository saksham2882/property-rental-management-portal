import { of } from 'rxjs';
import { MaintenanceManagementComponent } from './maintenance-management';
import { mockMaintenanceRequest, mockNotification } from '../../../mock-data.spec';

describe('MaintenanceManagementComponent', () => {
  it('creates maintenance management component and checks urgency class', () => {
    const maintenanceService = { getAll: () => of([mockMaintenanceRequest]), update: () => of(mockMaintenanceRequest) };
    const notificationService = { getAll: () => of([mockNotification]), markAsRead: () => of(mockNotification), create: () => of(mockNotification) };

    const maintenance = new MaintenanceManagementComponent(
      maintenanceService as any,
      notificationService as any
    );
    maintenance.ngOnInit();
    expect(maintenance.urgencyClass('high')).toBe('urg-high');
  });
});
