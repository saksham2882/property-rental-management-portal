import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { ApplicationService } from './application-service';
import { mockUser, mockApplication, routerMock } from '../../mock-data.spec';

describe('ApplicationService', () => {
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

  it('creates ApplicationService and filters by customer', () => {
    const service = TestBed.inject(ApplicationService);
    service.getByCustomer(mockUser.id).subscribe(result => expect(result).toEqual([mockApplication]));
    http.expectOne('http://localhost:3000/applications').flush([mockApplication, { ...mockApplication, id: 101, customerId: 2 }]);
  });
});
