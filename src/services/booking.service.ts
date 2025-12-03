import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  api = "http://localhost:5000";

  constructor(private http: HttpClient) {}

  getBookings() {
    return this.http.get(`${this.api}/booking`);
  }

  createBooking(data: any) {
    console.log("Booking data:", data);
    return this.http.post(`${this.api}/booking`, data);
  }

  deleteBooking(id: string) {
    return this.http.delete(`${this.api}/booking/${id}`);
  }

  checkIn(id: string) {
    return this.http.patch(`${this.api}/booking/checkin/${id}`, {});
  }

  checkOut(id: string) {
    return this.http.patch(`${this.api}/booking/checkout/${id}`, {});
  }
}
