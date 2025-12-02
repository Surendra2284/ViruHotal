import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { RestaurantService } from '../../../services/restaurant.service';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss']
})
export class BookingDetailsComponent implements OnInit {

  id = "";
  booking: any;
  orders: any[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.loadDetails();
  }

  loadDetails() {
    this.bookingService.getBookings().subscribe({
      next: (list: any) => {
        this.booking = list.find((b: any) => b._id === this.id);

        if (this.booking) {
          this.loadOrders();
        }

        this.loading = false;
      },
      error: err => console.error("Load booking error", err)
    });
  }

  restaurantTotal = 0;

loadOrders() {
  this.restaurantService.getOrders().subscribe((res: any) => {
    this.orders = res.filter((o: any) => o.room === this.id);

    this.restaurantTotal = this.orders.reduce(
      (sum: number, o: any) => sum + o.price * o.qty,
      0
    );
  });
}

  checkOut() {
    if (!confirm("Check out this customer?")) return;

    this.bookingService.checkOut(this.id).subscribe({
      next: () => this.loadDetails(),
      error: err => console.error("Check-out error", err)
    });
  }
}
