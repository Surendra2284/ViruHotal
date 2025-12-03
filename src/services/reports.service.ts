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
  return this.http.get(`${this.API}/revenue/daily`);
}


  getRoomOccupancy() {
  return this.http.get(`${this.API}/rooms/occupancy`);
}


  getRestaurantSales() {
  return this.http.get(`${this.API}/restaurant/sales`);
}

getDailyRestaurantSalesDetails() {
  return this.http.get(`${this.API}/restaurant/daily-details`);
}

  getRestaurantSalesTotal() {
  return this.http.get(`${this.API}/restaurant/total`);
}

  getRoomRevenue() {
  return this.http.get(`${this.API}/rooms/revenue`);
}

  getProfitLoss() {
    return this.http.get(`${this.API}/profit-loss`);
  }
}
