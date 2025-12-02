import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ReportService {

  API = "http://localhost:5000/reports";

  constructor(private http: HttpClient) {}

  getSummary() {
    return this.http.get(`${this.API}/summary`);
  }

  getDailyRevenue() {
    return this.http.get(`${this.API}/daily-revenue`);
  }

  getRoomOccupancy() {
    return this.http.get(`${this.API}/room-occupancy`);
  }

  getRestaurantSales() {
    return this.http.get(`${this.API}/restaurant-sales`);
  }

  getRestaurantSalesTotal() {
    return this.http.get(`${this.API}/restaurant-sales-total`);
  }

  getProfitLoss() {
    return this.http.get(`${this.API}/profit-loss`);
  }
}
