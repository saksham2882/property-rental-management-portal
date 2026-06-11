import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MaintenanceService } from '../../../core/services/maintenance-service';
import {
  MaintenanceRequest,
  MAINTENANCE_FORM_CONFIG,
} from '../../../core/models/maintenance-model';

@Component({
  selector: 'app-maintenance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './maintenance.html',
  styleUrl: './maintenance.css',
})
export class MaintenanceComponent implements OnInit {
  requests: MaintenanceRequest[] = [];

  formConfig = MAINTENANCE_FORM_CONFIG;

  formData = {
    category: '',
    description: '',
    urgency: 'medium',
  };

  constructor(private maintenanceService: MaintenanceService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    const tenantId = 1;

    this.maintenanceService.getByTenant(tenantId).subscribe((data) => {
      this.requests = data;
    });
  }

  submitRequest(): void {
    const request = {
      propertyId: 1,
      tenantId: 1,
      category: this.formData.category,
      description: this.formData.description,
      urgency: this.formData.urgency as 'low' | 'medium' | 'high',
    };

    this.maintenanceService.submit(request).subscribe(() => {
      this.formData = {
        category: '',
        description: '',
        urgency: 'medium',
      };

      this.loadRequests();
    });
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  getUrgencyClass(urgency: string): string {
    return urgency.toLowerCase();
  }

  getFieldValue(fieldName: string): string {
    return this.formData[fieldName as keyof typeof this.formData];
  }

  setFieldValue(fieldName: string, value: string): void {
    this.formData[fieldName as keyof typeof this.formData] = value;
  }
}