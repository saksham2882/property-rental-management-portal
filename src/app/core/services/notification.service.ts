import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { Notification } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private apiUrl = 'http://localhost:3000/notifications';

  unreadCount = signal(0);

  constructor(private http: HttpClient) {}

  getByUser(userId: any): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl).pipe(
      map(notifications => notifications.filter(n => String(n.userId) === String(userId))),
      tap(notifications => {
        const count = notifications.filter(n => !n.isRead).length;
        this.unreadCount.set(count);
      })
    );
  }

  getAll(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl);
  }

  markAsRead(id: number): Observable<Notification> {
    return this.http.patch<Notification>(`${this.apiUrl}/${id}`, { isRead: true });
  }

  create(notification: Partial<Notification>): Observable<Notification> {
    const payload = {
      ...notification,
      isRead: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    return this.http.post<Notification>(this.apiUrl, payload);
  }
}
