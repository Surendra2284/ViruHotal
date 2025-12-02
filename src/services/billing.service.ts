import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BillingService {

  API = "http://localhost:5000";

  constructor(private http: HttpClient) {}

  generateBill(id: string, data: any) {
    return this.http.post(`${this.API}/billing/generate/${id}`, data);
  }

  getBill(id: string) {
    return this.http.get(`${this.API}/billing/${id}`);
  }
}
