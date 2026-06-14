import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RentService } from './rent-service';
import { mockRent, routerMock } from '../../mock-data.spec';

describe('RentService', () => {
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

  it('creates RentService and marks rent paid', () => {
    const service = TestBed.inject(RentService);
    service.markPaid(mockRent.id!).subscribe(result => expect(result).toEqual({ ...mockRent, status: 'paid' }));

    const req = http.expectOne(`http://localhost:3000/rents/${mockRent.id}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body.status).toBe('paid');
    req.flush({ ...mockRent, status: 'paid' });
  });
});
