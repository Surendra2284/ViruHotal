import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class RestaurantService {

  API = "http://localhost:5000/restaurant";

  constructor(private http: HttpClient) {}

  // MENU
  getItems() {
    return this.http.get(`${this.API}/items`);
  }

  addItem(data: any) {
    return this.http.post(`${this.API}/item`, data);
  }

  updateItem(id: string, data: any) {
    return this.http.put(`${this.API}/item/${id}`, data);
  }

  deleteItem(id: string) {
    return this.http.delete(`${this.API}/item/${id}`);
  }

  // ORDERS
  createOrder(data: any) {
    return this.http.post(`${this.API}/order`, data);
  }

  getOrders() {
    return this.http.get(`${this.API}/orders`);
  }

  updateOrder(id: string, data: any) {
    return this.http.patch(`${this.API}/order/${id}`, data);
  }
}
