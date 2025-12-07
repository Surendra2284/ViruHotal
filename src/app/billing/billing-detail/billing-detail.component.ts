import { Component, OnInit } from '@angular/core';
import { BillingService } from '../../../services/billing.service';
import { BookingService } from '../../../services/booking.service'; // Add this service
import { Router } from '@angular/router';

@Component({
  selector: 'app-billing-detail',
  templateUrl: './billing-detail.component.html',
  styleUrls: ['./billing-detail.component.scss']
})
export class BillingDetailComponent implements OnInit {
  // Existing bills
  roomBills: any[] = [];
  directBills: any[] = [];
  filteredRoomBills: any[] = [];
  filteredDirectBills: any[] = [];
bill: any;
  // Billable entries (no bill yet)
  billableEntries: any[] = [];
  filteredBillable: any[] = [];

  fromDate = "";
  toDate = "";
  searchText = "";
  sortType = "";
  tab: 'billable' | 'room' | 'direct' = 'billable';
  page = 1;
  limit = 10;
  totalPages = 1;

  constructor(
    private billingService: BillingService,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData() {
    this.loadBillableEntries();
    this.loadExistingBills();
  }

  // Load entries that NEED bills (CheckedIn bookings + Direct orders w/o bills)
  loadBillableEntries() {
    this.billingService.getBillableEntries().subscribe(entries => {
      this.billableEntries = entries;
      this.filteredBillable = [...this.billableEntries];
      this.calculatePages();
    });
  }

  // Load existing bills
  loadExistingBills() {
    this.billingService.getAllBills().subscribe(bills => {
      this.roomBills = bills.filter(b => b.billType === "Room");
      this.directBills = bills.filter(b => b.billType === "Direct");
      this.filteredRoomBills = [...this.roomBills];
      this.filteredDirectBills = [...this.directBills];
      this.calculatePages();
    });
  }

  // Generate Room Bill
  generateRoomBill(entry: any) {
    const roomCost = prompt('Enter room cost:', '0');
    if (roomCost === null || isNaN(Number(roomCost))) return;

    this.billingService.generateBill(entry.bookingId, Number(roomCost))
      .subscribe({
        next: () => {
          alert('✅ Room bill generated!');
          this.loadAllData(); // Refresh
        },
        error: (err) => alert('❌ ' + (err.error?.message || 'Failed'))
      });
  }

  // Generate Direct Bill
  generateDirectBill(entry: any) {
    this.billingService.generateDirectBill(entry.customerId)
      .subscribe({
        next: () => {
          alert('✅ Direct bill generated!');
          this.loadAllData();
        },
        error: (err) => alert('❌ ' + (err.error?.message || 'Failed'))
      });
  }

 // View existing bill

viewBillable(entry: any) {
  if (entry.type === "Room") {
this.router.navigate(['/billing', entry.bookingId]);
    console.log(entry.bookingId)
    return;
  }
  if (entry.type === "Direct") 
    {
      this.router.navigate(['/billing', entry.customerId]); 
    console.log(entry.customerId)
    return;
  }
}

viewRoomBill(bill: any) {
  // bill.booking is Booking._id → ok for getBillDynamic
  this.router.navigate(['/billing', bill.booking]);
}

viewDirectBill(bill: any) {
console.log(bill.customerId);
  this.router.navigate(['/billing', bill.customerId]);
}

  // Delete bill
  deleteBill(id: string) {
    if (!confirm('Delete this bill?')) return;
    this.billingService.deleteBill(id).subscribe({
      next: () => {
        alert('🗑 Bill deleted');
        this.loadAllData();
      }
    });
  }

  // Filters (applyDateFilter, search, sortBills, etc. - same as before)
  applyDateFilter() {
    if (!(this.fromDate && this.toDate)) return;

    this.filteredRoomBills = this.roomBills.filter(b =>
      new Date(b.date) >= new Date(this.fromDate) &&
      new Date(b.date) <= new Date(this.toDate)
    );

    this.filteredDirectBills = this.directBills.filter(b =>
      new Date(b.date) >= new Date(this.fromDate) &&
      new Date(b.date) <= new Date(this.toDate)
    );
  }

  resetFilter() {
    this.fromDate = "";
    this.toDate = "";
    this.filteredRoomBills = [...this.roomBills];
    this.filteredDirectBills = [...this.directBills];
  }

  filterToday() {
    const today = new Date().toDateString();

    this.filteredRoomBills = this.roomBills.filter(
      b => new Date(b.date).toDateString() === today
    );

    this.filteredDirectBills = this.directBills.filter(
      b => new Date(b.date).toDateString() === today
    );
  }
  // 🔍 Search
  search() {
    const key = this.searchText.toLowerCase();

    this.filteredRoomBills = this.roomBills.filter(b =>
      b.customerName?.toLowerCase().includes(key) ||
      b.roomNumber?.toString().includes(key)
    );

    this.filteredDirectBills = this.directBills.filter(b =>
      b.customerName?.toLowerCase().includes(key) ||
      b.customerPhone?.includes(key)
    );
  }
  // ↕ Sort Bills

  
  sortBills() {
    if (this.sortType === 'high') {
      this.filteredRoomBills.sort((a, b) => b.total - a.total);
      this.filteredDirectBills.sort((a, b) => b.total - a.total);
    }
    if (this.sortType === 'low') {
      this.filteredRoomBills.sort((a, b) => a.total - b.total);
      this.filteredDirectBills.sort((a, b) => a.total - b.total);
    }
    if (this.sortType === 'date') {
      this.filteredRoomBills.sort((a, b) => +new Date(b.date) - +new Date(a.date));
      this.filteredDirectBills.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    }
  }


  getCurrentPage(items: any[]): any[] {
    const start = (this.page - 1) * this.limit;
    return items.slice(start, start + this.limit);
  }

  calculatePages() {
    const length = this.tab === 'billable' ? this.filteredBillable.length :
                   this.tab === 'room' ? this.filteredRoomBills.length :
                   this.filteredDirectBills.length;
    this.totalPages = Math.ceil(length / this.limit);
  }

  nextPage() { if (this.page < this.totalPages) this.page++; }
  prevPage() { if (this.page > 1) this.page--; }

  
}
