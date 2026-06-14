import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth-service';
import { RentService } from '../../../core/services/rent-service';
import { NotificationService } from '../../../core/services/notification-service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';
import { RentFormatPipe } from '../../../shared/pipes/rent-format.pipe';
import { Rent } from '../../../core/models/rent-model';

@Component({
  selector: 'app-rent-tracking',
  imports: [CommonModule, StatusBadgeComponent, RentFormatPipe],
  templateUrl: './rent-tracking.html',
  styleUrl: './rent-tracking.css',
})
export class RentTracking implements OnInit {
  rents = signal<Rent[]>([]);
  loading = signal(false);
  errorMsg = signal<string | null>(null);
  successMsg = signal<string | null>(null);

  constructor(
    private auth: AuthService,
    private rentService: RentService,
    private notifService: NotificationService
  ) {}

  ngOnInit() {
    this.loadRents();
  }

  loadRents() {
    const user = this.auth.currentUser();
    if (!user) return;

    this.loading.set(true);
    this.errorMsg.set(null);
    this.rentService.getByTenant(user.id).subscribe({
      next: (data) => {
        this.rents.set(data.sort((a, b) => b.dueDate.localeCompare(a.dueDate)));
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMsg.set('Failed to load rent records.');
        this.loading.set(false);
      }
    });
  }

  payRent(rentId: number) {
    const rentItem = this.rents().find(r => r.id === rentId);
    if (!rentItem) return;

    this.rentService.markPaid(rentId).subscribe({
      next: (updatedRent) => {
        this.rents.update(list => list.map(r => r.id === rentId ? updatedRent : r));
        
        this.successMsg.set(`Rent for ${rentItem.month} paid successfully!`);
        setTimeout(() => this.successMsg.set(null), 5000);

        const user = this.auth.currentUser();
        if (user) {
          this.notifService.create({
            userId: user.id,
            title: 'Rent Paid Successfully',
            message: `Your rent payment of ₹${rentItem.amount.toLocaleString('en-IN')} for ${rentItem.month} has been received.`,
            type: 'success'
          }).subscribe();
        }
      },
      error: (err) => {
        this.errorMsg.set('Failed to process payment. Please try again.');
        setTimeout(() => this.errorMsg.set(null), 5000);
      }
    });
  }
}
