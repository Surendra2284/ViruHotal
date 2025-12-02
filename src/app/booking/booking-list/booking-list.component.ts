import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../services/booking.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss']
})
export class BookingListComponent implements OnInit {

  bookings: any[] = [];
  loading = true;

  constructor(
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings() {
    this.bookingService.getBookings().subscribe({
      next: (res: any) => {
        this.bookings = res;
        this.loading = false;
      },
      error: err => {
        console.error("Failed to load bookings", err);
        this.loading = false;
      }
    });
  }
deleteBooking(id: string) {
    if (!confirm('Delete booking?')) return;

    this.bookingService.deleteBooking(id).subscribe({
      next: () => this.loadBookings(),
      error: (err) => console.error('Delete failed', err)
    });
  }
  checkIn(id: string) {
    if (!confirm("Check in this customer?")) return;

    this.bookingService.checkIn(id).subscribe({
      next: () => this.loadBookings(),
      error: err => console.error("Check-in error", err)
    });
  }
}
