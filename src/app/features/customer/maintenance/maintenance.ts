import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { MaintenanceService } from '../../../core/services/maintenance-service';
import { LeaseService } from '../../../core/services/lease-service';
import { AuthService } from '../../../core/services/auth-service';
import { NotificationService } from '../../../core/services/notification-service';
import { MaintenanceRequest, MAINTENANCE_FORM_CONFIG, FormFieldConfig } from '../../../core/models/maintenance-model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-maintenance',
  imports: [CommonModule, ReactiveFormsModule, StatusBadgeComponent, TitleCasePipe],
  templateUrl: './maintenance.html',
  styleUrl: './maintenance.css'
})
export class MaintenanceComponent implements OnInit {

  requests = signal<MaintenanceRequest[]>([]);
  loading = signal(true);
  showForm = signal(false);
  successMsg = signal('');
  errorMsg = signal('');
  submitting = signal(false);
  currentPropertyId = signal<number | null>(null);

  formConfig: FormFieldConfig[] = MAINTENANCE_FORM_CONFIG;
  maintenanceForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private maintenanceService: MaintenanceService,
    private leaseService: LeaseService,
    public auth: AuthService,
    private notifService: NotificationService
  ) { }

  ngOnInit() {
    const userId = this.auth.currentUser()!.id;
    this.buildDynamicForm();

    this.leaseService.getByTenant(userId).subscribe(leases => {
      const active = leases.find(l => l.status === 'active');
      if (active) {
        this.currentPropertyId.set(active.propertyId);
      }
    });

    this.maintenanceService.getByTenant(userId).subscribe({
      next: (data) => {
        this.requests.set(data.reverse());
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  buildDynamicForm() {
    const controls: Record<string, any> = {};
    this.formConfig.forEach(field => {
      controls[field.name] = ['', field.required ? Validators.required : []];
    });
    this.maintenanceForm = this.fb.group(controls);
  }

  onSubmit() {
    if (this.maintenanceForm.invalid) {
      this.maintenanceForm.markAllAsTouched();
      return;
    }
    if (!this.currentPropertyId()) {
      this.errorMsg.set('No active lease found. Cannot raise a maintenance request.');
      return;
    }

    this.submitting.set(true);
    this.errorMsg.set('');
    const user = this.auth.currentUser()!;
    const formVal = this.maintenanceForm.value;

    const request: Partial<MaintenanceRequest> = {
      ...formVal,
      propertyId: this.currentPropertyId()!,
      tenantId: user.id
    };

    this.maintenanceService.submit(request).subscribe({
      next: () => {
        this.submitting.set(false);
        this.showForm.set(false);
        this.maintenanceForm.reset();
        this.successMsg.set('Maintenance request submitted successfully!');

        this.notifService.create({
          userId: user.id,
          title: 'Maintenance Request Submitted',
          message: `Your maintenance request (${formVal.category}) has been raised.`,
          type: 'info'
        }).subscribe();

        this.maintenanceService.getByTenant(user.id).subscribe(data => {
          this.requests.set(data.reverse());
        });
        setTimeout(() => this.successMsg.set(''), 4000);
      },
      error: () => {
        this.submitting.set(false);
        this.errorMsg.set('Failed to submit request. Please try again.');
      }
    });
  }

  urgencyClass(urgency: string): string {
    const map: Record<string, string> = { low: 'tag-low', medium: 'tag-medium', high: 'tag-high' };
    return map[urgency] || '';
  }
}