import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../../services/rooms.service';
import { BookingService } from '../../../services/booking.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-booking',
  templateUrl: './add-booking.component.html',
  styleUrls: ['./add-booking.component.scss']
})
export class AddBookingComponent implements OnInit {

  rooms: any[] = [];
  data: any = {
    customerName: '',
    phone: '',
    aadhar: '',
    address: '',
    room: '',
    checkIn: '',
    checkOut: ''
  };

  error = "";

  constructor(
    private roomService: RoomService,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.roomService.getAvailable().subscribe((res: any) => {
      this.rooms = res;
    });
  }

  saveBooking() {
    if (!this.data.customerName || !this.data.phone || !this.data.room) {
      this.error = "Please fill all required fields!";
      return;
    }

    this.bookingService.createBooking(this.data).subscribe({
      next: () => this.router.navigate(['/booking']),
      error: err => {
        console.error("Error creating booking", err);
        this.error = "Failed to save booking!";
      }
    });
  }
}
