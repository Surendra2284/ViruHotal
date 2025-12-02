import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class RoomService {

  API = "http://localhost:5000/rooms";

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
