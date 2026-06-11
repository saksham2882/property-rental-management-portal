import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaseService } from '../../../core/services/lease-service';
import { AuthService } from '../../../core/services/auth-service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';
import { RentFormatPipe } from '../../../shared/pipes/rent-format.pipe';
import { Lease } from '../../../core/models/lease-model';

@Component({
  selector: 'app-lease-detail',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent, RentFormatPipe],
  templateUrl: './lease-detail.html',
  styleUrl: './lease-detail.css'
})
export class LeaseDetailComponent implements OnInit {

  leases = signal<Lease[]>([]);
  loading = signal(true);

  constructor(
    private leaseService: LeaseService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    const userId = this.auth.currentUser()!.id;
    this.leaseService.getByTenant(userId).subscribe({
      next: (data) => {
        this.leases.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  daysRemaining(endDate: string): number {
    const end = new Date(endDate);
    const today = new Date();
    const diff = end.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }
}
