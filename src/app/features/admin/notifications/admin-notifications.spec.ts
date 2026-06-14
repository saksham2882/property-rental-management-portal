import { of } from 'rxjs';
import { AdminNotificationsComponent } from './admin-notifications';
import { mockNotification } from '../../../mock-data.spec';

describe('AdminNotificationsComponent', () => {
  it('creates admin notifications component and maps notification icon', () => {
    const notificationService = { getAll: () => of([mockNotification]), markAsRead: () => of(mockNotification), create: () => of(mockNotification) };

    const adminNotifications = new AdminNotificationsComponent(notificationService as any);
    adminNotifications.ngOnInit();
    expect(adminNotifications.iconFor('success')).toBe('SUCCESS');
  });
});
