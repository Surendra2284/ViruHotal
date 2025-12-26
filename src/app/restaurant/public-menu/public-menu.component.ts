import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../../../services/restaurant.service';
import { CustomerService } from '../../../services/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-public-menu',
  templateUrl: './public-menu.component.html',
  styleUrls: ['./public-menu.component.css']
})
export class PublicMenuComponent implements OnInit {

  menu: any[] = [];
  myOrders: any[] = [];

  // customer fields
  customerId: string | null = null;    // Customer _id from DB
  customerName = '';                   // name (existing or new)
  customerPhone = '';                  // unique mobile
  customerAddress = ''; 
  customerFound = false;               // true when existing customer loaded
  searching = false;

  order: any = {
    specialInstructions: ''            // maps to customerdemond
  };

  estimatedDeliveryTime = 25;          // minutes

  constructor(
    private restaurantService: RestaurantService,
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMenu();
    this.loadMyOrders();
  }

  // ============ DATA LOADING ============

  loadMenu() {
    this.restaurantService.getItems().subscribe((res: any) => {
      this.menu = Array.isArray(res)
        ? res.map((x: any) => ({ ...x, qty: 0 }))
        : [];
    });
  }

  loadMyOrders() {
    this.restaurantService.getOrders().subscribe((res: any) => {
      this.myOrders = Array.isArray(res) ? res : [];
    });
  }

  // ============ CALC / QTY ============

  get totalCost() {
    return this.menu.reduce((sum, m) => sum + (m.qty * m.price), 0);
  }

  updateQty(item: any, delta: number) {
    item.qty = Math.max(0, (item.qty || 0) + delta);
  }

  // ============ CUSTOMER SEARCH / CREATE ============

  searchByPhone() {
    this.customerFound = false;
    this.customerId = null;
    this.customerName = '';
    this.customerAddress = '';
    const key = this.customerPhone.trim();
    if (!key) {
      alert('Enter mobile number');
      return;
    }

    this.searching = true;
    this.customerService.searchCustomer(key).subscribe({
      next: (res: any) => {
        this.searching = false;
        const list = Array.isArray(res) ? res : [];
        const existing = list.find(c => c.phone === key);

        if (existing) {
          this.customerFound = true;
          this.customerId = existing._id;
          this.customerName = existing.name;
          this.customerAddress = existing.address || '';
          this.loadMyOrders();
        } else {
          this.customerFound = false;
          this.customerId = null;
          this.customerName = '';
          this.customerAddress = '';
          alert('No customer found with this Mobile No. You can create a new one.');  
        }
      },
      error: err => {
        this.searching = false;
        console.error('Search error', err);
        alert('Unable to search customer');
      }
    });
  }

  createCustomerIfNeeded(): Promise<void> {
    return new Promise((resolve, reject) => {
      // already existing
      if (this.customerFound && this.customerId) {
        return resolve();
      }

      // need name to create
      if (!this.customerName.trim()) {
        alert('Enter name to create new customer');
        return reject('name-required');
      }

      const data = {
        name: this.customerName.trim(),
        phone: this.customerPhone.trim(),
        email: '',
        address: this.customerAddress.trim()
      };

      this.customerService.createCustomer(data).subscribe({
        next: (res: any) => {
          const c = res.customer || res;
          this.customerId = c._id;
          this.customerFound = true;
          this.customerName = c.name;
          resolve();
        },
        error: err => {
          console.error('Create customer error', err);
          alert('Unable to create customer');
          reject(err);
        }
      });
    });
  }

  // ============ PLACE ORDER (PUBLIC) ============

  async placeOrder() {
    const selected = this.menu.filter(m => m.qty > 0);
    if (!selected.length) {
      alert('Select items first');
      return;
    }

    if (!this.customerPhone.trim()) {
      alert('Enter mobile number');
      return;
    }

    try {
      await this.createCustomerIfNeeded();
    } catch {
      return;
    }

    const payload = {
  room: null,
  customerId: this.customerId,          // ✅ match controller
  customername: this.customerName,
  customerdemond: this.order.specialInstructions || '',
  items: selected.map(m => ({
    itemId: m._id,
    quantity: m.qty
  })),
  total: this.totalCost
};

 console.log('Final Payload:', payload);
    this.restaurantService.createOrder(payload).subscribe({
      next: () => {
        alert(
          'Order placed successfully! Expected delivery: ' +
          this.estimatedDeliveryTime + ' mins'
        );
        this.resetOrder();
        this.loadMyOrders();
      },
      error: err => {
        console.error('Order create error', err);
        alert('Order failed. Please try again.');
      }
    });
  }

  // ============ CANCEL ORDER (BY PHONE) ============

  cancelOrder(orderId: string) {
    if (!confirm('Cancel this order?')) return;
    if (!this.customerPhone.trim()) {
      alert('Enter your phone to cancel orders');
      return;
    }

    this.restaurantService.updateOrder(orderId, {
      status: 'Cancelled',
      cancellationReason: 'Customer cancelled',
      cancelledByPhone: this.customerPhone.trim()
    }).subscribe({
      next: () => {
        alert('Order cancelled');
        this.loadMyOrders();
      },
      error: err => {
        console.error('Cancel error', err);
        alert('Cancellation failed');
      }
    });
  }

  // ============ FILTER MY ORDERS ============

  getCustomerOrders() {
    if (!this.customerPhone.trim()) return [];
    return this.myOrders.filter(o =>
      o.customer &&
      o.customer.phone === this.customerPhone.trim() &&
      ['Pending', 'Preparing','delivered','cancelled','delivered','completed','paid'].includes(o.status)
    );
  }




  resetOrder() {
    this.menu.forEach(m => m.qty = 0);
    // keep phone so they can still see orders
    this.customerName = '';
    this.customerId = null;
    this.customerFound = false;
    this.order.specialInstructions = '';
  }
}
