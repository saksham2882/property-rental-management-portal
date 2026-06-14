import { ReplaySubject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { App } from './app';
import { appConfig } from './app.config';
import { routes } from './app.routes';

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
