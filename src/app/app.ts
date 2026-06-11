import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Navbar } from "./shared/components/navbar/navbar";
import { Footer } from "./shared/components/footer/footer";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('RentEase Portal');
  showFooter = signal(true);
  showNavbar = signal(true);

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event) => {
      const url = event.urlAfterRedirects || event.url;
      const isAuthPage = url.includes('/auth/login') || url.includes('/auth/register');
      this.showFooter.set(!isAuthPage);
      this.showNavbar.set(!isAuthPage);
    });
  }
}
