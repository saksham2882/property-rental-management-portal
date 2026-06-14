import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification-service';
import { Notification } from '../../../core/models/notification-model';

@Component({
  selector: 'app-admin-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-notifications.html',
  styleUrl: './admin-notifications.css'
})

export class AdminNotificationsComponent implements OnInit {

  notifications = signal<Notification[]>([]);
  loading = signal(true);

  constructor(private notifService: NotificationService) {}

  ngOnInit() {
    this.notifService.getAll().subscribe({
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
    });
  }

  iconFor(type: string): string {
  const icons: Record<string, string> = {
  success: 'SUCCESS',
  warning: 'WARNING',
  info: 'INFO',
  error: 'ERROR'
};

return icons[type] || 'INFO';
  }
}
