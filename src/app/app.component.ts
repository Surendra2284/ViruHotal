import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  openMenu: string | null = null;

  constructor(private auth: AuthService,private router: Router) {}

  get isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  get userRole() {
    return this.auth.getUser()?.role || "";
  }
    isSidebarOpen = false;

toggleSidebar(event: MouseEvent) {
  event.stopPropagation();
  this.isSidebarOpen = !this.isSidebarOpen;
}

  toggleMenu(menu: string) {

if(this.openMenu === menu){

this.openMenu = null;

}else{

this.openMenu = menu;

}

}

  logout() {
    this.auth.logout();
     this.router.navigate(['/hotel-public']);
  }
  Photo() {
    
     this.router.navigate(['/photo']);
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
  



onLayoutClick() {
  if (this.isSidebarOpen) {
    this.isSidebarOpen = false;
  }
}

onSidebarClick(event: MouseEvent) {
  event.stopPropagation();
}


}
