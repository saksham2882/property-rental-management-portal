import { FormBuilder } from '@angular/forms';
import { LoginComponent } from './login';
import { authMock, routerMock } from '../../../mock-data.spec';

describe('LoginComponent', () => {
  const fb = new FormBuilder();

  it('creates login component and fills credentials', () => {
    const router = routerMock();
    const auth = authMock();
    const login = new LoginComponent(fb, auth as any, router as any);
    login.fillCredentials('admin');
    expect(login.loginForm.value.email).toBe('admin@rental.com');
  });
});
