import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../app/environments/environment';
const BASE = `${environment.apiUrl}`;
@Injectable({ providedIn: 'root' })
export class RoomService {

  API = `${BASE}/rooms`;
  constructor(private http: HttpClient) {}

  getRooms() {
    return this.http.get(this.API);
  }

  getAvailable() {
    return this.http.get(`${this.API}/available`);
  }

  addRoom(data: any) {
    return this.http.post(this.API, data);
  }

  updateRoom(id: string, data: any) {
    return this.http.put(`${this.API}/${id}`, data);
  }

  deleteRoom(id: string) {
    return this.http.delete(`${this.API}/${id}`);
  }
}
