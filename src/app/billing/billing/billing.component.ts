import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BillingService } from '../../../services/billing.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {

  @ViewChild('invoice', { static: false }) invoiceRef!: ElementRef;

  // bill id from route: /billing/:id  (this is Bill._id)
  id = '';

  billType = '';          // "Room" | "Direct"
  customerName = '';
  customerPhone = '';
  roomNumber = '';
  today: Date = new Date();

  roomTotal = 0;
  restaurantTotal = 0;
  gst = 0;
  grandTotal = 0;

  orders: any[] = [];     // if backend returns order lines, else keep []

  constructor(
    private route: ActivatedRoute,
    private billingService: BillingService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if (!this.id) return;

    this.loadBill();
  }

  loadBill() {
  this.billingService.getBillDynamic(this.id).subscribe((res: any) => {
    this.billType = res.billType;
    this.customerName = res.customerName || '';
    this.customerPhone = res.customerPhone || 'N/A';
    this.roomNumber = res.roomNumber || '';

    this.roomTotal = res.roomCost || 0;
    this.restaurantTotal = res.restaurantCost || 0;
    this.gst = res.gst || 0;
    this.grandTotal = res.total || 0;
    this.restaurantTotal = Math.round(
  Number(this.grandTotal) - Number(this.roomTotal) - Number(this.gst)
);
    const rawOrders = res.orders || [];

    // flatten items
    this.orders = rawOrders.flatMap((o: any) =>
      (o.items || []).map((line: any) => ({
        itemId: line.itemId,
        quantity: line.quantity
      }))
    );

    console.log('flattened orders:', this.orders);
  });
}




  // ==========================
  // 🖨 PRINT INVOICE
  // ==========================
  print() {
  if (!this.invoiceRef?.nativeElement) {
    return;
  }

  const printContents = this.invoiceRef.nativeElement.innerHTML;
  const popup = window.open('', '_blank', 'width=900,height=700');

  if (!popup) {
    alert('Popup blocked! Allow popups.');
    return;
  }

  popup.document.open();
  popup.document.write(`
    <html>
      <head>
        <title>Invoice</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1, h2, h3, h4 { margin: 0 0 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #ddd; padding: 8px; }
          th { background: #ff6600; color: white; }
          .total { font-size: 20px; font-weight: bold; text-align: right; margin-top: 20px; }
        </style>
      </head>
      <body>
        ${printContents}
      </body>
    </html>
  `);

  popup.document.close();
  popup.onload = () => {
    popup.focus();
    popup.print();
    popup.close();
  };
}


}
