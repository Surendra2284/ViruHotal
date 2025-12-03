import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: { id: string; username: string; role: string };
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  API = 'http://localhost:5000/auth';

  constructor(private http: HttpClient) {}

  login(data: any): Observable<LoginResponse> {
    console.log("AuthService login:", data);
    return this.http.post<LoginResponse>(`${this.API}/login`, data);
  }

  saveSession(res: LoginResponse) {
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
  }

  getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn() {
    return !!localStorage.getItem("token");
  }

  logout() {
    localStorage.clear();
  }
}
