import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { MaintenanceService } from './maintenance-service';
import { mockMaintenanceRequest, routerMock } from '../../mock-data.spec';

describe('MaintenanceService', () => {
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

  it('creates MaintenanceService and submits default fields', () => {
    const service = TestBed.inject(MaintenanceService);
    service.submit({ category: 'plumbing' }).subscribe(result => expect(result).toEqual(mockMaintenanceRequest));

    const req = http.expectOne('http://localhost:3000/maintenanceRequests');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.status).toBe('pending');
    req.flush(mockMaintenanceRequest);
  });
});
