import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../app/environments/environment';
const BASE = `${environment.apiUrl}`;
@Injectable({ providedIn: 'root' })
export class BillingService {
  private baseUrl = `${BASE}/billing`;
  constructor(private http: HttpClient) {}

  getAllBills() {
    return this.http.get<any[]>(`${this.baseUrl}/all`);
  }

  getBillDynamic(id: string) {
    return this.http.get<any>(`${this.baseUrl}/dynamic/${id}`);
  }

  generateBill(bookingId: string, roomCost: number) {
    return this.http.post(`${this.baseUrl}/generate/${bookingId}`, { roomCost });
  }

  generateDirectBill(customerId: string) {
    return this.http.post(`${this.baseUrl}/generate/direct/${customerId}`, {});
  }

  deleteBill(billId: string) {
    return this.http.delete(`${this.baseUrl}/${billId}`);
  }
  getBillableEntries(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/billable`);
  }

}
