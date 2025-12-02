import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../../../services/restaurant.service';
import { BookingService } from '../../../services/booking.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrderComponent implements OnInit {

  menu: any[] = [];
  bookings: any[] = [];
  order: any = {
    room: "",
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

  /** ✅ FIX: Total Cost Getter */
  get totalCost() {
    return this.menu.reduce((sum: number, m: any) => {
      return sum + (m.qty * m.price);
    }, 0);
  }

  placeOrder() {
    const selected = this.menu.filter(m => m.qty > 0);

    if (selected.length === 0) {
      alert("Please select at least one item");
      return;
    }

    const formatted = selected.map(m => ({
      itemId: m._id,
      quantity: m.qty
    }));

    const total = this.totalCost;

    const payload = {
      room: this.order.room,
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
