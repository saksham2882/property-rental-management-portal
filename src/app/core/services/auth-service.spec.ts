import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { AuthService } from './auth-service';
import { User } from '../models/user-model';

describe('AuthService', () => {
  let service: AuthService;
  let httpClientSpy: {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    patch: ReturnType<typeof vi.fn>;
  };
  let routerSpy: {
    navigate: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    localStorage.clear();

    httpClientSpy = {
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn()
    };

    routerSpy = {
      navigate: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  it('should be created', () => {
    service = TestBed.inject(AuthService);
    expect(service).toBeTruthy();
  });

  it('should initialize with no user if localStorage is empty', () => {
    service = TestBed.inject(AuthService);
    expect(service.currentUser()).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should load user from localStorage on initialization if present', () => {
    const savedUser: User = {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'admin'
    };
    localStorage.setItem('rental_user', JSON.stringify(savedUser));

    service = TestBed.inject(AuthService);
    expect(service.currentUser()).toEqual(savedUser);
    expect(service.isLoggedIn()).toBe(true);
  });

  describe('login (positive & negative test cases)', () => {
    const mockUser: User = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'customer'
    };

    beforeEach(() => {
      service = TestBed.inject(AuthService);
    });

    it('should successfully log in when credentials are correct (positive test case)', () => {
      httpClientSpy.get.mockReturnValue(of([mockUser]));

      service.login('john@example.com', 'password123').subscribe((users) => {
        expect(users.length).toBe(1);
        expect(users[0]).toEqual(mockUser);
        expect(service.currentUser()).toEqual(mockUser);
        expect(service.isLoggedIn()).toBe(true);
        expect(JSON.parse(localStorage.getItem('rental_user')!)).toEqual(mockUser);
      });

      expect(httpClientSpy.get).toHaveBeenCalledWith('http://localhost:3000/users?email=john@example.com');
    });

    it('should fail to log in when password is incorrect (negative test case)', () => {
      httpClientSpy.get.mockReturnValue(of([mockUser]));

      service.login('john@example.com', 'wrongpassword').subscribe((users) => {
        expect(users.length).toBe(0);
        expect(service.currentUser()).toBeNull();
        expect(service.isLoggedIn()).toBe(false);
        expect(localStorage.getItem('rental_user')).toBeNull();
      });

      expect(httpClientSpy.get).toHaveBeenCalledWith('http://localhost:3000/users?email=john@example.com');
    });

    it('should return empty list and not log in if user is not found (negative test case)', () => {
      httpClientSpy.get.mockReturnValue(of([]));

      service.login('nonexistent@example.com', 'anyPassword').subscribe((users) => {
        expect(users.length).toBe(0);
        expect(service.currentUser()).toBeNull();
        expect(service.isLoggedIn()).toBe(false);
        expect(localStorage.getItem('rental_user')).toBeNull();
      });

      expect(httpClientSpy.get).toHaveBeenCalledWith('http://localhost:3000/users?email=nonexistent@example.com');
    });
  });

  describe('register', () => {
    beforeEach(() => {
      service = TestBed.inject(AuthService);
    });

    it('should register a new customer user and set state', () => {
      const inputData: Partial<User> = {
        name: 'New User',
        email: 'new@example.com',
        password: 'newpassword'
      };

      const registeredUser: User = {
        id: 3,
        name: 'New User',
        email: 'new@example.com',
        role: 'customer',
        createdAt: '2026-06-13'
      };

      httpClientSpy.post.mockReturnValue(of(registeredUser));

      service.register(inputData).subscribe((user) => {
        expect(user).toEqual(registeredUser);
        expect(service.currentUser()).toEqual(registeredUser);
        expect(service.isLoggedIn()).toBe(true);
        expect(JSON.parse(localStorage.getItem('rental_user')!)).toEqual(registeredUser);
      });

      expect(httpClientSpy.post).toHaveBeenCalledWith(
        'http://localhost:3000/users',
        expect.objectContaining({
          name: 'New User',
          email: 'new@example.com',
          role: 'customer'
        })
      );
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      service = TestBed.inject(AuthService);
      service.currentUser.set({ id: 1, name: 'User', email: 'u@e.com', role: 'customer' });
      service.isLoggedIn.set(true);
      localStorage.setItem('rental_user', JSON.stringify({ id: 1 }));
    });

    it('should clear authentication state and navigate to login', () => {
      service.logout();

      expect(service.currentUser()).toBeNull();
      expect(service.isLoggedIn()).toBe(false);
      expect(localStorage.getItem('rental_user')).toBeNull();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
  });

  describe('profile updates', () => {
    beforeEach(() => {
      service = TestBed.inject(AuthService);
    });

    it('should update profile and local state', () => {
      const updatedUser: User = {
        id: 1,
        name: 'Updated Name',
        email: 'john@example.com',
        role: 'customer'
      };

      httpClientSpy.patch.mockReturnValue(of(updatedUser));

      service.updateProfile(1, { name: 'Updated Name' }).subscribe((user) => {
        expect(user).toEqual(updatedUser);
        expect(service.currentUser()).toEqual(updatedUser);
        expect(JSON.parse(localStorage.getItem('rental_user')!)).toEqual(updatedUser);
      });

      expect(httpClientSpy.patch).toHaveBeenCalledWith(
        'http://localhost:3000/users/1',
        { name: 'Updated Name' }
      );
    });
  });

  describe('role checks', () => {
    beforeEach(() => {
      service = TestBed.inject(AuthService);
    });

    it('should identify admin correctly', () => {
      service.currentUser.set({ id: 1, name: 'Admin', email: 'a@e.com', role: 'admin' });
      expect(service.isAdmin()).toBe(true);
      expect(service.isCustomer()).toBe(false);
    });

    it('should identify customer correctly', () => {
      service.currentUser.set({ id: 1, name: 'Customer', email: 'c@e.com', role: 'customer' });
      expect(service.isAdmin()).toBe(false);
      expect(service.isCustomer()).toBe(true);
    });

    it('should return false for roles if current user is null', () => {
      service.currentUser.set(null);
      expect(service.isAdmin()).toBe(false);
      expect(service.isCustomer()).toBe(false);
    });
  });
});
