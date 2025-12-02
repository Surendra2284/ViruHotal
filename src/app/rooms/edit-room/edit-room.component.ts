import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../../../services/rooms.service';
import { Room } from '../../models/room.model';

@Component({
  selector: 'app-edit-room',
  templateUrl: './edit-room.component.html',
  styleUrls: ['./edit-room.component.css']
})
export class EditRoomComponent implements OnInit {

  id!: string;
  room: Room = {
    roomNumber: '',
    name: '',
    type: '',
    price: 0,
    status: 'Available'
   
  };

  loading = true;
  error = "";

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.loadRoom();
  }

  loadRoom() {
    this.roomService.getRooms().subscribe({
      next: (list: any) => {
        const found = list.find((r: Room) => r._id === this.id);

        if (!found) {
          this.error = "Room not found";
          return;
        }

        this.room = found;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        console.error("Error loading rooms", err);
      }
    });
  }

  save() {
    if (!this.room.roomNumber || !this.room.type || !this.room.price) {
      this.error = "All fields are required!";
      return;
    }

    this.roomService.updateRoom(this.id, this.room).subscribe({
      next: () => this.router.navigate(['/rooms']),
      error: err => {
        this.error = "Failed to update room";
      }
    });
  }
}
