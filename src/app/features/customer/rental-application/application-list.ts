import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApplicationService } from '../../../core/services/application-service';
import { AuthService } from '../../../core/services/auth-service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge';
import { RentalApplication } from '../../../core/models/application-model';

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent],
  templateUrl: './application-list.html',
  styleUrl: './application-list.css'
})
export class ApplicationListComponent implements OnInit {

  applications = signal<RentalApplication[]>([]);
  loading = signal(true);

  constructor(
    private appService: ApplicationService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    const userId = this.auth.currentUser()!.id;
    this.appService.getByCustomer(userId).subscribe({
      next: (apps) => {
        this.applications.set(apps);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
