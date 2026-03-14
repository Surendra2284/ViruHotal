import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  showAuth: boolean = false;
  activeTab: 'login' | 'signup' = 'login';
  
  // Login fields
  loginUsername = "";
  loginPassword = "";
  isLoggedIn = false;
  // Signup fields
  signupUsername = "";
  signupPassword = "";
  signupRole = "Admin"; // default role
  
  loading = false;
  error = "";

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  toggleAuth(): void {
    this.showAuth = !this.showAuth;
    this.error = '';
    if (!this.showAuth) {
      this.resetForms();
    }
  }

  setActiveTab(tab: 'login' | 'signup'): void {
    this.activeTab = tab;
    this.error = '';
  }

  private resetForms(): void {
    this.loginUsername = "";
    this.loginPassword = "";
    this.signupUsername = "";
    this.signupPassword = "";
    this.signupRole = "Admin";
    this.activeTab = 'login';
  }

  login(): void {
    if (!this.loginUsername || !this.loginPassword) {
      this.error = "Please enter username and password";
      return;
    }

    this.loading = true;
    this.error = "";

    this.auth.login({ username: this.loginUsername, password: this.loginPassword })
      .subscribe({
        next: (res: any) => {
          this.auth.saveSession(res);
          /* hide staff login banner */
        localStorage.setItem('staffLoggedIn', 'true');

          this.router.navigate(['/dashboard']);
          this.isLoggedIn = true;
           this.showAuth = false;
        },
        error: err => {
          this.loading = false;
          this.error = err.error?.message || "Login failed";
        }
      });
  }

  signup(): void {
    if (!this.signupUsername || !this.signupPassword) {
      this.error = "Please enter username and password";
      return;
    }

    if (this.signupPassword.length < 6) {
      this.error = "Password must be at least 6 characters";
      return;
    }

    this.loading = true;
    this.error = "";
    this.signupRole = this.signupRole.trim() || 'Admin';
    // Match backend register controller exactly
    this.auth.register({
      username: this.signupUsername,
      password: this.signupPassword,
      role: this.signupRole
    }).subscribe({
      next: (res: any) => {
        // Auto-login after successful signup (optional)
        
      },
      error: err => {
        this.loading = false;
        this.error = err.error?.message || "Signup failed";
      }
    });
  }
}
