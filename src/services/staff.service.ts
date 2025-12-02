import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class StaffService {

  API = "http://localhost:5000/staff";

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

  markAttendance(id: string, data: any) {
    return this.http.patch(`${this.API}/attendance/${id}`, data);
  }
}
