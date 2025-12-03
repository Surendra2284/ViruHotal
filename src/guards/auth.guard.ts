import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {

    const isLogged = this.auth.isLoggedIn();    // checks token
    const user = this.auth.getUser();           // checks stored user object

    if (!isLogged || !user) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
