import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../../services/rooms.service';
import { Room } from '../../models/room.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit {

  rooms: Room[] = [];
  loading = true;

  constructor(
    private roomService: RoomService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms() {
    this.roomService.getRooms().subscribe({
      next: (res: any) => {
        this.rooms = res;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        console.error("Failed to load rooms", err);
      }
    });
  }

  deleteRoom(id: string) {
    if (!confirm("Are you sure you want to delete this room?")) return;

    this.roomService.deleteRoom(id).subscribe({
      next: () => this.loadRooms(),
      error: err => console.error("Delete error", err)
    });
  }
}
