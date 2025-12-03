import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { RestaurantService } from '../../../services/restaurant.service';
import { BillingService } from '../../../services/billing.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {

  @ViewChild('invoice', { static: false }) invoiceRef!: ElementRef;

  id = "";
  booking: any;
  orders: any[] = [];
  items: any[] = [];
  roomTotal = 0;
  restaurantTotal = 0;
  gst = 0;
  grandTotal = 0;
today: Date = new Date();
  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private restaurantService: RestaurantService,
    private billingService: BillingService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.loadBooking();
  }

  loadBooking() {
    this.billingService.getBill(this.id).subscribe((res: any) => {
      this.booking = res.booking;
      this.roomTotal = res.roomCost;
      this.restaurantTotal = res.restaurantCost;
      this.gst = res.gst;
      this.grandTotal = res.total;

      this.loadOrders();
    });
  }

  loadOrders() {
    this.restaurantService.getOrders().subscribe((res: any) => {
      this.orders = res.filter((o: any) => o.room === this.id);
    });
  }

  print() {
    const printContents = this.invoiceRef.nativeElement.innerHTML;
    const popup = window.open('', '_blank', 'width=800,height=600');

    if (popup) {
      popup.document.open();
      popup.document.write(`
        <html>
          <head>
            <title>Invoice</title>
            <style>
              body { font-family: Arial; padding: 20px; }
              h1 { color: #b30000; }
              h3 { color: #cc6600; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border-bottom: 1px solid #ccc; padding: 10px; }
              th { background: #ff6600; color: white; }
              .total { font-size: 22px; margin-top: 25px; font-weight: bold; }
            </style>
          </head>
          <body>${printContents}</body>
        </html>
      `);
      popup.document.close();
      popup.print();
    }
  }
}
