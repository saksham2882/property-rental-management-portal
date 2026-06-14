import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { redirectIfLoggedInGuard } from './auth-guard';
import { AuthService } from '../services/auth-service';
import { authMock, routerMock } from '../../mock-data.spec';

describe('redirectIfLoggedInGuard', () => {
  it('redirects logged-in users away from auth pages', () => {
    const router = routerMock();
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authMock() },
        { provide: Router, useValue: router }
      ]
    });
    const result = TestBed.runInInjectionContext(() => redirectIfLoggedInGuard({} as any, {} as any));
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/customer/dashboard']);
  });
});
