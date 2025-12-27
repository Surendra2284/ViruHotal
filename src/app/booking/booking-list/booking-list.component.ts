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

  // Load Rooms FIRST → Then Bookings
  loadData() {
    this.roomService.getRooms().subscribe({
      next: (roomsRes: any) => {
        this.rooms = Array.isArray(roomsRes) ? roomsRes : [];
        this.loadBookings();   // Load bookings after rooms
      },
      error: err => {
        console.error('Failed to load rooms', err);
        this.loading = false;
      }
    });
  }

  // Load bookings and attach room name + normalized status
  loadBookings() {
    this.bookingService.getBookings().subscribe({
      next: (res: any) => {
        const list = Array.isArray(res) ? res : res ? [res] : [];

        this.bookings = list.map((b: any) => {
          const roomId = b.room?._id || b.room;
          const roomObj = this.rooms.find(r => r._id === roomId);

          const rawStatus = (b.status || '').toLowerCase();

          let uiStatus = 'Unknown';
          if (rawStatus === 'request for booking') uiStatus = 'Request for booking';
          else if (rawStatus === 'waiting for confirmation') uiStatus = 'Waiting for confirmation';
          else if (rawStatus === 'conformbooking' || rawStatus === 'confirmed') uiStatus = 'Booked';
          else if (rawStatus === 'booked') uiStatus = 'Booked';
          else if (rawStatus === 'checkedin' || rawStatus === 'checkin') uiStatus = 'CheckedIn';
          else if (rawStatus === 'checkedout' || rawStatus === 'checkout') uiStatus = 'CheckedOut';
          else if (rawStatus === 'cancelled') uiStatus = 'Cancelled';
          else if (rawStatus === 'completed') uiStatus = 'Completed';

          return {
            ...b,
            roomNumber: roomObj ? roomObj.roomNumber : 'Unknown Room',
            status: uiStatus
          };
        });

        this.loading = false;
      },
      error: err => {
        console.error('Failed to load bookings', err);
        this.loading = false;
      }
    });
  }

  // Delete Booking
  deleteBooking(id: string) {
    if (!confirm('Delete booking?')) return;

    this.bookingService.deleteBooking(id).subscribe({
      next: () => this.loadData(),
      error: err => console.error('Delete failed', err)
    });
  }

  // Check-In Booking
  checkIn(id: string) {
    if (!confirm('Check in this customer?')) return;

    this.bookingService.checkIn(id).subscribe({
      next: () => this.loadData(),
      error: err => console.error('Check-in error', err)
    });
  }

  // Confirm Booking
  Conformbooking(id: string) {
    if (!confirm('Confirm booking of customer?')) return;

    this.bookingService.Conformbooking(id).subscribe({
      next: () => this.loadData(),
      error: err => console.error('Confirm Booking error', err)
    });
  }

  // Cancel Booking
  Cancelbooking(id: string) {
    if (!confirm('Cancel booking of customer?')) return;

    this.bookingService.Cancelbooking(id).subscribe({
      next: () => this.loadData(),
      error: err => console.error('Cancel Booking error', err)
    });
  }
}
