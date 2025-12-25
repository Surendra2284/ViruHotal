import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../app/environments/environment';
const BASE = `${environment.apiUrl}`;
@Injectable({ providedIn: 'root' })
export class StaffService {

  API = `${BASE}/staff`;
  constructor(private http: HttpClient) {}

  getStaff() {
    return this.http.get(this.API);
  }

  addStaff(data: any) {
    return this.http.post(this.API, data);
  }

  deleteStaff(id: string) {
    return this.http.delete(`${this.API}/${id}`);
  }
updateStaff(id: string, data: any) {
  return this.http.put(`${this.API}/${id}`, data);
}
getAttendance(id: string) {
  return this.http.get(`${this.API}/attendance/${id}`);
}

getDaily(date: string) {
  return this.http.get(`${this.API}/daily/${date}`);
}

getMonthly(month: string) {
  return this.http.get(`${this.API}/monthly/${month}`);
}

  markAttendance(id: string, data: any) {
    return this.http.post(`${this.API}/attendance/${id}`, data);
  }
}
