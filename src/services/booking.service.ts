import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../app/environments/environment';
import { Observable } from 'rxjs';
import { CustomerService } from './customer.service';

import { switchMap, catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';
const BASE = `${environment.apiUrl}`;
@Injectable({
  providedIn: 'root'
})
export class BookingService {
  api = `${BASE}`;

  constructor(
  private http: HttpClient,
  private customerService: CustomerService
) {}

  

getBookings(): Observable<any[]> {
  return this.http.get<any[]>(`${this.api}/booking`);
}

  createBooking1(data: any) {
    console.log("Booking data:", data);
    return this.http.post(`${this.api}/booking`, data);
  }


createBooking(data: any) {

  const phone = (data.phone || '').trim();

  if (!phone) {
    return throwError(() => new Error('Customer phone required'));
  }

  return this.customerService.searchCustomer(phone).pipe(

    switchMap((res: any) => {

      const list = Array.isArray(res) ? res : [];
      const existing = list.find(c => c.phone === phone);

      /* CUSTOMER FOUND */

      if (existing) {

        data.customerId = existing._id;
        data.customername = existing.customername;

        return this.http.post(`${this.api}/booking`, data);

      }

      /* CUSTOMER NOT FOUND → CREATE */

      if (!data.name?.trim()) {
        return throwError(() => new Error('Customer name required'));
      }

      const newCustomer = {
        name: data.customername.trim(),
        phone: phone,
        address: data.address || '',
        email: ''
      };

      return this.customerService.createCustomer(newCustomer).pipe(

        switchMap((created: any) => {

          const c = created.customer || created;

          data.customerId = c._id;
          data.customername = c.name;

          return this.http.post(`${this.api}/booking`, data);

        })

      );

    }),

    catchError(err => {

      console.error("Create booking error:", err);

      return throwError(() => err);

    })

  );

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
Conformbooking(id: string) {
    return this.http.patch(`${this.api}/booking/conform/${id}`, {});
  }
Cancelbooking(id: string) {
    return this.http.patch(`${this.api}/booking/cancel/${id}`, {});
  }
  
}
