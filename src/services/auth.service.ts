import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../app/environments/environment';
const BASE = `${environment.apiUrl}`;
export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: { id: string; username: string; role: string };
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  API = `${BASE}/auth`;
  private loggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  public isLoggedIn$ = this.loggedInSubject.asObservable();
  constructor(private http: HttpClient) {}

  login(data: any): Observable<LoginResponse> {
   
    return this.http.post<LoginResponse>(`${this.API}/login`, data);
  }

  saveSession(res: LoginResponse) {
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
  }
// In your auth.service.ts, add this method:
register(credentials: { username: string; password: string; role?: string }) {
  
  return this.http.post(`${this.API}/register`, credentials);
}

  getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn() {
    return !!localStorage.getItem("token");
  }
private checkLoginStatus(): void {
    this.loggedInSubject.next(this.isLoggedIn());
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    this.loggedInSubject.next(false);
  }
}
