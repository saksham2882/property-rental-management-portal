import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LeaseService } from '../../../core/services/lease-service';
import { RentFormatPipe } from '../../../shared/pipes/rent-format.pipe';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';

interface TenantRecord {
  lease: any;
  user: any;
}

@Component({
  selector: 'app-tenant-management',
  standalone: true,
  imports: [CommonModule, RentFormatPipe, StatusBadgeComponent],
  templateUrl: './tenant-management.component.html',
  styleUrl: './tenant-management.component.css'
})
export class TenantManagementComponent implements OnInit {

  leases = signal<any[]>([]);
  users = signal<any[]>([]);
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
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getUserById(id: number) {
    return this.users().find(u => u.id === id);
  }
}
