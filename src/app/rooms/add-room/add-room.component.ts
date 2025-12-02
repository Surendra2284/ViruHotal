import { Component } from '@angular/core';
import { RoomService } from '../../../services/rooms.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.scss']
})
export class AddRoomComponent {

  room = {
    roomNumber: '',
    type: '',
    price: 0,
    name: '',
    status: 'available'
  };

  error = "";
  loading = false;

  constructor(
    private roomService: RoomService,
    private router: Router
  ) {}

  save() {
    if (!this.room.roomNumber || !this.room.type || !this.room.price) {
      this.error = "All fields are required!";
      return;
    }

    this.loading = true;

    this.roomService.addRoom(this.room)
      .subscribe({
        next: () => this.router.navigate(['/rooms']),
        error: err => {
          this.loading = false;
          this.error = "Error adding room!";
        }
      });
  }
}
