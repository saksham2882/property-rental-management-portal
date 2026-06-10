import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusLabelPipe } from '../../pipes/status-label.pipe';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule, StatusLabelPipe],
  template: `
    <span class="badge" [ngClass]="statusClass">
      {{ status | statusLabel }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    .approved, .paid, .active, .resolved { background: #d1fae5; color: #065f46; }
    .under_review, .pending, .in_progress { background: #fef3c7; color: #92400e; }
    .rejected, .overdue, .terminated { background: #fee2e2; color: #991b1b; }
    .waitlisted, .expired { background: #e0e7ff; color: #3730a3; }
  `]
})
export class StatusBadgeComponent {
  @Input() status = '';

  get statusClass() {
    return this.status.replace(/_/g, '_');
  }
}
