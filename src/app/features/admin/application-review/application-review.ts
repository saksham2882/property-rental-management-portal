import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../../../core/services/application-service';
import { NotificationService } from '../../../core/services/notification-service';
import { PropertyService } from '../../../core/services/property-service';
import { LeaseService } from '../../../core/services/lease-service';
import { RentService } from '../../../core/services/rent-service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';
import { RentalApplication } from '../../../core/models/application-model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-application-review',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  templateUrl: './application-review.html',
  styleUrl: './application-review.css'
})
export class ApplicationReviewComponent implements OnInit {

  applications = signal<RentalApplication[]>([]);
  loading = signal(true);
  successMsg = signal('');

  constructor(
    private appService: ApplicationService,
    private notifService: NotificationService,
    private propertyService: PropertyService,
    private leaseService: LeaseService,
    private rentService: RentService
  ) {}

  ngOnInit() {
    this.appService.getAll().subscribe({
      next: (apps) => {
        this.applications.set(apps);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  updateStatus(app: RentalApplication, status: string) {
    this.appService.updateStatus(app.id!, status).subscribe(() => {
      const updated = this.applications().map(a =>
        a.id === app.id ? { ...a, status: status as any } : a
      );
      this.applications.set(updated);
      this.successMsg.set(`Application #${app.id} status updated to "${status}".`);


      const statusLabels: Record<string, string> = {
        approved: 'approved',
        rejected: 'rejected',
        waitlisted: 'waitlisted'
      };
      this.notifService.create({
        userId: app.customerId,
        title: `Application ${statusLabels[status] || status}`,
        message: `Your rental application #${app.id} has been ${statusLabels[status] || status}.`,
        type: status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'info'
      }).subscribe();


      if (status === 'approved') {
        const propId = Number(app.propertyId) || app.propertyId;
        this.propertyService.getById(Number(propId)).subscribe({
          next: (prop) => {
            // calculate start and end dates (1 year)
            const startDate = new Date(app.moveInDate);
            const endDate = new Date(startDate);
            endDate.setFullYear(endDate.getFullYear() + 1);
            endDate.setDate(endDate.getDate() - 1);

            const leaseData = {
              applicationId: (Number(app.id) || app.id) as any,
              propertyId: (Number(app.propertyId) || app.propertyId) as any,
              tenantId: (Number(app.customerId) || app.customerId) as any,
              startDate: app.moveInDate,
              endDate: endDate.toISOString().split('T')[0],
              monthlyRent: prop.rent,
              deposit: prop.deposit,
              status: 'active' as const,
              conditions: 'No pets allowed. Maintenance charges extra. Notice period 2 months.',
              propertyTitle: prop.title
            };

            this.leaseService.create(leaseData).subscribe({
              next: (newLease) => {
  
                this.propertyService.update(Number(propId), { available: false }).subscribe();

  
                const rentObs = [];
                for (let i = 0; i < 4; i++) {
                  const rentDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
                  const monthName = rentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
                  
                  const dueYear = rentDate.getFullYear();
                  const dueMonth = String(rentDate.getMonth() + 1).padStart(2, '0');
                  const dueDate = `${dueYear}-${dueMonth}-05`;
                  
                  const todayStr = new Date().toISOString().split('T')[0];
                  const rentStatus = dueDate < todayStr ? 'overdue' : 'pending';

                  const rentRecord = {
                    leaseId: (Number(newLease.id) || newLease.id) as any,
                    tenantId: (Number(app.customerId) || app.customerId) as any,
                    month: monthName,
                    amount: prop.rent,
                    dueDate: dueDate,
                    paidDate: null,
                    status: rentStatus as any
                  };
                  rentObs.push(this.rentService.create(rentRecord));
                }

                forkJoin(rentObs).subscribe({
                  next: () => {
                    console.log('Lease and rents generated successfully');
                  },
                  error: (err) => {
                    console.error('Failed to generate rent records', err);
                  }
                });
              },
              error: (err) => {
                console.error('Failed to generate lease record', err);
              }
            });
          },
          error: (err) => {
            console.error('Failed to fetch property details for lease generation', err);
          }
        });
      }

      setTimeout(() => this.successMsg.set(''), 3000);
    });
  }
}
