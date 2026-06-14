import { of } from 'rxjs';
import { ApplicationListComponent } from './application-list';
import { mockApplication, authMock } from '../../../mock-data.spec';

describe('ApplicationListComponent', () => {
  it('creates application list component and initializes applications list', () => {
    const appService = { getByCustomer: () => of([mockApplication]) };
    const auth = authMock();

    const list = new ApplicationListComponent(appService as any, auth as any);
    list.ngOnInit();
    expect(list.applications()).toEqual([mockApplication]);
  });
});
