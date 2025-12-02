import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { RestaurantService } from '../../../services/restaurant.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  id = "";
  booking: any;
  orders: any[] = [];
  totalDays = 0;

  roomCost = 0;
  restaurantTotal = 0;
  gst = 0;
  grandTotal = 0;

  loading = true;

  backendURL = "http://localhost:5000";

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private restaurantService: RestaurantService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.loadBooking();
  }

  loadBooking() {
    this.bookingService.getBookings().subscribe((list: any) => {
      this.booking = list.find((b: any) => b._id === this.id);

      if (this.booking) {
        this.calculateDays();
        this.loadOrders();
      }

      this.loading = false;
    });
  }

  calculateDays() {
    const inDate = new Date(this.booking.checkIn);
    const outDate = new Date(this.booking.checkOut);

    const diff = outDate.getTime() - inDate.getTime();
    this.totalDays = Math.ceil(diff / (1000 * 60 * 60 * 24));

    this.roomCost = this.totalDays * this.booking.room.price;
  }

  loadOrders() {
    this.restaurantService.getOrders().subscribe((res: any) => {
      this.orders = res.filter((o: any) => o.room === this.id);

      this.restaurantTotal = this.orders.reduce((sum: number, o: any) => sum + o.total, 0);

      this.calculateFinal();
    });
  }

  calculateFinal() {
    const subtotal = this.roomCost + this.restaurantTotal;
    this.gst = subtotal * 0.18;
    this.grandTotal = subtotal + this.gst;
  }

  confirmCheckout() {
    if (!confirm("Confirm checkout and generate bill?")) return;

    this.http.post(`${this.backendURL}/billing/generate/${this.id}`, {
      roomCost: this.roomCost
    }).subscribe({
      next: () => {
        this.bookingService.checkOut(this.id).subscribe(() => {
          alert("Checkout complete!");
          this.router.navigate(['/billing', this.id]);
        });
      },
      error: err => console.error("Checkout error", err)
    });
  }
}
