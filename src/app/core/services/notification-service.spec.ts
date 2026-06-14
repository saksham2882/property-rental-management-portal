import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { NotificationService } from './notification-service';
import { mockNotification, routerMock } from '../../mock-data.spec';

describe('NotificationService', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerMock() }
      ]
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('creates NotificationService and updates unread count', () => {
    const service = TestBed.inject(NotificationService);
    service.getByUser(1).subscribe(result => expect(result).toEqual([mockNotification]));
    http.expectOne('http://localhost:3000/notifications').flush([mockNotification, { ...mockNotification, id: 51, userId: 2 }]);
    expect(service.unreadCount()).toBe(1);
  });
});
