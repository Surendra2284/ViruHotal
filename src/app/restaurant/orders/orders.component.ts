import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../../../services/restaurant.service';
import { BookingService } from '../../../services/booking.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  menu: any[] = [];
  bookings: any[] = [];
 order: any = {
  room: "",
  customer: {
    name: "",
    phone: "",
  },
  items: [],
  total: 0
};

  constructor(
    private restaurantService: RestaurantService,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMenu();
    this.loadBookings();
  }

  loadMenu() {
    this.restaurantService.getItems().subscribe((res: any) => {
      this.menu = res.map((x: any) => ({ ...x, qty: 0 }));
    });
  }

  loadBookings() {
    this.bookingService.getBookings().subscribe((res: any) => {
      this.bookings = res.filter((b: any) => b.status === 'CheckedIn');
    });
  }
  getRoomNameFromOrder(orderRoomId: string) {
    const booking = this.bookings.find(b => b._id === orderRoomId);
    return booking?.room?.roomNumber || "Unknown Room";
  }

  // 🔍 Get Customer Name
  getCustomerNameFromOrder(orderRoomId: string) {
    const booking = this.bookings.find(b => b._id === orderRoomId);
    return booking?.customerName || "Unknown Customer";
  }
  /** ✅ FIX: Total Cost Getter */
  get totalCost() {
    return this.menu.reduce((sum: number, m: any) => {
      return sum + (m.qty * m.price);
    }, 0);
  }

 placeOrder() {
  const selected = this.menu.filter(m => Number(m.qty) > 0);

  if (selected.length === 0) {
    alert("Please select at least one item");
    return;
  }

  // ✅ If no room is selected, use customer name as "room"
  if (!this.order.room) {
    if (!this.order.customer.name) {
      alert("Please enter customer name");
      return;
    }
    this.order.room = this.order.customer.name;  // 👈 fallback
  }

  const formatted = selected.map(m => ({
    itemId: m._id,
    quantity: m.qty
  }));

  const total = this.totalCost;

  const payload = {
    room: this.order.room,   // always filled now
    customer: this.order.customer,
    items: formatted,
    total
  };

  this.restaurantService.createOrder(payload).subscribe({
    next: () => {
      alert("Order placed!");
      this.router.navigate(['/restaurant/orders']);
    },
    error: err => console.error("Order error", err)
  });
}
}
