import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsComponent } from './notifications';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should return unread notification count', () => {

    component.notifications = [
      {
        id: 1,
        userId: 1,
        title: 'Test',
        message: 'Message',
        type: 'info',
        isRead: false,
        createdAt: '2026-01-01'
      },
      {
        id: 2,
        userId: 1,
        title: 'Test',
        message: 'Message',
        type: 'success',
        isRead: true,
        createdAt: '2026-01-01'
      }
    ];

    expect(component.getUnreadCount()).toBe(1);
  });

});
