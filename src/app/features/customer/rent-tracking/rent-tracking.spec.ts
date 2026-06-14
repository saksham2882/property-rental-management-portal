import { of } from 'rxjs';
import { RentTracking } from './rent-tracking';
import { mockUser, mockRent, authMock } from '../../../mock-data.spec';

describe('RentTracking', () => {
  it('creates rent tracking component and loads rents', () => {
    const auth = authMock();
    const rentService = {
      getByTenant: jasmine.createSpy('getByTenant').and.returnValue(of([mockRent])),
      markPaid: jasmine.createSpy('markPaid').and.returnValue(of(mockRent))
    };
    const notificationService = {
      create: jasmine.createSpy('create').and.returnValue(of({}))
    };

    const rentTracking = new RentTracking(
      auth as any,
      rentService as any,
      notificationService as any
    );
    rentTracking.ngOnInit();
    expect(rentService.getByTenant).toHaveBeenCalledWith(mockUser.id);
    expect(rentTracking.rents()).toEqual([mockRent]);
  });
});
