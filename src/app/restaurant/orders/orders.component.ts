import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../../../services/restaurant.service';
import { BookingService } from '../../../services/booking.service';
import { CustomerService } from '../../../services/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  menu: any[] = [];
  bookings: any[] = [];
  customers: any[] = [];
  searchKey = "";
  newCustomerVisible = false;

  newCustomer: any = { name: "", phone: "", email: "", address: "" };

  // 🔥 IMPORTANT FIX
  order: any = {
    room: "",
    customerId: "",   // MUST exist separately
    customer: {       // UI display only
      name: "",
      phone: ""
    },
    items: [],
    total: 0
  };

  constructor(
    private restaurantService: RestaurantService,
    private bookingService: BookingService,
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMenu();
    this.loadBookings();
  }

  loadMenu() {
    this.restaurantService.getItems().subscribe((res: any) => {
      this.menu = Array.isArray(res) ? res.map((x: any) => ({ ...x, qty: 0 })) : [];
    });
  }

  loadBookings() {
    this.bookingService.getBookings().subscribe((res: any) => {
      this.bookings = Array.isArray(res) ? res.filter((b: any) => b.status === 'CheckedIn') : [];
    });
  }

  // 🔍 SEARCH CUSTOMER
  searchCustomer() {
    if (this.searchKey.trim().length < 2) return;
    this.customerService.searchCustomer(this.searchKey).subscribe((res: any) => {
      this.customers = Array.isArray(res) ? res : [];
    });
  }

  // ✔ SELECT CUSTOMER (store ObjectId only, show name-phone separately)
  selectCustomer(c: any) {
    this.order.customerId = c._id;
    this.order.customer = { name: c.name, phone: c.phone };  // preview only
    this.order.room = "";
    this.customers = [];
    this.searchKey = "";
  }

  // ➕ POPUP
  openNewCustomer() { this.newCustomerVisible = true; }
  closeNewCustomer() {
    this.newCustomerVisible = false;
    this.newCustomer = { name: "", phone: "", email: "", address: "" };
  }

  // 💾 SAVE NEW CUSTOMER
  saveNewCustomer() {
    if (!this.newCustomer.name || !this.newCustomer.phone) {
      alert("Name & Phone required");
      return;
    }

    this.customerService.createCustomer(this.newCustomer).subscribe({
      next: (res: any) => {
        alert("Customer added!");

        // store ID correctly
        this.order.customerId = res.customer._id;

        // preview on UI
        this.order.customer = {
          name: res.customer.name,
          phone: res.customer.phone
        };

        this.order.room = "";
        this.closeNewCustomer();
      }
    });
  }

  get totalCost() {
    return this.menu.reduce((sum, m) => sum + (m.qty * m.price), 0);
  }

  // 🚀 PLACE ORDER (final correct)
  placeOrder() {
  const selected = this.menu.filter(m => m.qty > 0);
  if (!selected.length) return alert("Select items first");

  let room = this.order.room;
  let customerId = null;

  const roomGuest = this.bookings.find(b => b._id === this.order.room);

  // 🏨 Case 1: Hotel Guest
  if (roomGuest) {
    room = roomGuest._id;
    customerId = roomGuest.customerId || null; // if populated
  }

  // 🧍 Case 2: Direct Customer
  if (!roomGuest) {
    if (!this.order.customerId) return alert("Please select/create customer");
    room = null;
    customerId = this.order.customerId; // direct visitor
  }

  // final safety
  if (!room && !customerId) {
    alert("Room or Customer required");
    return;
  }

  const payload = {
    room,
    customerId,   // ✔ correct backend name
    items: selected.map(m => ({
      itemId: m._id,
      quantity: m.qty
    })),
    total: this.totalCost
  };

  console.log("Final Payload:", payload);

  this.restaurantService.createOrder(payload).subscribe({
    next: () => {
      alert("Order placed successfully!");
      this.router.navigate(['/restaurant/orders']);
    },
    error: err => console.error("Order create error", err)
  });
}

}
