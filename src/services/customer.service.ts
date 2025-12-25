import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../app/environments/environment';
const BASE = `${environment.apiUrl}`;
@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  API = `${BASE}/customers`;
  constructor(private http: HttpClient) {}

  // Create new customer
  createCustomer(data: any): Observable<any> {
    return this.http.post(`${this.API}`, data);
  }

  // Search customer by name or phone
  searchCustomer(key: string): Observable<any> {
    return this.http.get(`${this.API}/search?key=${key}`);
  }
getAllCustomers() {
    return this.http.get(`${this.API}`);
  }
  // Get single customer
  getCustomer(id: string): Observable<any> {
    return this.http.get(`${this.API}/${id}`);
  }
}
