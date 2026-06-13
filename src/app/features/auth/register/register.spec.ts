import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { RegisterComponent } from './register';
import { AuthService } from '../../../core/services/auth-service';
import { User } from '../../../core/models/user-model';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: {
    register: ReturnType<typeof vi.fn>;
  };
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = {
      register: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate all form fields and validators', () => {
    expect(component.registerForm.valid).toBe(false);
    component.registerForm.patchValue({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210',
      city: 'Mumbai',
      password: 'password123',
      confirmPassword: 'mismatchPassword'
    });
    fixture.detectChanges();
    expect(component.registerForm.get('confirmPassword')?.hasError('mismatch')).toBe(true);
    expect(component.registerForm.valid).toBe(false);
    component.registerForm.patchValue({
      confirmPassword: 'password123'
    });
    fixture.detectChanges();
    expect(component.registerForm.get('confirmPassword')?.hasError('mismatch')).toBe(false);
    expect(component.registerForm.valid).toBe(true);
  });

  it('should invalidate phone number if it does not match Indian mobile format', () => {
    const phoneControl = component.registerForm.get('phone');
    phoneControl?.setValue('98765');
    expect(phoneControl?.hasError('invalidPhone')).toBe(true);

    phoneControl?.setValue('1234567890');
    expect(phoneControl?.hasError('invalidPhone')).toBe(true);
    phoneControl?.setValue('9876543210');
    expect(phoneControl?.hasError('invalidPhone')).toBe(false);
  });

  it('should not call auth service onSubmit if form is invalid', () => {
    component.registerForm.patchValue({
      name: ''
    });

    component.onSubmit();

    expect(authServiceSpy.register).not.toHaveBeenCalled();
  });

  describe('registration scenarios', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210',
      city: 'Mumbai',
      password: 'password123',
      confirmPassword: 'password123',
      budgetMin: '10000',
      budgetMax: '25000'
    };

    it('should successfully register a customer and navigate to customer dashboard (positive test case)', () => {
      const mockRegisteredUser: User = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210',
        city: 'Mumbai',
        role: 'customer',
        createdAt: '2026-06-13'
      };
      authServiceSpy.register.mockReturnValue(of(mockRegisteredUser));
      const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

      component.registerForm.patchValue(validData);
      component.onSubmit();
      const { confirmPassword, ...expectedUserData } = validData;
      expect(authServiceSpy.register).toHaveBeenCalledWith(expectedUserData);
      expect(component.loading).toBe(false);
      expect(component.errorMsg).toBe('');
      expect(navigateSpy).toHaveBeenCalledWith(['/customer/dashboard']);
    });

    it('should display error message on registration service failure (negative test case)', () => {
      authServiceSpy.register.mockReturnValue(throwError(() => new Error('Registration failed')));
      const navigateSpy = vi.spyOn(router, 'navigate');

      component.registerForm.patchValue(validData);
      component.onSubmit();

      expect(component.loading).toBe(false);
      expect(component.errorMsg).toBe('Registration failed. Please try again.');
      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });
});
