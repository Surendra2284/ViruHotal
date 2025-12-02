import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  username = "";
  password = "";
  loading = false;
  error = "";

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  login() {
    if (!this.username || !this.password) {
      this.error = "Please enter username and password";
      return;
    }

    this.loading = true;
    this.error = "";

    this.auth.login({ username: this.username, password: this.password })
      .subscribe({
        next: (res: any) => {
          this.auth.saveUser(res);
          this.router.navigate(['/']);
        },
        error: err => {
          this.loading = false;
          this.error = err.error.message || "Login failed";
        }
      });
  }
}
