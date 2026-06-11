import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'statusLabel', standalone: true })
export class StatusLabelPipe implements PipeTransform {
  transform(status: string): string {
    const labels: Record<string, string> = {
      under_review: 'Under Review',
      approved: 'Approved',
      rejected: 'Rejected',
      waitlisted: 'Waitlisted',
      paid: 'Paid',
      pending: 'Pending',
      overdue: 'Overdue',
      active: 'Active',
      expired: 'Expired',
      terminated: 'Terminated',
      in_progress: 'In Progress',
      resolved: 'Resolved'
    };
    return labels[status] || status;
  }
}
