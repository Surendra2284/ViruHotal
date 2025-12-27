import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../services/booking.service';
import { RoomService } from '../../../services/rooms.service';

@Component({
  selector: 'app-hotal-public',
  templateUrl: './hotal-public.component.html',
  styleUrls: ['./hotal-public.component.css']
})
export class HotalPublicComponent implements OnInit {

  rooms: any[] = [];
  bookings: any[] = [];

  // Public booking form
  data: any = {
    customerName: '',
    phone: '',
    aadhar: '',
    address: '',
    room: '',
    checkIn: '',
    checkOut: ''
  };

  loadingRooms = true;
  loadingBookings = true;
  saving = false;
  error = '';
  success = '';
showStaffLogin = true;


  constructor(
    private bookingService: BookingService,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    this.loadRooms();
    this.loadBookings();
  }
hideStaffLogin() {
  this.showStaffLogin = false;
}

  // -------- LOAD ROOMS --------
  loadRooms(): void {
    this.loadingRooms = true;
    this.roomService.getAvailable().subscribe({
      next: (res: any) => {
        this.rooms = Array.isArray(res) ? res : [];
        this.loadingRooms = false;
      },
      error: err => {
        console.error('Failed to load rooms', err);
        this.error = 'Unable to load rooms at the moment.';
        this.loadingRooms = false;
      }
    });
  }

  // -------- LOAD BOOKINGS --------
  loadBookings(): void {
    this.loadingBookings = true;
    this.bookingService.getBookings().subscribe({
      next: (res: any) => {
        this.bookings = Array.isArray(res) ? res : res ? [res] : [];
        this.loadingBookings = false;
      },
      error: err => {
        console.error('Failed to load bookings', err);
        this.loadingBookings = false;
      }
    });
  }

  // -------- FILTER BOOKINGS FOR THIS PHONE --------
  get myBookingRequests() {
    const phone = this.data.phone.trim();
    if (!phone) return [];

    return this.bookings.filter(b => b.phone === phone);
  }

  // -------- CREATE BOOKING REQUEST --------
  saveBooking(): void {
    this.error = '';
    this.success = '';

    if (!this.data.customerName || !this.data.phone || !this.data.room) {
      this.error = 'Please fill all required fields (Name, Phone, Room).';
      return;
    }

    const payload = {
      customerName: this.data.customerName.trim(),
      phone: this.data.phone.trim(),
      aadhar: this.data.aadhar.trim(),
      address: this.data.address.trim(),
      room: this.data.room,
      checkIn: this.data.checkIn,
      checkOut: this.data.checkOut,
      status: 'Waiting for confirmation' // public request status
    };

    this.saving = true;

    this.bookingService.createBooking(payload).subscribe({
      next: () => {
        this.saving = false;
        this.success = 'Booking request sent! Our staff will confirm it soon.';
        this.loadBookings(); // refresh booking list
        // keep data.phone so that status list works immediately
      },
      error: err => {
        console.error('Error creating booking', err);
        this.saving = false;
        this.error = 'Failed to send booking request. Please try again.';
      }
    });
  }

  // Optional: human-friendly status text
  getStatusLabel(b: any): string {
    const s = (b.status || '').toLowerCase();
    if (s === 'request for booking') return 'Requested (waiting for confirmation)';
    if (s === 'Booking Conformed' || s === 'conform'||s==='Booked') return 'Confirmed';
    if (s === 'checkedin' || s === 'checkin') return 'Checked In';
    if (s === 'checkedout' || s === 'checkout') return 'Checked Out';
    if (s === 'Cancelbooking') return 'Cancelled';
    return b.status || 'Unknown';
  }
}
