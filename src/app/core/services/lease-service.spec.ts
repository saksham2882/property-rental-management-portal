import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { LeaseService } from './lease-service';
import { mockUser, mockLease, routerMock } from '../../mock-data.spec';

describe('LeaseService', () => {
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

  it('creates LeaseService and filters by tenant', () => {
    const service = TestBed.inject(LeaseService);
    service.getByTenant(mockUser.id).subscribe(result => expect(result).toEqual([mockLease]));
    http.expectOne('http://localhost:3000/leases').flush([mockLease, { ...mockLease, id: 21, tenantId: 2 }]);
  });
});
