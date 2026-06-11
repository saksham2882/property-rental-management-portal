import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaintenanceService } from '../../../core/services/maintenance-service';
import { NotificationService } from '../../../core/services/notification-service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';
import { MaintenanceRequest } from '../../../core/models/maintenance-model';

@Component({
  selector: 'app-maintenance-management',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent, TitleCasePipe],
  templateUrl: './maintenance-management.html',
  styleUrl: './maintenance-management.css'
})
export class MaintenanceManagementComponent implements OnInit {

  requests = signal<MaintenanceRequest[]>([]);
  loading = signal(true);
  successMsg = signal('');
  editingId = signal<number | null>(null);
  editNote = '';
  editStatus = '';

  constructor(
    private maintenanceService: MaintenanceService,
    private notifService: NotificationService
  ) {}

  ngOnInit() {
    this.maintenanceService.getAll().subscribe({
      next: (data) => {
        this.requests.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  startEdit(req: MaintenanceRequest) {
    this.editingId.set(req.id!);
    this.editNote = req.adminNote || '';
    this.editStatus = req.status;
  }

  saveUpdate(req: MaintenanceRequest) {
    const updates: Partial<MaintenanceRequest> = {
      status: this.editStatus as any,
      adminNote: this.editNote
    };
    if (this.editStatus === 'resolved') {
      updates.resolvedAt = new Date().toISOString().split('T')[0];
    }

    this.maintenanceService.update(req.id!, updates).subscribe(() => {
      const updated = this.requests().map(r =>
        r.id === req.id ? { ...r, ...updates } : r
      );
      this.requests.set(updated);
      this.editingId.set(null);
      this.successMsg.set('Maintenance request updated.');

     
      this.notifService.create({
        userId: req.tenantId,
        title: 'Maintenance Update',
        message: `Your maintenance request (${req.category}) status is now: ${this.editStatus}.`,
        type: this.editStatus === 'resolved' ? 'success' : 'info'
      }).subscribe();

      setTimeout(() => this.successMsg.set(''), 3000);
    });
  }

  cancelEdit() {
    this.editingId.set(null);
  }

  urgencyClass(u: string) {
    return { low: 'urg-low', medium: 'urg-med', high: 'urg-high' }[u] || '';
  }
}
