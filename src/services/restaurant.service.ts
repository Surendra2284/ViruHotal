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
    return this.http.post(`${this.API}/items`, data);
  }

  updateItem(id: string, data: any) {
    return this.http.put(`${this.API}/items/${id}`, data);
  }

  deleteItem(id: string) {
    return this.http.delete(`${this.API}/items/${id}`);
  }

  // ORDERS
  createOrder(data: any) {
    return this.http.post(`${this.API}/orders`, data);
  }

  getOrders() {
  return this.http.get<any[]>(`${this.API}/orders`);
}

deleteOrder(id: string) {
    return this.http.delete(`${this.API}/orders/${id}`);
  }
  updateOrder(id: string, data: any) {
    return this.http.patch(`${this.API}/orders/${id}`, data);
  }
  createCustomer(data: any) {
  return this.http.post(`${this.API}/customers`, data);
}

searchCustomer(key: string) {
  return this.http.get(`${this.API}/customers/search?key=${key}`);
}



}
