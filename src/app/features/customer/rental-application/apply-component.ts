import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../../../core/services/application-service';
import { PropertyService } from '../../../core/services/property-service';
import { AuthService } from '../../../core/services/auth-service';
import { NotificationService } from '../../../core/services/notification-service';
import { Property } from '../../../core/models/property-model';
import { RentFormatPipe } from '../../../shared/pipes/rent-format.pipe';
import {
  moveInDateValidator,
  incomeVsRentValidator,
  occupancyLimitValidator,
  requiredDocumentsValidator,
  phoneValidator
} from '../../../shared/validators/rental-validators';

@Component({
  selector: 'app-apply',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RentFormatPipe],
  templateUrl: './apply-component.html',
  styleUrl: './apply-component.css'
})
export class ApplyComponent implements OnInit {

  property = signal<Property | null>(null);
  applyForm = signal<FormGroup | null>(null);
  successMsg = '';
  errorMsg = '';
  loading = false;
  alreadyApplied = signal(false);

  availableDocuments = ['ID Proof', 'Income Certificate', 'Employment Letter', 'Bank Statement', 'Previous Rent Receipt'];
  selectedDocs: string[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private appService: ApplicationService,
    private propertyService: PropertyService,
    public auth: AuthService,
    private notifService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const propId = Number(this.route.snapshot.paramMap.get('propertyId'));
    
    this.propertyService.getById(propId).subscribe({
      next: (prop) => {
        this.property.set(prop);
        
        const user = this.auth.currentUser();
        if (!user) {
          this.errorMsg = 'You must be logged in to apply for a property.';
          return;
        }

        this.appService.getByCustomer(user.id).subscribe({
          next: (apps) => {
            const hasApplied = apps.some(app => String(app.propertyId) === String(propId));
            if (hasApplied) {
              this.alreadyApplied.set(true);
              this.errorMsg = 'You have already submitted an application for this property.';
            } else {
              this.buildForm(prop);
            }
          },
          error: (err) => {
            console.error('Failed to load applications:', err);
            this.buildForm(prop); // fallback
          }
        });
      },
      error: (err) => {
        console.error('Failed to load property details:', err);
        this.errorMsg = 'Failed to load property details.';
      }
    });
  }

  buildForm(prop: Property) {
    const user = this.auth.currentUser()!;
    const g = this.fb.group({
      applicantName: [user.name, Validators.required],
      applicantEmail: [user.email, [Validators.required, Validators.email]],
      applicantPhone: [user.phone || '', [Validators.required, phoneValidator()]],
      moveInDate: ['', [Validators.required, moveInDateValidator()]],
      monthlyIncome: ['', [Validators.required, incomeVsRentValidator(prop.rent)]],
      occupants: ['', [Validators.required, occupancyLimitValidator(prop.bedrooms * 2)]],
      message: ['', Validators.required]
    });
    this.applyForm.set(g);
    
  
    this.cdr.detectChanges();
  }

  toggleDocument(doc: string) {
    const idx = this.selectedDocs.indexOf(doc);
    if (idx > -1) {
      this.selectedDocs.splice(idx, 1);
    } else {
      this.selectedDocs.push(doc);
    }
  }

  onSubmit() {
    const currentForm = this.applyForm();
    if (this.alreadyApplied()) {
      this.errorMsg = 'You have already submitted an application for this property.';
      return;
    }
    if (!currentForm) {
      this.errorMsg = 'Form is not initialized.';
      return;
    }
    if (currentForm.invalid) {
      currentForm.markAllAsTouched();
      return;
    }
    if (this.selectedDocs.length === 0) {
      this.errorMsg = 'Please select at least one document to attach.';
      return;
    }

    this.loading = true;
    this.errorMsg = '';
    const user = this.auth.currentUser()!;
    const prop = this.property()!;

    const application = {
      ...currentForm.value,
      propertyId: prop.id,
      customerId: user.id,
      documents: this.selectedDocs,
      status: 'under_review' as const
    };

    this.appService.submit(application).subscribe({
      next: () => {
        this.loading = false;
       
        this.notifService.create({
          userId: user.id,
          title: 'Application Submitted',
          message: `Your application for "${prop.title}" has been submitted and is under review.`,
          type: 'info'
        }).subscribe();
        this.successMsg = 'Application submitted successfully! Redirecting...';
        setTimeout(() => this.router.navigate(['/customer/applications']), 2000);
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'Failed to submit application. Please try again.';
      }
    });
  }

  get f() {
    const currentForm = this.applyForm();
    return currentForm ? currentForm.controls : {};
  }
}
