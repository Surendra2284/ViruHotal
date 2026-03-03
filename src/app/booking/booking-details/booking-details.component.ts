import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { RestaurantService } from '../../../services/restaurant.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.scss']
})
export class BookingDetailsComponent implements OnInit {

  id: string = '';
  booking: any = null;
  bill: any = null;

  orders: any[] = [];

  totalDays = 0;
  roomCost = 0;
  restaurantTotal = 0;
  gst = 0;
  grandTotal = 0;

  loading = true;

  backendURL = environment.apiUrl;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private restaurantService: RestaurantService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.loadDetails();
  }

  // ===============================
  // LOAD BOOKING DETAILS
  // ===============================
  loadDetails() {
    this.loading = true;

    this.bookingService.getBookings().subscribe({
      next: (bookings: any) => {

        const list = Array.isArray(bookings) ? bookings : [];

        this.booking = list.find(b => b._id === this.id);

        if (!this.booking) {
          this.loading = false;
          return;
        }

        // If customer already checked out → load final saved bill
        if (this.booking.status === 'CheckedOut') {
          this.loadBill();
        } else {
          // Otherwise calculate running bill
          this.calculateRunningBill();
        }
      },
      error: (err) => {
        console.error("Booking load error:", err);
        this.loading = false;
      }
    });
  }

  // ===============================
  // LOAD FINAL BILL (FROM BILLING ROUTE)
  // ===============================
  loadBill() {
  this.http
    .get<any>(`${this.backendURL}/billing/booking/${this.id}`)
    .subscribe({
      next: (billData) => {

        this.bill = billData;

        // ✅ Room
        this.roomCost = billData.roomCost || 0;

        // ✅ Use restaurantItems directly from bill
        this.orders = (billData.restaurantItems || []).map((item: any) => ({
          itemName: item.itemName,
          qty: item.quantity,
          price: item.price,
          total: item.subtotal
        }));

        // ✅ Totals from bill
        this.restaurantTotal = billData.restaurantCost || 0;
        this.gst = billData.gst || 0;
        this.grandTotal = billData.total || 0;

        this.loading = false;
      },
      error: (err) => {
        console.error("Bill fetch error:", err);
        this.loading = false;
      }
    });
}

  // ===============================
  // RUNNING BILL (ACTIVE BOOKING)
  // ===============================
  calculateRunningBill() {

    const inDate = new Date(this.booking.checkIn);
    const today = new Date();

    const diff = today.getTime() - inDate.getTime();
    this.totalDays = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));

    // ⚠ Room price not populated in booking (room is ObjectId)
    // So until backend populate is added, set roomCost = 0
    this.roomCost = 0;

    this.loadRestaurantOrders();
  }

  // ===============================
  // LOAD RESTAURANT ORDERS
  // ===============================
  loadRestaurantOrders() {
  this.restaurantService.getOrders().subscribe({
    next: (res: any[]) => {
      console.log('All orders:', res); // Debug
      const bookingOrders = res.filter((o: any) => 
        o.room?._id === this.id || o.room === this.id
      );
      console.log('Filtered orders:', bookingOrders); // Debug
      
      this.orders = bookingOrders.flatMap((o: any) =>
        o.items.map((line: any) => ({
          itemName: line.itemId?.name || 'Unknown',
          qty: line.quantity,
          price: line.itemId?.price || 0,
          total: (line.itemId?.price || 0) * line.quantity
        }))
      );
      
      this.restaurantTotal = this.orders.reduce((sum, o) => sum + o.total, 0);
      this.loading = false; // CRITICAL: Set loading false
    },
    error: (err) => {
      console.error('Orders error:', err);
      this.loading = false;
    }
  });
}}
