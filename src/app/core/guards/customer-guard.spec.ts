import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { customerGuard } from './customer-guard';
import { AuthService } from '../services/auth-service';
import { authMock, routerMock } from '../../mock-data.spec';

describe('customerGuard', () => {
  it('allows customer guard for customer users', () => {
    const router = routerMock();
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authMock() },
        { provide: Router, useValue: router }
      ]
    });
    const result = TestBed.runInInjectionContext(() => customerGuard({} as any, {} as any));
    expect(result).toBeTrue();
  });
});
