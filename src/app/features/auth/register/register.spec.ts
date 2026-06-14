import { FormBuilder } from '@angular/forms';
import { RegisterComponent } from './register';
import { authMock, routerMock } from '../../../mock-data.spec';

describe('RegisterComponent', () => {
  const fb = new FormBuilder();

  it('creates register component and checks fields', () => {
    const router = routerMock();
    const auth = authMock();
    const register = new RegisterComponent(fb, auth as any, router as any);
    expect(register.registerForm.contains('confirmPassword')).toBeTrue();
  });
});
