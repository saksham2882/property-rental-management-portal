import { signal, TemplateRef, ViewContainerRef, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store } from '@ngrx/store';
import { ReplaySubject, firstValueFrom, of } from 'rxjs';

import { App } from './app';
import { appConfig } from './app.config';
import { routes } from './app.routes';
import { AuthService } from './core/services/auth-service';
import { ApplicationService } from './core/services/application-service';
import { LeaseService } from './core/services/lease-service';
import { MaintenanceService } from './core/services/maintenance-service';
import { NotificationService } from './core/services/notification-service';
import { PropertyService } from './core/services/property-service';
import { RentService } from './core/services/rent-service';
import { adminGuard } from './core/guards/admin-guard';
import { authGuard, redirectIfLoggedInGuard } from './core/guards/auth-guard';
import { customerGuard } from './core/guards/customer-guard';
import { confirmLeaveGuard } from './core/guards/unsaved-changes-guard';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { AdminDashboard } from './features/admin/dashboard/admin-dashboard';
import { ApplicationReviewComponent } from './features/admin/application-review/application-review';
import { MaintenanceManagementComponent } from './features/admin/maintenance-management/maintenance-management';
import { AdminNotificationsComponent } from './features/admin/notifications/admin-notifications';
import { PropertyManagementComponent } from './features/admin/property-management/property-management';
import { TenantManagementComponent } from './features/admin/tenant-management/tenant-management';
import { Dashboard } from './features/customer/dashboard/dashboard';
import { LeaseDetailComponent } from './features/customer/lease-detail/lease-detail';
import { MaintenanceComponent } from './features/customer/maintenance/maintenance';
import { NotificationsComponent } from './features/customer/notifications/notifications';
import { Profile } from './features/customer/profile/profile';
import { PropertyCatalogComponent } from './features/customer/property-catalog/property-catalog';
import { PropertyDetailComponent } from './features/customer/property-detail/property-detail';
import { ApplicationListComponent } from './features/customer/rental-application/application-list';
import { ApplyComponent } from './features/customer/rental-application/apply-component';
import { Footer } from './shared/components/footer/footer';
import { Navbar } from './shared/components/navbar/navbar';
import { PropertyCardComponent } from './shared/components/property-card/property-card';
import { StatusBadgeComponent } from './shared/components/status-badge/status-badge';
import { HighlightDirective } from './shared/directives/highlight-directive';
import { RoleAccessDirective } from './shared/directives/role-acess-directive';
import { RentFormatPipe } from './shared/pipes/rent-format.pipe';
import { StatusLabelPipe } from './shared/pipes/status-label.pipe';
import {
  incomeVsRentValidator,
  moveInDateValidator,
  occupancyLimitValidator,
  phoneValidator,
  requiredDocumentsValidator
} from './shared/validators/rental-validators';
import {
  addProperty,
  clearFilters,
  deleteProperty,
  loadProperties,
  loadPropertiesFailure,
  loadPropertiesSuccess,
  selectProperty,
  setFilters,
  updateProperty
} from './store/property/property-actions';
import { PropertyEffects } from './store/property/property-effects';
import { propertyReducer } from './store/property/property-reducer';
import { selectFilteredProperties, selectLoading } from './store/property/property-selectors';
import { MAINTENANCE_FORM_CONFIG } from './core/models/maintenance-model';
import type { RentalApplication } from './core/models/application-model';
import type { Lease } from './core/models/lease-model';
import type { MaintenanceRequest } from './core/models/maintenance-model';
import type { Notification } from './core/models/notification-model';
import type { Property } from './core/models/property-model';
import type { Rent } from './core/models/rent-model';
import type { User } from './core/models/user-model';

const user: User = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  password: 'secret123',
  role: 'customer',
  phone: '9876543210',
  city: 'Mumbai',
  createdAt: '2026-01-01'
};

