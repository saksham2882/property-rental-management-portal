import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { adminGuard } from './admin-guard';
import { AuthService } from '../services/auth-service';
import { authMock, routerMock } from '../../mock-data.spec';

describe('adminGuard', () => {
  it('rejects admin guard for customer users', () => {
    const router = routerMock();
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authMock() },
        { provide: Router, useValue: router }
      ]
    });
    const result = TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));
    expect(result).toBeFalse();
  });
});
