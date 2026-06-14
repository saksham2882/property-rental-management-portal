import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { PropertyService } from './property-service';
import { mockProperty, routerMock } from '../../mock-data.spec';

describe('PropertyService', () => {
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

  it('creates PropertyService and sends filters as query params', () => {
    const service = TestBed.inject(PropertyService);
    service.getFiltered({ city: 'Mumbai', bedrooms: 2, available: true }).subscribe(result => expect(result).toEqual([mockProperty]));

    const req = http.expectOne(request => request.url === 'http://localhost:3000/properties');
    expect(req.request.params.get('city')).toBe('Mumbai');
    expect(req.request.params.get('bedrooms')).toBe('2');
    expect(req.request.params.get('available')).toBe('true');
    req.flush([mockProperty]);
  });
});
