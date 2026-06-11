import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusLabelPipe } from '../../pipes/status-label.pipe';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule, StatusLabelPipe],
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.css'
})
export class StatusBadgeComponent {
  @Input() status = '';

  get statusClass() {
    return this.status.replace(/_/g, '_');
  }
}
