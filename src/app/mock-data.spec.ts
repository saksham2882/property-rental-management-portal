import { signal } from '@angular/core';
import { of } from 'rxjs';
import { User } from './core/models/user-model';
import { Property } from './core/models/property-model';
import { RentalApplication } from './core/models/application-model';
import { Lease } from './core/models/lease-model';
import { Rent } from './core/models/rent-model';
import { MaintenanceRequest } from './core/models/maintenance-model';
import { Notification } from './core/models/notification-model';

export const mockUser: User = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  password: 'secret123',
  role: 'customer',
  phone: '9876543210',
  city: 'Mumbai',
  createdAt: '2026-01-01'
};

export const mockProperty: Property = {
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

export const mockApplication: RentalApplication = {
  id: 100,
  propertyId: mockProperty.id,
  customerId: mockUser.id,
  applicantName: mockUser.name,
  applicantEmail: mockUser.email,
  applicantPhone: mockUser.phone!,
  moveInDate: '2026-07-15',
  monthlyIncome: 80000,
  occupants: 2,
  documents: ['ID Proof'],
  message: 'Interested',
  status: 'under_review',
  appliedAt: '2026-01-01'
};

export const mockLease: Lease = {
  id: 20,
  applicationId: mockApplication.id!,
  propertyId: mockProperty.id,
  tenantId: mockUser.id,
  startDate: '2026-07-01',
  endDate: '2027-06-30',
  monthlyRent: mockProperty.rent,
  deposit: mockProperty.deposit,
  status: 'active',
  conditions: 'Standard',
  propertyTitle: mockProperty.title
};

export const mockRent: Rent = {
  id: 30,
  leaseId: mockLease.id!,
  tenantId: mockUser.id,
  month: 'July 2026',
  amount: mockProperty.rent,
  dueDate: '2026-07-05',
  paidDate: null,
  status: 'pending'
};

export const mockMaintenanceRequest: MaintenanceRequest = {
  id: 40,
  propertyId: mockProperty.id,
  tenantId: mockUser.id,
  category: 'plumbing',
  description: 'Leak',
  urgency: 'medium',
  status: 'pending',
  raisedAt: '2026-01-01',
  resolvedAt: null,
  adminNote: ''
};

export const mockNotification: Notification = {
  id: 50,
  userId: mockUser.id,
  title: 'Hello',
  message: 'Message',
  type: 'info',
  isRead: false,
  createdAt: '2026-01-01'
};

export const authMock = () => ({
  currentUser: signal(mockUser),
  isLoggedIn: signal(true),
  isAdmin: jasmine.createSpy('isAdmin').and.returnValue(mockUser.role === 'admin'),
  isCustomer: jasmine.createSpy('isCustomer').and.returnValue(mockUser.role === 'customer'),
  login: jasmine.createSpy('login').and.returnValue(of([mockUser])),
  register: jasmine.createSpy('register').and.returnValue(of(mockUser)),
  logout: jasmine.createSpy('logout'),
  updateProfile: jasmine.createSpy('updateProfile').and.returnValue(of(mockUser))
});

export const routerMock = () => ({ navigate: jasmine.createSpy('navigate') });
