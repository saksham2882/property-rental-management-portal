import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full'
    },
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                loadComponent: () => import('./features/auth/login/login').then(l => l.LoginComponent)
            },
            {
                path: 'register',
                loadComponent: () => import('./features/auth/register/register').then(r => r.RegisterComponent)
            }
        ]
    },
    {
        path: 'customer',
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./features/customer/dashboard/dashboard').then(d => d.Dashboard)
            },
            {
                path: 'profile',
                loadComponent: () => import('./features/customer/profile/profile').then(p => p.Profile)
            },
            {
                path: 'properties',
                loadComponent: () => import('./features/customer/property-catalog/property-catalog').then(p => p.PropertyCatalogComponent)
            },
            {
                path: 'properties/:id',
                loadComponent: () => import('./features/customer/property-detail/property-detail').then(p => p.PropertyDetailComponent)
            },
            {
                path: 'applications',
                loadComponent: () => import('./features/customer/rental-application/application-list').then(a => a.ApplicationListComponent)
            },
            {
                path: 'apply/:propertyId',
                loadComponent: () => import('./features/customer/rental-application/apply-component').then(r => r.ApplyComponent)
            },
            {
                path: 'maintenance',
                loadComponent: () => import('./features/customer/maintenance/maintenance').then(m => m.MaintenanceComponent)
            },
            {
                path: 'notifications',
                loadComponent: () => import('./features/customer/notifications/notifications').then(n => n.NotificationsComponent)
            }
        ]
    },
    {
        path: 'admin',
        canActivate: [adminGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./features/admin/dashboard/admin-dashboard').then(d => d.AdminDashboard)
            },
            {
                path: 'properties',
                loadComponent: () => import('./features/admin/property-management/property-management').then(p => p.PropertyManagementComponent)
            },
            {
                path: 'applications',
                loadComponent: () => import('./features/admin/application-review/application-review').then(a => a.ApplicationReviewComponent)
            },
            {
                path: 'maintenance',
                loadComponent: () => import('./features/admin/maintenance-management/maintenance-management').then(m => m.MaintenanceManagementComponent)
            },
            {
                path: 'notifications',
                loadComponent: () => import('./features/admin/notifications/admin-notifications').then(n => n.AdminNotificationsComponent)
            }
        ]
    },
    {
        path: '**',
        redirectTo: '/auth/login'
    }
];
