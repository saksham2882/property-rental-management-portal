import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { LoginComponent } from './login';
import { AuthService } from '../../../core/services/auth-service';
import { User } from '../../../core/models/user-model';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: {
    login: ReturnType<typeof vi.fn>;
  };
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = {
      login: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate form fields', () => {
    expect(component.loginForm.valid).toBe(false);

    const emailControl = component.loginForm.get('email');
    const passwordControl = component.loginForm.get('password');

    // Test required validators
    expect(emailControl?.valid).toBe(false);
    expect(passwordControl?.valid).toBe(false);

    // Test email validator
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBe(false);

    emailControl?.setValue('test@example.com');
    expect(emailControl?.valid).toBe(true);

    // Test password minLength validator
    passwordControl?.setValue('123');
    expect(passwordControl?.valid).toBe(false);

    passwordControl?.setValue('password123');
    expect(passwordControl?.valid).toBe(true);

    expect(component.loginForm.valid).toBe(true);
  });

  it('should not call auth service onSubmit if form is invalid', () => {
    component.loginForm.patchValue({
      email: '',
      password: ''
    });

    component.onSubmit();

    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  describe('login scenarios', () => {
    it('should successfully log in customer and navigate to customer dashboard (positive test case)', () => {
      const mockUser: User = {
        id: 1,
        name: 'Rahul',
        email: 'rahul@gmail.com',
        role: 'customer'
      };
      authServiceSpy.login.mockReturnValue(of([mockUser]));
      const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

      component.loginForm.patchValue({
        email: 'rahul@gmail.com',
        password: 'password123'
      });

      component.onSubmit();

      expect(authServiceSpy.login).toHaveBeenCalledWith('rahul@gmail.com', 'password123');
      expect(component.loading).toBe(false);
      expect(component.errorMsg).toBe('');
      expect(navigateSpy).toHaveBeenCalledWith(['/customer/dashboard']);
    });

    it('should successfully log in admin and navigate to admin dashboard (positive test case)', () => {
      const mockUser: User = {
        id: 2,
        name: 'Admin',
        email: 'admin@rental.com',
        role: 'admin'
      };
      authServiceSpy.login.mockReturnValue(of([mockUser]));
      const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

      component.loginForm.patchValue({
        email: 'admin@rental.com',
        password: 'password123'
      });

      component.onSubmit();

      expect(authServiceSpy.login).toHaveBeenCalledWith('admin@rental.com', 'password123');
      expect(component.loading).toBe(false);
      expect(component.errorMsg).toBe('');
      expect(navigateSpy).toHaveBeenCalledWith(['/admin/dashboard']);
    });

    it('should display error message on login failure due to invalid credentials (negative test case)', () => {
      authServiceSpy.login.mockReturnValue(of([]));
      const navigateSpy = vi.spyOn(router, 'navigate');

      component.loginForm.patchValue({
        email: 'wrong@example.com',
        password: 'wrongpassword'
      });

      component.onSubmit();

      expect(authServiceSpy.login).toHaveBeenCalledWith('wrong@example.com', 'wrongpassword');
      expect(component.loading).toBe(false);
      expect(component.errorMsg).toBe('Invalid email or password. Please try again.');
      expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('should display error message on service connection error (negative test case)', () => {
      authServiceSpy.login.mockReturnValue(throwError(() => new Error('Server down')));
      const navigateSpy = vi.spyOn(router, 'navigate');

      component.loginForm.patchValue({
        email: 'john@example.com',
        password: 'password123'
      });

      component.onSubmit();

      expect(authServiceSpy.login).toHaveBeenCalledWith('john@example.com', 'password123');
      expect(component.loading).toBe(false);
      expect(component.errorMsg).toBe('Unable to connect. Please check your connection.');
      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });

  describe('credential filling helpers', () => {
    it('should fill form credentials correctly for admin', () => {
      component.fillCredentials('admin');
      expect(component.loginForm.value).toEqual({
        email: 'admin@rental.com',
        password: 'admin123'
      });
    });

    it('should fill form credentials correctly for customer', () => {
      component.fillCredentials('customer');
      expect(component.loginForm.value).toEqual({
        email: 'rahul@gmail.com',
        password: 'rahul123'
      });
    });
  });
});
