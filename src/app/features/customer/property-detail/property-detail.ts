import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PropertyService } from '../../../core/services/property-service';
import { ApplicationService } from '../../../core/services/application-service';
import { Property } from '../../../core/models/property-model';
import { RentFormatPipe } from '../../../shared/pipes/rent-format.pipe';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, RentFormatPipe],
  templateUrl: './property-detail.html',
  styleUrl: './property-detail.css'
})
export class PropertyDetailComponent implements OnInit {

  property = signal<Property | null>(null);
  activeImageIndex = signal(0);
  loading = signal(true);
  alreadyApplied = signal(false);

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private appService: ApplicationService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.propertyService.getById(id).subscribe({
      next: (prop) => {
        this.property.set(prop);
        this.loading.set(false);

        
        const user = this.auth.currentUser();
        if (user) {
          this.appService.getByCustomer(user.id).subscribe(apps => {
            const hasApplied = apps.some(app => String(app.propertyId) === String(id));
            this.alreadyApplied.set(hasApplied);
          });
        }
      },
      error: () => this.loading.set(false)
    });
  }

  selectImage(index: number) {
    this.activeImageIndex.set(index);
  }
}
