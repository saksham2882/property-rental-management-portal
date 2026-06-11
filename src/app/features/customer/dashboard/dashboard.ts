import { Component, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth-service';
import { ApplicationService } from '../../../core/services/application-service';
import { LeaseService } from '../../../core/services/lease-service';
import { RentService } from '../../../core/services/rent-service';
import { MaintenanceService } from '../../../core/services/maintenance-service';
import { RouterLink } from '@angular/router';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';
import { RentFormatPipe } from '../../../shared/pipes/rent-format.pipe';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, StatusBadgeComponent,RentFormatPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  totalApplications = signal(0);
  activeLease = signal<any>(null);
  pendingRent = signal<any>(null);
  openRequests = signal(0);
  recentApplications = signal<any[]>([]);

  constructor(
    public auth: AuthService,
    private appService: ApplicationService,
    private leaseService: LeaseService,
    private rentService: RentService,
    private maintenanceService: MaintenanceService
  ) { }

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    const userId = this.auth.currentUser()!.id;

    this.appService.getByCustomer(userId).subscribe(apps => {
      this.totalApplications.set(apps.length);
      this.recentApplications.set(apps.slice(-3).reverse());
    });

    this.leaseService.getByTenant(userId).subscribe(leases => {
      const active = leases.find(l => l.status === 'active');
      this.activeLease.set(active || null);
    });

    this.rentService.getByTenant(userId).subscribe(rents => {
      const overdue = rents.find(r => r.status === 'overdue');
      const pending = rents.find(r => r.status === 'pending');
      this.pendingRent.set(overdue || pending || null);
    });

    this.maintenanceService.getByTenant(userId).subscribe(reqs => {
      const open = reqs.filter(r => r.status !== 'resolved').length;
      this.openRequests.set(open);
    });
  }
}
