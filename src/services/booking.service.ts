import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BookingService {

  API = "http://localhost:5000/booking";

  constructor(private http: HttpClient) {}

  getBookings() {
    return this.http.get(`${this.API}`);
  }

  createBooking(data: any) {
    return this.http.post(`${this.API}`, data);
  }
  deleteBooking(data: any) {
    return this.http.post(`${this.API}`, data);
  }
  checkIn(id: string) {
    return this.http.patch(`${this.API}/checkin/${id}`, {});
  }

  checkOut(id: string) {
    return this.http.patch(`${this.API}/checkout/${id}`, {});
  }
}
