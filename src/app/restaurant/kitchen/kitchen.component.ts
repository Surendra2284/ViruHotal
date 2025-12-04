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
  deliveredOrders: any[] = [];   // 👈 NEW
  loading = true;
  rooms: any[] = [];
  bookings: any[] = [];
newCustomer: any = { name: "", phone: "", email: "", address: "" };
  constructor(
    private restaurantService: RestaurantService,
    private roomService: RoomService,
    private customerService: CustomerService,
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
      this.deliveredOrders = res.filter((o: any) => o.status === 'Delivered'); // 👈 NEW
      this.loading = false;
    });
  }

  // 🔍 GET ROOM NAME (from Booking → Room)
  // ⭐ GET ROOM OR DIRECT CUSTOMER
getRoomNameFromOrder(orderRoomId: string) {

  // 1️⃣ If booking exists (room guest)
  const booking = this.bookings.find(b => b._id === orderRoomId);
  if (booking) {
    const room = this.rooms.find(r => r._id === booking.room);
    return room
      ? `Room ${room.roomNumber} - ${booking.customerName}`
      : `Room ? - ${booking.customerName}`;
  }

  // 2️⃣ Direct customer: orderRoomId = customer _id
  const cust = this.customers.find(c => c._id === orderRoomId);
  if (cust) {
    return `Direct: ${cust.name} (${cust.phone})`;
  }

  return "Unknown Order";
}


  // 🔍 GET CUSTOMER NAME
  getCustomerNameFromOrder(orderRoomId: string) {

  // 1️⃣ Room guest
  const booking = this.bookings.find(b => b._id === orderRoomId);
  if (booking) return booking.customerName;

  // 2️⃣ Direct customer by _id (NOT phone)
  const cust = this.customers.find(c => c._id === orderRoomId);
  if (cust) return `${cust.name} (${cust.phone})`;

  return "Unknown Customer";
}


  // MARK DELIVERED
  markDelivered(id: string) {
    this.restaurantService.updateOrder(id, { status: 'Delivered' })
      .subscribe({
        next: () => this.loadOrders(), // reload both pending + delivered
        error: err => console.error("Delivery error", err)
      });
  }
}