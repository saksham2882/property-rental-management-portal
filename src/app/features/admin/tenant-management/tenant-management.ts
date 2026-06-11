import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LeaseService } from '../../../core/services/lease-service';
import { RentFormatPipe } from '../../../shared/pipes/rent-format.pipe';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-tenant-management',
  imports: [CommonModule, RentFormatPipe, StatusBadgeComponent],
  templateUrl: './tenant-management.html',
  styleUrl: './tenant-management.css'
})
export class TenantManagementComponent implements OnInit {

  leases = signal<any[]>([]);
  users = signal<any[]>([]);
  applications = signal<any[]>([]);
  loading = signal(true);

  constructor(
    private leaseService: LeaseService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.leaseService.getAll().subscribe(leases => {
      this.leases.set(leases);
    });

    this.http.get<any[]>('http://localhost:3000/users?role=customer').subscribe({
      next: (users) => {
        this.users.set(users);
        this.http.get<any[]>('http://localhost:3000/applications').subscribe({
          next: (apps) => {
            this.applications.set(apps);
            this.loading.set(false);
          },
          error: () => this.loading.set(false)
        });
      },
      error: () => this.loading.set(false)
    });
  }

  getUserById(id: any) {
    if (!id) return null;
    return this.users().find(u => String(u.id) === String(id));
  }

  getTenantDetails(lease: any) {
    const user = this.getUserById(lease.tenantId);
    if (user) {
      return {
        name: user.name,
        email: user.email,
        phone: user.phone
      };
    }

    const app = this.applications().find(a => String(a.id) === String(lease.applicationId));
    if (app) {
      return {
        name: app.applicantName,
        email: app.applicantEmail,
        phone: app.applicantPhone
      };
    }

    return {
      name: 'Unknown',
      email: 'No Email',
      phone: 'No Phone'
    };
  }
}