const property: Property = {
  id: 10,
  title: 'Sample Flat',
  city: 'Mumbai',
  locality: 'Andheri',
  type: 'Apartment',
  bedrooms: 2,
  bathrooms: 1,
  rent: 20000,
  deposit: 50000,
  furnishing: 'Semi-Furnished',
  available: true,
  availableFrom: '2026-07-01',
  area: 900,
  description: 'Nice home',
  amenities: ['Lift'],
  images: ['photo.jpg'],
  ownerId: 1,
  postedAt: '2026-01-01'
};

const application: RentalApplication = {
  id: 100,
  propertyId: property.id,
  customerId: user.id,
  applicantName: user.name,
  applicantEmail: user.email,
  applicantPhone: user.phone!,
  moveInDate: '2026-07-15',
  monthlyIncome: 80000,
  occupants: 2,
  documents: ['ID Proof'],
  message: 'Interested',
  status: 'under_review',
  appliedAt: '2026-01-01'
};

const lease: Lease = {
  id: 20,
  applicationId: application.id!,
  propertyId: property.id,
  tenantId: user.id,
  startDate: '2026-07-01',
  endDate: '2027-06-30',
  monthlyRent: property.rent,
  deposit: property.deposit,
  status: 'active',
  conditions: 'Standard',
  propertyTitle: property.title
};

const rent: Rent = {
  id: 30,
  leaseId: lease.id!,
  tenantId: user.id,
  month: 'July 2026',
  amount: property.rent,
  dueDate: '2026-07-05',
  paidDate: null,
  status: 'pending'
};

const maintenanceRequest: MaintenanceRequest = {
  id: 40,
  propertyId: property.id,
  tenantId: user.id,
  category: 'plumbing',
  description: 'Leak',
  urgency: 'medium',
  status: 'pending',
  raisedAt: '2026-01-01',
  resolvedAt: null,
  adminNote: ''
};

const notification: Notification = {
  id: 50,
  userId: user.id,
  title: 'Hello',
  message: 'Message',
  type: 'info',
  isRead: false,
  createdAt: '2026-01-01'
};

const authMock = () => ({
  currentUser: signal(user),
  isLoggedIn: signal(true),
  isAdmin: jasmine.createSpy('isAdmin').and.returnValue(user.role === 'admin'),
  isCustomer: jasmine.createSpy('isCustomer').and.returnValue(user.role === 'customer'),
  login: jasmine.createSpy('login').and.returnValue(of([user])),
  register: jasmine.createSpy('register').and.returnValue(of(user)),
  logout: jasmine.createSpy('logout'),
  updateProfile: jasmine.createSpy('updateProfile').and.returnValue(of(user))
});

const routerMock = () => ({ navigate: jasmine.createSpy('navigate') });

describe('application shell files', () => {
  it('defines app configuration and routes', () => {
    expect(appConfig.providers.length).toBeGreaterThan(0);
    expect(routes.some(route => route.path === 'admin')).toBeTrue();
    expect(routes.some(route => route.path === 'customer')).toBeTrue();
  });

  it('updates shell chrome for auth routes', () => {
    const events = new ReplaySubject<NavigationEnd>(1);
    const app = new App({ events } as unknown as Router);

    events.next(new NavigationEnd(1, '/auth/login', '/auth/login'));

    expect(app.showFooter()).toBeFalse();
    expect(app.showNavbar()).toBeFalse();
  });
});

