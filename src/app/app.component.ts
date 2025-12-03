import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  openMenu: string | null = null;

  constructor(private auth: AuthService) {}

  get isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  get userRole() {
    return this.auth.getUser()?.role || "";
  }

  toggleMenu(menu: string) {
    this.openMenu = this.openMenu === menu ? null : menu;
  }

  logout() {
    this.auth.logout();
  }

  // ---------- ROLE CHECK HELPERS ----------
  isAdmin() {
    return this.userRole === "Admin";
  }

  isReceptionist() {
    return this.userRole === "Receptionist";
  }

  isRestaurantManager() {
    return this.userRole === "RestaurantManager";
  }
}
