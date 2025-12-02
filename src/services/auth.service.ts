import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {

  API = "http://localhost:5000";
private USER_KEY = 'app_user';
  constructor(private http: HttpClient) {}

  login(data: any) {
    return this.http.post(`${this.API}/auth/login`, data);
  }

  register(data: any) {
    return this.http.post(`${this.API}/auth/register`, data);
  }

  saveUser(data: any) {
    localStorage.setItem("user", JSON.stringify(data));
     localStorage.setItem(this.USER_KEY, JSON.stringify(data));
  }
getLoggedInUser() {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  getUser() {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  }

  logout() {
    localStorage.removeItem("user");
  }
}
