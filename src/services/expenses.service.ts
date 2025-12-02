import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ExpenseService {

  API = "http://localhost:5000/expenses";

  constructor(private http: HttpClient) {}

  getDaily() {
    return this.http.get(`${this.API}/daily`);
  }

  getMonthly() {
    return this.http.get(`${this.API}/monthly`);
  }

  addExpense(data: any) {
    return this.http.post(this.API, data);
  }
}
