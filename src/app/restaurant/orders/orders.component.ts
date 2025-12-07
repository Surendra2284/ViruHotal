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
  searchKey = '';
  newCustomerVisible = false;

  newCustomer: any = { name: '', phone: '', email: '', address: '' };

  order: any = {
    room: '',
    customerId: '',   // stores ObjectId
    customer: {       // UI display only
      name: '',
      phone: ''
    },
    customername: '', // string saved in order
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
      this.bookings = Array.isArray(res)
        ? res.filter((b: any) => b.status === 'CheckedIn')
        : [];
    });
  }

  // SEARCH CUSTOMER
  searchCustomer() {
    if (this.searchKey.trim().length < 2) return;
    this.customerService.searchCustomer(this.searchKey).subscribe((res: any) => {
      this.customers = Array.isArray(res) ? res : [];
    });
  }

  // SELECT CUSTOMER (direct visitor)
  selectCustomer(c: any) {
    this.order.customerId = c._id;
    this.order.customer = { name: c.name, phone: c.phone };
    this.order.customername = c.name + c.phone;  // preview / stored
    this.order.room = '';
    this.customers = [];
    this.searchKey = '';
  }

  // POPUP
  openNewCustomer() { this.newCustomerVisible = true; }

  closeNewCustomer() {
    this.newCustomerVisible = false;
    this.newCustomer = { name: '', phone: '', email: '', address: '' };
  }

  // SAVE NEW CUSTOMER
  saveNewCustomer() {
    if (!this.newCustomer.name || !this.newCustomer.phone) {
      alert('Name & Phone required');
      return;
    }

    this.customerService.createCustomer(this.newCustomer).subscribe({
      next: (res: any) => {
        alert('Customer added!');

        this.order.customerId = res.customer._id;
        this.order.customer = {
          name: res.customer.name,
          phone: res.customer.phone
        };

        this.order.customername = res.customer.name + res.customer.phone;
        this.order.room = '';
        this.closeNewCustomer();
      }
    });
  }

  get totalCost() {
    return this.menu.reduce((sum, m) => sum + (m.qty * m.price), 0);
  }

  // PLACE ORDER
  placeOrder() {
    const selected = this.menu.filter(m => m.qty > 0);
    if (!selected.length) return alert('Select items first');

    let room: string | null = this.order.room || null;
    let customerId: string | null = null;
    let customername: string | null = null;

    const roomGuest = this.bookings.find(b => b._id === this.order.room);

    // Case 1: Hotel Guest (room selected)
    if (roomGuest) {
      room = roomGuest._id;                        // booking id
      customerId = roomGuest.customerId || null;   // if stored
      customername = roomGuest.customerName || 'Hotel Customer';
    }

    // Case 2: Direct Customer (no room / not found in bookings)
    if (!roomGuest) {
      if (!this.order.customerId) {
        return alert('Please select/create customer');
      }
      room = null;
      customerId = this.order.customerId;
      customername = this.order.customername;
    }

    if (!room && !customerId) {
      alert('Room or Customer required');
      return;
    }

    const payload = {
      room,          // booking _id or null
      customerId,    // hotel guest or direct customer
      customername,  // from booking.customerName or direct customer
      items: selected.map(m => ({
        itemId: m._id,
        quantity: m.qty
      })),
      total: this.totalCost
    };

    console.log('Final Payload:', payload);

    this.restaurantService.createOrder(payload).subscribe({
      next: () => {
        alert('Order placed successfully!');
        this.router.navigate(['/restaurant/orders']);
      },
      error: err => console.error('Order create error', err)
    });
  }
}
