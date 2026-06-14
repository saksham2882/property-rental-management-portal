import { of } from 'rxjs';
import { LeaseDetailComponent } from './lease-detail';
import { mockLease, authMock } from '../../../mock-data.spec';

describe('LeaseDetailComponent', () => {
  it('creates lease detail component and initializes leases list', () => {
    const auth = authMock();
    const leaseService = { getByTenant: () => of([mockLease]) };

    const leaseDetail = new LeaseDetailComponent(leaseService as any, auth as any);
    leaseDetail.ngOnInit();
    expect(leaseDetail.leases()).toEqual([mockLease]);
  });
});
