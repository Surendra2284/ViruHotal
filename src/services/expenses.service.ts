import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../app/environments/environment';
const BASE = `${environment.apiUrl}`;
@Injectable({ providedIn: 'root' })
export class ExpenseService {

  API = `${BASE}/expenses`;
  constructor(private http: HttpClient) {}
getExpenses() {
  return this.http.get<any[]>(this.API); // returns array of expenses
}
  getDaily() {
    return this.http.get(`${this.API}/total/daily`);
  }
getDailylist() {
    return this.http.get<any[]>(`${this.API}/total/dailylist`);
  }
  getMonthly() {
    return this.http.get(`${this.API}/total/monthly`);
  }
   getMonthlylist() {
    return this.http.get(`${this.API}/total/monthlylist`);
  }
deleteExpense(id: string) {
  return this.http.delete(`${this.API}/${
    id
  }`);
}

  addExpense(data: any) {
    return this.http.post(this.API, data);
  }
}
