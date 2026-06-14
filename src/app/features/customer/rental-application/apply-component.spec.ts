import { FormBuilder } from '@angular/forms';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { ApplyComponent } from './apply-component';
import {
  mockProperty,
  mockNotification,
  authMock,
  routerMock
} from '../../../mock-data.spec';

describe('ApplyComponent', () => {
  const fb = new FormBuilder();

  it('creates application form and toggles document check', () => {
    const route = { snapshot: { paramMap: { get: () => String(mockProperty.id) } } };
    const appService = { getByCustomer: () => of([]), submit: () => of({}) };
    const propertyService = { getById: () => of(mockProperty) };
    const notificationService = { getByUser: () => of([mockNotification]), markAsRead: () => of(mockNotification), create: () => of(mockNotification), unreadCount: signal(1) };
    const changeDetector = { detectChanges: jasmine.createSpy('detectChanges') };
    const auth = authMock();

    const apply = new ApplyComponent(
      fb,
      route as any,
      routerMock() as any,
      appService as any,
      propertyService as any,
      auth as any,
      notificationService as any,
      changeDetector as any
    );
    apply.buildForm(mockProperty);
    apply.toggleDocument('ID Proof');
    expect(apply.selectedDocs).toEqual(['ID Proof']);
  });
});
