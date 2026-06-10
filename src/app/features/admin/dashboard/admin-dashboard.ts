import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PropertyService } from '../../../core/services/property-service';
import { ApplicationService } from '../../../core/services/application-service';
import { MaintenanceService } from '../../../core/services/maintenance-service';
import { NotificationService } from '../../../core/services/notification-service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit {

  totalProperties = signal(0);
  availableProperties = signal(0);
  totalApplications = signal(0);
  pendingApplications = signal(0);
  openMaintenance = signal(0);
  totalNotifications = signal(0);

  constructor(
    private propertyService: PropertyService,
    private applicationService: ApplicationService,
    private maintenanceService: MaintenanceService,
    private notifService: NotificationService
  ) {}

  ngOnInit() {
    this.propertyService.getAll().subscribe(props => {
      this.totalProperties.set(props.length);
      this.availableProperties.set(props.filter(p => p.available).length);
    });

    this.applicationService.getAll().subscribe(apps => {
      this.totalApplications.set(apps.length);
      this.pendingApplications.set(apps.filter(a => a.status === 'under_review').length);
    });

    this.maintenanceService.getAll().subscribe(reqs => {
      this.openMaintenance.set(reqs.filter(r => r.status !== 'resolved').length);
    });

    this.notifService.getAll().subscribe(notifs => {
      this.totalNotifications.set(notifs.filter(n => !n.isRead).length);
    });
  }
}
