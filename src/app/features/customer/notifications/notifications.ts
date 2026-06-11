import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification-service';
import { AuthService } from '../../../core/services/auth-service';
import { Notification } from '../../../core/models/notification-model';

@Component({
  selector: 'app-customer-notifications',
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class NotificationsComponent implements OnInit {

  notifications = signal<Notification[]>([]);
  loading = signal(true);

  constructor(
    private notifService: NotificationService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    const userId = this.auth.currentUser()!.id;
    this.notifService.getByUser(userId).subscribe({
      next: (data) => {
        this.notifications.set(data.reverse());
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  markRead(notif: Notification) {
    if (notif.isRead) return;
    this.notifService.markAsRead(notif.id).subscribe(() => {
      const updated = this.notifications().map(n =>
        n.id === notif.id ? { ...n, isRead: true } : n
      );
      this.notifications.set(updated);
      const count = updated.filter(n => !n.isRead).length;
      this.notifService.unreadCount.set(count);
    });
  }
}