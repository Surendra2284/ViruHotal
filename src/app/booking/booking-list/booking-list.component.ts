import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../services/booking.service';
import { Router } from '@angular/router';
import { RoomService } from '../../../services/rooms.service';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss']
})
export class BookingListComponent implements OnInit {

  bookings: any[] = [];
  loading = true;
  rooms: any[] = [];

  constructor(
    private bookingService: BookingService,
    private roomService: RoomService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  // 🔥 Load Rooms FIRST → Then Bookings
  loadData() {
    this.roomService.getRooms().subscribe({
      next: (roomsRes: any) => {
        this.rooms = roomsRes;
        this.loadBookings();   // Load bookings after rooms
      },
      error: err => {
        console.error("Failed to load rooms", err);
        this.loading = false;
      }
    });
  }

  // 🔥 Load bookings and attach room name
  loadBookings() {
    this.bookingService.getBookings().subscribe({
      next: (res: any) => {

        this.bookings = res.map((b: any) => {
          const roomId = b.room?._id || b.room;   // <-- IMPORTANT FIX

          const roomObj = this.rooms.find(r => r._id === roomId);

          return {
            ...b,
            roomNumber: roomObj ? roomObj.roomNumber : 'Unknown Room'
          };
        });

        this.loading = false;
      },
      error: err => {
        console.error("Failed to load bookings", err);
        this.loading = false;
      }
    });
  }

  // 🔥 Delete Booking
  deleteBooking(id: string) {
    if (!confirm('Delete booking?')) return;

    this.bookingService.deleteBooking(id).subscribe({
      next: () => this.loadData(),
      error: err => console.error('Delete failed', err)
    });
  }

  // 🔥 Check-In Booking
  checkIn(id: string) {
    if (!confirm("Check in this customer?")) return;

    this.bookingService.checkIn(id).subscribe({
      next: () => this.loadData(),
      error: err => console.error("Check-in error", err)
    });
  }
}