describe('http services', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerMock() }
      ]
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('creates AuthService and logs in a matching user', () => {
    const service = TestBed.inject(AuthService);
    service.login(user.email, user.password!).subscribe(result => expect(result).toEqual([user]));

    const req = http.expectOne(`http://localhost:3000/users?email=${user.email}`);
    expect(req.request.method).toBe('GET');
    req.flush([user]);
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('creates ApplicationService and filters by customer', () => {
    const service = TestBed.inject(ApplicationService);
    service.getByCustomer(user.id).subscribe(result => expect(result).toEqual([application]));
    http.expectOne('http://localhost:3000/applications').flush([application, { ...application, id: 101, customerId: 2 }]);
  });

  it('creates LeaseService and filters by tenant', () => {
    const service = TestBed.inject(LeaseService);
    service.getByTenant(user.id).subscribe(result => expect(result).toEqual([lease]));
    http.expectOne('http://localhost:3000/leases').flush([lease, { ...lease, id: 21, tenantId: 2 }]);
  });

  it('creates MaintenanceService and submits default fields', () => {
    const service = TestBed.inject(MaintenanceService);
    service.submit({ category: 'plumbing' }).subscribe(result => expect(result).toEqual(maintenanceRequest));

    const req = http.expectOne('http://localhost:3000/maintenanceRequests');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.status).toBe('pending');
    req.flush(maintenanceRequest);
  });

  it('creates NotificationService and updates unread count', () => {
    const service = TestBed.inject(NotificationService);
    service.getByUser(user.id).subscribe(result => expect(result).toEqual([notification]));
    http.expectOne('http://localhost:3000/notifications').flush([notification, { ...notification, id: 51, userId: 2 }]);
    expect(service.unreadCount()).toBe(1);
  });

  it('creates PropertyService and sends filters as query params', () => {
    const service = TestBed.inject(PropertyService);
    service.getFiltered({ city: 'Mumbai', bedrooms: 2, available: true }).subscribe(result => expect(result).toEqual([property]));

    const req = http.expectOne(request => request.url === 'http://localhost:3000/properties');
    expect(req.request.params.get('city')).toBe('Mumbai');
    expect(req.request.params.get('bedrooms')).toBe('2');
    expect(req.request.params.get('available')).toBe('true');
    req.flush([property]);
  });

  it('creates RentService and marks rent paid', () => {
    const service = TestBed.inject(RentService);
    service.markPaid(rent.id!).subscribe(result => expect(result).toEqual({ ...rent, status: 'paid' }));

    const req = http.expectOne(`http://localhost:3000/rents/${rent.id}`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body.status).toBe('paid');
    req.flush({ ...rent, status: 'paid' });
  });
});

describe('guards', () => {
  it('allows authenticated users through authGuard', () => {
    TestBed.configureTestingModule({ providers: [{ provide: AuthService, useValue: authMock() }, { provide: Router, useValue: routerMock() }] });
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBeTrue();
  });

  it('redirects logged-in users away from auth pages', () => {
    const router = routerMock();
    TestBed.configureTestingModule({ providers: [{ provide: AuthService, useValue: authMock() }, { provide: Router, useValue: router }] });
    const result = TestBed.runInInjectionContext(() => redirectIfLoggedInGuard({} as any, {} as any));
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/customer/dashboard']);
  });

  it('allows customer guard for customers and rejects admin guard for customers', () => {
    const router = routerMock();
    TestBed.configureTestingModule({ providers: [{ provide: AuthService, useValue: authMock() }, { provide: Router, useValue: router }] });
    expect(TestBed.runInInjectionContext(() => customerGuard({} as any, {} as any))).toBeTrue();
    expect(TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any))).toBeFalse();
  });

  it('confirms unsaved changes before deactivation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const component = { hasUnsavedChanges: () => true };
    expect(confirmLeaveGuard(component, {} as any, {} as any, {} as any)).toBeTrue();
    expect(window.confirm).toHaveBeenCalled();
  });
});

