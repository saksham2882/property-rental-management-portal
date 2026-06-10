import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Notification } from '../models/notification-model';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private apiUrl = 'http://localhost:3000/notifications';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl);
  }

  getByUser(userId: any): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl).pipe(
      map(notifications =>
        notifications.filter(
          n => String(n.userId) === String(userId)
        )
      )
    );
  }

  create(notification: Partial<Notification>): Observable<Notification> {
    return this.http.post<Notification>(
      this.apiUrl,
      notification
    );
  }

  markAsRead(id: number): Observable<Notification> {
    return this.http.patch<Notification>(
      `${this.apiUrl}/${id}`,
      { isRead: true }
    );
  }
}