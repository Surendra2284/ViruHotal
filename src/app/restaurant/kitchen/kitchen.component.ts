import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../../../services/restaurant.service';
import { RoomService } from '../../../services/rooms.service';
import { BookingService } from '../../../services/booking.service';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.scss']
})
export class KitchenComponent implements OnInit {

  pendingOrders: any[] = [];
  loading = true;
  rooms: any[] = [];
  bookings: any[] = [];

  constructor(
    private restaurantService: RestaurantService,
    private roomService: RoomService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  // STEP 1 → Load Rooms First
  loadRooms() {
    this.roomService.getRooms().subscribe((res: any) => {
      this.rooms = res;
      this.loadBookings();
    });
  }

  // STEP 2 → Load Bookings After Rooms
  loadBookings() {
    this.bookingService.getBookings().subscribe((res: any) => {
      this.bookings = res; // keep all bookings
      this.loadOrders();
    });
  }

  // STEP 3 → Load Orders After Bookings
  loadOrders() {
    this.restaurantService.getOrders().subscribe((res: any) => {
      this.pendingOrders = res.filter((o: any) => o.status === 'Pending');
      this.loading = false;
    });
  }

  // 🔍 GET ROOM NAME (from Booking → Room)
  getRoomNameFromOrder(orderBookingId: string) {
    const booking = this.bookings.find(b => b._id === orderBookingId);

    if (!booking) return "Unknown Room";

    // booking.room contains roomID
    const room = this.rooms.find(r => r._id === booking.room);

    return room ? room.roomNumber : "Unknown Room";
  }

  // 🔍 GET CUSTOMER NAME
  getCustomerNameFromOrder(orderBookingId: string) {
    const booking = this.bookings.find(b => b._id === orderBookingId);
    return booking?.customerName || "Unknown Customer";
  }

  // MARK DELIVERED
  markDelivered(id: string) {
    this.restaurantService.updateOrder(id, { status: 'Delivered' })
      .subscribe({
        next: () => this.loadOrders(),
        error: err => console.error("Delivery error", err)
      });
  }
}
