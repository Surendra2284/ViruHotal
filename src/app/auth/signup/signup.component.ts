import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  signupUsername: string = "";
  signupPassword: string = "";
  signupRole: string = "Admin";

  loading: boolean = false;
  error: string = "";

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

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

    this.auth.register({
      username: this.signupUsername,
      password: this.signupPassword,
      role: this.signupRole
    }).subscribe({
      next: (res: any) => {

        this.loading = false;

        // Optional: redirect to login page after signup
        this.router.navigate(['/login']);

      },
      error: err => {
        this.loading = false;
        this.error = err.error?.message || "Signup failed";
      }
    });

  }

}