describe('components as classes', () => {
  const fb = new FormBuilder();

  it('creates auth components', () => {
    const router = routerMock();
    const auth = authMock();
    const login = new LoginComponent(fb, auth as any, router as any);
    login.fillCredentials('admin');
    expect(login.loginForm.value.email).toBe('admin@rental.com');

    const register = new RegisterComponent(fb, auth as any, router as any);
    expect(register.registerForm.contains('confirmPassword')).toBeTrue();
  });

  it('creates admin components', () => {
    const propertyService = { getAll: () => of([property]), update: () => of(property), create: () => of(property), delete: () => of(void 0), getById: () => of(property) };
    const appService = { getAll: () => of([application]), updateStatus: () => of(application) };
    const maintenanceService = { getAll: () => of([maintenanceRequest]), update: () => of(maintenanceRequest) };
    const notificationService = { getAll: () => of([notification]), markAsRead: () => of(notification), create: () => of(notification) };
    const leaseService = { getAll: () => of([lease]), create: () => of(lease) };
    const rentService = { create: () => of(rent) };

    const dashboard = new AdminDashboard(propertyService as any, appService as any, maintenanceService as any, notificationService as any);
    dashboard.ngOnInit();
    expect(dashboard.totalProperties()).toBe(1);

    const review = new ApplicationReviewComponent(appService as any, notificationService as any, propertyService as any, leaseService as any, rentService as any);
    review.ngOnInit();
    expect(review.loading()).toBeFalse();

    const maintenance = new MaintenanceManagementComponent(maintenanceService as any, notificationService as any);
    maintenance.ngOnInit();
    expect(maintenance.urgencyClass('high')).toBe('urg-high');

    const adminNotifications = new AdminNotificationsComponent(notificationService as any);
    adminNotifications.ngOnInit();
    expect(adminNotifications.iconFor('success')).toBe('SUCCESS');

    const propertyManagement = new PropertyManagementComponent(propertyService as any);
    propertyManagement.ngOnInit();
    expect(propertyManagement.properties()).toEqual([property]);

    const tenant = new TenantManagementComponent({ getAll: () => of([lease]) } as any, { get: () => of([user]) } as any);
    expect(tenant.getTenantDetails({ tenantId: 99 }).name).toBe('Unknown');
  });

  it('creates customer components', () => {
    const auth = authMock();
    const appService = { getByCustomer: () => of([application]), submit: () => of(application) };
    const leaseService = { getByTenant: () => of([lease]) };
    const rentService = { getByTenant: () => of([rent]) };
    const maintenanceService = { getByTenant: () => of([maintenanceRequest]), submit: () => of(maintenanceRequest) };
    const notificationService = { getByUser: () => of([notification]), markAsRead: () => of(notification), create: () => of(notification), unreadCount: signal(1) };
    const propertyService = { getById: () => of(property) };
    const route = { snapshot: { paramMap: { get: () => String(property.id) } } };

    const dashboard = new Dashboard(auth as any, appService as any, leaseService as any, rentService as any, maintenanceService as any);
    dashboard.ngOnInit();
    expect(dashboard.totalApplications()).toBe(1);

    const leaseDetail = new LeaseDetailComponent(leaseService as any, auth as any);
    leaseDetail.ngOnInit();
    expect(leaseDetail.leases()).toEqual([lease]);

    const maintenance = new MaintenanceComponent(fb, maintenanceService as any, leaseService as any, auth as any, notificationService as any);
    maintenance.ngOnInit();
    expect(maintenance.urgencyClass('medium')).toBe('tag-medium');

    const notifications = new NotificationsComponent(notificationService as any, auth as any);
    notifications.ngOnInit();
    notifications.markRead(notification);
    expect(notificationService.unreadCount()).toBe(0);

    const profile = new Profile(auth as any);
    expect(profile.hasUnsavedChanges()).toBeFalse();

    const catalogStore = { select: () => of([]), dispatch: jasmine.createSpy('dispatch') };
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [{ provide: Store, useValue: catalogStore }] });
    const catalog = TestBed.runInInjectionContext(() => new PropertyCatalogComponent());
    catalog.applyFilters();
    expect(catalog.cities.length).toBeGreaterThan(0);

    const detail = new PropertyDetailComponent(route as any, propertyService as any, appService as any, auth as any);
    detail.ngOnInit();
    detail.selectImage(0);
    expect(detail.property()).toEqual(property);

    const list = new ApplicationListComponent(appService as any, auth as any);
    list.ngOnInit();
    expect(list.applications()).toEqual([application]);

    const apply = new ApplyComponent(fb, { snapshot: { paramMap: { get: () => String(property.id) } } } as any, routerMock() as any, appService as any, propertyService as any, auth as any, notificationService as any, { detectChanges: jasmine.createSpy('detectChanges') } as any);
    apply.buildForm(property);
    apply.toggleDocument('ID Proof');
    expect(apply.selectedDocs).toEqual(['ID Proof']);
  });

  it('creates shared components', () => {
    expect(new Footer(authMock() as any).currentYear).toBeGreaterThan(2020);

    const navbar = new Navbar(authMock() as any, { getByUser: () => of([]) } as any);
    navbar.toggleMenu();
    expect(navbar.menuOpen).toBeTrue();

    const card = new PropertyCardComponent();
    card.property = property;
    expect(card.property.title).toBe(property.title);

    const badge = new StatusBadgeComponent();
    badge.status = 'under_review';
    expect(badge.statusClass).toBe('under_review');
  });
});

