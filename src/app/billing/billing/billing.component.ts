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
  this.billingService.getBillDynamic(this.id).subscribe({
    next: (res: any) => {

      this.billType = res.billType;
      this.customerName = res.customerName || '';
      this.customerPhone = res.customerPhone || 'N/A';
      this.roomNumber = res.roomNumber || '';

      // ✅ Room
      this.roomTotal = Number(res.roomCost) || 0;

      // ✅ Restaurant items directly from bill
      this.orders = (res.restaurantItems || []).map((item: any) => ({
        itemId: item.itemId || null,
        itemName: item.itemName,
        qty: item.quantity,
        price: item.price,
        total: item.subtotal
      }));

      // ✅ Totals (already calculated in backend)
      this.restaurantTotal = Number(res.restaurantCost) || 0;
      this.gst = Number(res.gst) || 0;
      this.grandTotal = Number(res.total) || 0;

      console.log('Loaded bill items:', this.orders);
    },
    error: (err) => {
      console.error("Bill load error:", err);
    }
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
