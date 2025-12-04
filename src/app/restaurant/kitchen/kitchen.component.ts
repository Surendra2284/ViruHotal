import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../../../services/restaurant.service';
import { RoomService } from '../../../services/rooms.service';
import { BookingService } from '../../../services/booking.service';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.scss']
})
export class KitchenComponent implements OnInit {

  customers: any[] = [];
  pendingOrders: any[] = [];
  deliveredOrders: any[] = [];
  rooms: any[] = [];
  bookings: any[] = [];
  loading = true;

  constructor(
    private restaurantService: RestaurantService,
    private roomService: RoomService,
    private customerService: CustomerService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.loadRooms();
    this.loadCustomers();   // 👈 required
  }

  // 1️⃣ Load all customers
  loadCustomers() {
    this.customerService.getAllCustomers().subscribe((res: any) => {
      this.customers = res;
    });
  }

  // 2️⃣ Load Rooms
  loadRooms() {
    this.roomService.getRooms().subscribe((res: any) => {
      this.rooms = res;
      this.loadBookings();
    });
  }

  // 3️⃣ Load Bookings after Rooms
  loadBookings() {
    this.bookingService.getBookings().subscribe((res: any) => {
      this.bookings = res;
      this.loadOrders();
    });
  }

  // 4️⃣ Load Orders after Bookings
  loadOrders() {
    this.restaurantService.getOrders().subscribe((res: any) => {
      this.pendingOrders = res.filter((o: any) => o.status === 'Pending');
      this.deliveredOrders = res.filter((o: any) => o.status === 'Delivered');
      this.loading = false;
    });
  }

  // ⭐ Resolve Room or Direct Customer
  getRoomNameFromOrder(roomId: string, customerId: string) {

    // 🏨 Hotel guest (booking exists)
    const booking = this.bookings.find(b => b._id === roomId);
    if (booking) {
      const room = this.rooms.find(r => r._id === booking.room);
      return room
        ? `Room ${room.roomNumber} - ${booking.customerName}`
        : `Room ? - ${booking.customerName}`;
    }

    // 🧍 Direct customer (_id stored)
    const cust = this.customers.find(c => c._id === customerId);
    if (cust) return `Direct: ${cust.name} (${cust.phone})`;

    return "Unknown Order";
  }

  // 👤 Customer only
  getCustomerNameFromOrder(roomId: string, customerId: string) {

    // 🏨 hotel guest
    const booking = this.bookings.find(b => b._id === roomId);
    if (booking) return `${booking.customerName} (Room Guest)`;

    // 🧍 direct customer
    const cust = this.customers.find(c => c._id === customerId);
    if (cust) return `${cust.name} (${cust.phone})`;

    return "Unknown Customer";
  }

  // 🚚 Mark Delivered
  markDelivered(id: string) {
    this.restaurantService.updateOrder(id, { status: 'Delivered' })
      .subscribe({
        next: () => this.loadOrders(),
        error: err => console.error("Delivery error", err)
      });
  }
}
