import { FormBuilder } from '@angular/forms';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { MaintenanceComponent } from './maintenance';
import {
  mockLease,
  mockMaintenanceRequest,
  mockNotification,
  authMock
} from '../../../mock-data.spec';

describe('MaintenanceComponent', () => {
  const fb = new FormBuilder();

  it('creates customer maintenance component and check urgency css class', () => {
    const auth = authMock();
    const leaseService = { getByTenant: () => of([mockLease]) };
    const maintenanceService = { getByTenant: () => of([mockMaintenanceRequest]), submit: () => of(mockMaintenanceRequest) };
    const notificationService = { getByUser: () => of([mockNotification]), markAsRead: () => of(mockNotification), create: () => of(mockNotification), unreadCount: signal(1) };

    const maintenance = new MaintenanceComponent(
      fb,
      maintenanceService as any,
      leaseService as any,
      auth as any,
      notificationService as any
    );
    maintenance.ngOnInit();
    expect(maintenance.urgencyClass('medium')).toBe('tag-medium');
  });
});
