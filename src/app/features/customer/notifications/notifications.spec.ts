import { signal } from '@angular/core';
import { of } from 'rxjs';
import { NotificationsComponent } from './notifications';
import { mockNotification, authMock } from '../../../mock-data.spec';

describe('NotificationsComponent', () => {
  it('creates customer notifications component and marks notification as read', () => {
    const auth = authMock();
    const notificationService = {
      getByUser: () => of([mockNotification]),
      markAsRead: () => of(mockNotification),
      create: () => of(mockNotification),
      unreadCount: signal(1)
    };

    const notifications = new NotificationsComponent(notificationService as any, auth as any);
    notifications.ngOnInit();
    notifications.markRead(mockNotification);
    expect(notificationService.unreadCount()).toBe(0);
  });
});