describe('directives, pipes, validators, and models', () => {
  it('applies highlight styles', () => {
    const nativeElement = { style: { backgroundColor: '', transition: '' } };
    const directive = new HighlightDirective({ nativeElement } as ElementRef);
    directive.appHighlight = 'yellow';
    directive.onMouseEnter();
    expect(nativeElement.style.backgroundColor).toBe('yellow');
    directive.onMouseLeave();
    expect(nativeElement.style.backgroundColor).toBe('');
  });

  it('renders or clears role access templates', () => {
    const view = { createEmbeddedView: jasmine.createSpy('createEmbeddedView'), clear: jasmine.createSpy('clear') } as unknown as ViewContainerRef;
    const directive = new RoleAccessDirective({} as TemplateRef<unknown>, view, authMock() as any);
    directive.appRoleAccess = 'customer';
    directive.ngOnInit();
    expect(view.createEmbeddedView).toHaveBeenCalled();
  });

  it('formats display values', () => {
    expect(new RentFormatPipe().transform(12000)).toContain('12,000/month');
    expect(new StatusLabelPipe().transform('under_review')).toBe('Under Review');
  });

  it('validates rental form fields', () => {
    const future = new Date();
    future.setDate(future.getDate() + 8);

    expect(phoneValidator()(new FormControl('9876543210'))).toBeNull();
    expect(requiredDocumentsValidator()(new FormControl(['ID Proof']))).toBeNull();
    expect(occupancyLimitValidator(2)(new FormControl(3))).toEqual(jasmine.objectContaining({ occupancyExceeded: jasmine.any(String) }));
    expect(incomeVsRentValidator(10000)(new FormControl(1000))).toEqual(jasmine.objectContaining({ incomeTooLow: jasmine.any(String) }));
    expect(moveInDateValidator()(new FormControl(future.toISOString().split('T')[0]))).toBeNull();
  });

  it('keeps exported maintenance form config available', () => {
    expect(MAINTENANCE_FORM_CONFIG.length).toBeGreaterThan(0);
  });
});

describe('property store', () => {
  it('creates actions', () => {
    expect(loadProperties().type).toBe('[Property] Load Properties');
    expect(loadPropertiesSuccess({ properties: [property] }).properties).toEqual([property]);
    expect(loadPropertiesFailure({ error: 'failed' }).error).toBe('failed');
    expect(setFilters({ filters: { city: 'Mumbai' } }).filters.city).toBe('Mumbai');
    expect(clearFilters().type).toBe('[Property] Clear Filters');
    expect(selectProperty({ id: property.id }).id).toBe(property.id);
    expect(addProperty({ property }).property).toEqual(property);
    expect(updateProperty({ property }).property).toEqual(property);
    expect(deleteProperty({ id: property.id }).id).toBe(property.id);
  });

  it('reduces and selects property state', () => {
    const loaded = propertyReducer(undefined, loadPropertiesSuccess({ properties: [property] }));
    const filtered = { ...loaded, filters: { city: 'mumbai', maxRent: 25000 } };

    expect(selectLoading.projector(loaded)).toBeFalse();
    expect(selectFilteredProperties.projector([property], filtered.filters)).toEqual([property]);
  });

  it('loads properties through effects', async () => {
    const actions$ = new ReplaySubject(1);
    const service = { getAll: jasmine.createSpy('getAll').and.returnValue(of([property])) };

    TestBed.configureTestingModule({
      providers: [
        PropertyEffects,
        provideMockActions(() => actions$),
        { provide: PropertyService, useValue: service }
      ]
    });

    const effects = TestBed.inject(PropertyEffects);
    actions$.next(loadProperties());

    await expectAsync(firstValueFrom(effects.loadProperties$)).toBeResolvedTo(loadPropertiesSuccess({ properties: [property] }));
  });
});
