import { of } from 'rxjs';
import { ApplicationReviewComponent } from './application-review';
import {
  mockProperty,
  mockApplication,
  mockLease,
  mockRent,
  mockNotification
} from '../../../mock-data.spec';

describe('ApplicationReviewComponent', () => {

  it('creates application review component and initializes properties', () => {
    const propertyService = {
      getAll: () => of([mockProperty]),
      update: () => of(mockProperty),
      create: () => of(mockProperty),
      delete: () => of(void 0),
      getById: () => of(mockProperty)
    };
    const appService = { getAll: () => of([mockApplication]), updateStatus: () => of(mockApplication) };
    const notificationService = { getAll: () => of([mockNotification]), markAsRead: () => of(mockNotification), create: () => of(mockNotification) };
    const leaseService = { getAll: () => of([mockLease]), create: () => of(mockLease) };
    const rentService = { create: () => of(mockRent) };

    const review = new ApplicationReviewComponent(
      appService as any,
      notificationService as any,
      propertyService as any,
      leaseService as any,
      rentService as any
    );
    review.ngOnInit();
    expect(review.loading()).toBeFalse();
  });
});
