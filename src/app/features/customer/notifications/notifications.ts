import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationService } from '../../../core/services/notification.service';
import {Notification} from '../../../core/models/notification-model';

// interface Notification {
//   id: number;
//   title?: string;
//   message?: string;
//   isRead: boolean;
//   createdAt?: string;
// }

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class NotificationsComponent implements OnInit {

  notifications: Notification[] = [];

  constructor(
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    const userId = 1; 

    this.notificationService
      .getByUser(userId)
      .subscribe({
        next: (data) => {
          this.notifications = data;
        },
        error: (err) => {
          console.error('Failed to load notifications', err);
        }
      });
  }

  markAsRead(id: number): void {
    this.notificationService
      .markAsRead(id)
      .subscribe(() => {
        this.notifications = this.notifications.map(notification =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        );
      });
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }
}