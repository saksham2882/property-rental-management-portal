import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, map } from 'rxjs';
import { User } from '../models/user-model';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = 'http://localhost:3000';
  currentUser = signal<User | null>(null);
  isLoggedIn = signal(false);

  constructor(private http: HttpClient, private router: Router) {
    const saved = localStorage.getItem('rental_user');
    if (saved) {
      const user: User = JSON.parse(saved);
      this.currentUser.set(user);
      this.isLoggedIn.set(true);
      localStorage.setItem('rental_user', JSON.stringify(user));
    }
  }

  login(email: string, password: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users?email=${email}`).pipe(
      map(users => {
        if (users.length > 0 && String(users[0].password) === String(password)) {
          return [users[0]];
        }
        return [];
      }),
      tap(users => {
        if (users.length > 0) {
          const user = users[0];
          this.currentUser.set(user);
          this.isLoggedIn.set(true);
          localStorage.setItem('rental_user', JSON.stringify(user));
        }
      })
    );
  }

  register(userData: Partial<User>): Observable<User> {
    const newUser: Partial<User> = {
      ...userData,
      role: 'customer',
      createdAt: new Date().toISOString().split('T')[0]
    };
    return this.http.post<User>(`${this.apiUrl}/users`, newUser).pipe(
      tap(user => {
        this.currentUser.set(user);
        this.isLoggedIn.set(true);
        localStorage.setItem('rental_user', JSON.stringify(user));
      })
    );
  }

  logout() {
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    localStorage.removeItem('rental_user');
    this.router.navigate(['/auth/login']);
  }

  updateProfile(userId: number, data: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${userId}`, data).pipe(
      tap(updated => {
        this.currentUser.set(updated);
        localStorage.setItem('rental_user', JSON.stringify(updated));
      })
    );
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  isCustomer(): boolean {
    return this.currentUser()?.role === 'customer';
  }
}
