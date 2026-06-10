import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth-service';
import { NotificationService } from '../../../core/services/notification.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  menuOpen = false;

  constructor(
    public auth: AuthService,
    public notifService: NotificationService
  ) { }

  ngOnInit() {
    const user = this.auth.currentUser();
    if (user) {
      this.notifService.getByUser(user.id).subscribe();
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.auth.logout();
  }
}
