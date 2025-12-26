import { Component, OnInit ,OnDestroy } from '@angular/core';
import { RestaurantService } from '../../../services/restaurant.service';
import { RoomService } from '../../../services/rooms.service';
import { BookingService } from '../../../services/booking.service';
import { CustomerService } from '../../../services/customer.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.scss']
})
export class KitchenComponent implements OnInit {
activeTab:
  | 'pending'
  | 'preparing'
  | 'delivered'
  | 'paid'
  | 'cancelled'
  | 'completed'
  | 'all' = 'pending';

  customers: any[] = [];
  allPendingOrders: any[] = [];
  allDeliveredOrders: any[] = [];
  allPreparingOrders: any[] = [];
  allCompletedOrders: any[] = [];
  allPaymentCompletedOrders: any[] = [];
  allCancelledOrders: any[] = [];
  allPaymentFailedOrders: any[] = [];
  pendingOrders: any[] = [];
  deliveredOrders: any[] = [];
  preparingOrders: any[] = [];
  completedOrders: any[] = [];
  cancelledOrders: any[] = [];
  paymentCompletedOrders: any[] = [];
  paymentFailedOrders: any[] = [];  
  rooms: any[] = [];
  bookings: any[] = [];
  loading = true;

  // 📅 FILTER VARIABLES
  filterType: string = 'all';
  startDate: string = '';
  endDate: string = '';
  selectedMonth: string = '';
  newOrdersCount = 0; 
   showToast = false; 
   toastMessage = '';
   private previousOrderCount = 0;
   
private refreshSubscription?: Subscription;
   lastRefreshTime = new Date();
  constructor(
    private restaurantService: RestaurantService,
    private roomService: RoomService,
    private customerService: CustomerService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.loadRooms();
    this.loadCustomers();
    this.startAutoRefresh();
  }

  loadCustomers() {
    this.customerService.getAllCustomers().subscribe((res: any) => {
      this.customers = res;
    });
  }
setTab(tab: any) {
  this.activeTab = tab;
}

  loadRooms() {
    this.roomService.getRooms().subscribe((res: any) => {
      this.rooms = res;
      this.loadBookings();
    });
  }

  loadBookings() {
    this.bookingService.getBookings().subscribe((res: any) => {
      this.bookings = res;
      this.loadOrders();
    });
  }
  private startAutoRefresh(): void {
    // Refresh every 2 minutes (120000 ms)
    this.refreshSubscription = interval(120000).subscribe(() => {
      console.log('🔄 Auto-refreshing kitchen orders...');
      this.loadOrders();
    });

    // Initial refresh after 30 seconds
    setTimeout(() => this.loadOrders(), 30000);
  }

  private stopAutoRefresh(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  /** Load all initial data */
  private async loadInitialData(): Promise<void> {
    this.loading = true;
    await Promise.all([
      this.loadRooms(),
      this.loadCustomers(),
      this.loadBookings()
    ]);
    this.loadOrders();
    this.loading = false;
  }
loadOrders() {
    this.restaurantService.getOrders().subscribe((res: any) => {
      const currentCount = res.length;
      
      // 🔥 Show notification if new orders arrived
      if (currentCount > this.previousOrderCount) {
        this.showNewOrdersNotification(currentCount - this.previousOrderCount);
      }
      this.previousOrderCount = currentCount;
      // Update timestamp (public property)
      this.lastRefreshTime = new Date();
      // ... your existing filter logic ...
      
      this.restaurantService.getOrders().subscribe((res: any) => {
      this.allPendingOrders = res.filter((o: any) => o.status === 'Pending');
      this.allDeliveredOrders = res.filter((o: any) => o.status === 'Delivered');
      this.allPreparingOrders = res.filter((o: any) => o.status === 'Preparing');
      this.allCompletedOrders = res.filter((o: any) => o.status === 'Completed');
      this.allCancelledOrders = res.filter((o: any) => o.status === 'Cancelled');
      this.allPaymentCompletedOrders = res.filter((o: any) => o.status === 'Payment Recived');
      this.allPaymentFailedOrders = res.filter((o: any) => o.status === 'Payment Failed');
      this.applyFilters();
      this.lastRefreshTime = new Date();
      console.log(`✅ Refreshed ${res.length} orders at ${this.lastRefreshTime.toLocaleTimeString()}`);
    });
    });
  }

  showNewOrdersNotification(count: number): void {
    this.newOrdersCount = count;
    this.toastMessage = `${count} new order${count > 1 ? 's' : ''} arrived!`;
    this.showToast = true;
    
    setTimeout(() => {
      this.newOrdersCount = 0;
      this.showToast = false;
    }, 10000);
  }

loadOrders1() {
    this.restaurantService.getOrders().subscribe((res: any) => {
      this.allPendingOrders = res.filter((o: any) => o.status === 'Pending');
      this.allDeliveredOrders = res.filter((o: any) => o.status === 'Delivered');
      this.allPreparingOrders = res.filter((o: any) => o.status === 'Preparing');
      this.allCompletedOrders = res.filter((o: any) => o.status === 'Completed');
      this.allCancelledOrders = res.filter((o: any) => o.status === 'Cancelled');
      this.allPaymentCompletedOrders = res.filter((o: any) => o.status === 'Payment Recived');
      this.allPaymentFailedOrders = res.filter((o: any) => o.status === 'Payment Failed');
      this.applyFilters();
      this.lastRefreshTime = new Date();
      console.log(`✅ Refreshed ${res.length} orders at ${this.lastRefreshTime.toLocaleTimeString()}`);
    });
  }
  getRoomNameFromOrder(order: any) {
    if (order.room) {
      const booking = this.bookings.find(b => b._id === order.room);
      if (booking && booking.room) {
        return `Room ${booking.room.roomNumber} - ${order.customername || 'Hotel Customer'}`;
      }
      return `Room ? - ${order.customername || 'Hotel Customer'}`;
    }

    if (order.customername) {
      return `Direct: ${order.customername}`;
    }

    return 'Unknown Order';
  }
getCustomerAddress(order: any): string {
  // If order already has direct address (optional)
  if (order.customerAddress) {
    return order.customerAddress;
  }

  // Use `customer` ObjectId reference from order
  if (order.customer) {
    const customer = this.customers.find(c => c._id === order.customer);
    if (customer?.address) {
      return customer.address;
    }
  }

  // If order is linked to a room booking and that has a customer with address
  if (order.room) {
    const booking = this.bookings.find(b => b._id === order.room);
    if (booking?.customer?.address) {
      return booking.customer.address;
    }
    if (booking?.room?.roomNumber) {
      return `Room ${booking.room.roomNumber} Guest`;
    }
  }

  // Fallbacks
  if (order.customername) {
    return `${order.customername} (Local Customer)`;
  }

  return 'No address available';
}

  getCustomerNameFromOrder(order: any) {
    if (order.customername) {
      return order.room
        ? `${order.customername} (Room Guest)`
        : `${order.customername}`;
    }
    return 'Unknown Customer';
  }
getCustomerDemand(order: any): string {
    return order.customerdemond || 'No special requests';
  }
  // 🚚 Mark Delivered
  markDelivered(id: string) {
    this.restaurantService.updateOrder(id, { status: 'Delivered' })
      .subscribe({
        next: () => this.loadOrders(),
        error: err => console.error('Delivery error', err)
      });
  }
  markPending(id: string) {
    this.restaurantService.updateOrder(id, { status: 'Pending' })
      .subscribe({
        next: () => this.loadOrders(),
        error: err => console.error('Pending error', err)
      });
  }
  markCompleted(id: string) {
    this.restaurantService.updateOrder(id, { status: 'Completed' })
      .subscribe({
        next: () => this.loadOrders(),
        error: err => console.error('Completed error', err)
      });
  }
markPreparing(id: string) {
    this.restaurantService.updateOrder(id, { status: 'Preparing' })
      .subscribe({
        next: () => this.loadOrders(),
        error: err => console.error('Delivery error', err)
      });
  }
  markCancel(id: string) {
    this.restaurantService.updateOrder(id, { status: 'Cancelled' })
      .subscribe({
        next: () => this.loadOrders(),
        error: err => console.error('Delivery error', err)
      });
  }
  markPaymentPaymentRecived(id: string) {
    this.restaurantService.updateOrder(id, { status: 'Payment Recived' })
      .subscribe({
        next: () => this.loadOrders(),
        error: err => console.error('Delivery error', err)
      });
  }
  // 🗑 DELETE ORDER
  deleteOrder(id: string, type: string) {
    const orderType = type === 'pending' ? 'Pending' : 'Delivered';
    console.log('Deleting order with ID:', id);
    if (confirm(`Are you sure you want to delete this ${orderType} order?`)) {
      this.restaurantService.deleteOrder(id).subscribe({
        next: () => {
          alert('Order deleted successfully!');
          this.loadOrders();
        },
        error: (err: any) => {
          console.error('Delete error:', err);
          alert('Error deleting order');
        }
      });
    }
  }

  // 📅 FILTER LOGIC

  applyFilters() {
    switch (this.filterType) {
      case 'today':
        this.pendingOrders = this.filterByToday(this.allPendingOrders);
        this.deliveredOrders = this.filterByToday(this.allDeliveredOrders);
        this.preparingOrders = this.filterByToday(this.allPreparingOrders);
        this.completedOrders = this.filterByToday(this.allCompletedOrders);
        this.cancelledOrders = this.filterByToday(this.allCancelledOrders);
        this.paymentCompletedOrders = this.filterByToday(this.allPaymentCompletedOrders);
        this.paymentFailedOrders = this.filterByToday(this.allPaymentFailedOrders);
        break;

      case 'monthly':
        this.pendingOrders = this.filterByMonth(this.allPendingOrders, this.selectedMonth);
        this.deliveredOrders = this.filterByMonth(this.allDeliveredOrders, this.selectedMonth);
        this.preparingOrders = this.filterByMonth(this.allPreparingOrders, this.selectedMonth);
        this.completedOrders = this.filterByMonth(this.allCompletedOrders, this.selectedMonth);
        this.cancelledOrders = this.filterByMonth(this.allCancelledOrders, this.selectedMonth);
        this.paymentCompletedOrders = this.filterByMonth(this.allPaymentCompletedOrders, this.selectedMonth);
        this.paymentFailedOrders = this.filterByMonth(this.allPaymentFailedOrders, this.selectedMonth);
        break;

      case 'custom':
        this.pendingOrders = this.filterByDateRange(this.allPendingOrders, this.startDate, this.endDate);
        this.deliveredOrders = this.filterByDateRange(this.allDeliveredOrders, this.startDate, this.endDate);
        this.preparingOrders = this.filterByDateRange(this.allPreparingOrders, this.startDate, this.endDate);
        this.completedOrders = this.filterByDateRange(this.allCompletedOrders, this.startDate, this.endDate);
        this.cancelledOrders = this.filterByDateRange(this.allCancelledOrders, this.startDate, this.endDate);
        this.paymentCompletedOrders = this.filterByDateRange(this.allPaymentCompletedOrders, this.startDate, this.endDate);
        this.paymentFailedOrders = this.filterByDateRange(this.allPaymentFailedOrders, this.startDate, this.endDate);
        break;

      case 'all':
      default:
        this.pendingOrders = this.allPendingOrders;
        this.deliveredOrders = this.allDeliveredOrders;
        this.paymentCompletedOrders = this.allPaymentCompletedOrders;
        this.preparingOrders = this.allPreparingOrders;
        this.completedOrders = this.allCompletedOrders;
        this.cancelledOrders = this.allCancelledOrders;
        this.paymentFailedOrders = this.allPaymentFailedOrders; 
        break;
    }
  }

  filterByToday(orders: any[]): any[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return orders.filter(o => {
      const orderDate = new Date(o.date);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });
  }

  filterByMonth(orders: any[], monthStr: string): any[] {
    if (!monthStr) return orders;

    return orders.filter(o => {
      const orderDate = new Date(o.date);
      const orderMonth = orderDate.getFullYear() + '-' + 
                        String(orderDate.getMonth() + 1).padStart(2, '0');
      return orderMonth === monthStr;
    });
  }

  filterByDateRange(orders: any[], start: string, end: string): any[] {
    if (!start || !end) return orders;

    const startDate = new Date(start);
    const endDate = new Date(end);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    return orders.filter(o => {
      const orderDate = new Date(o.date);
      return orderDate >= startDate && orderDate <= endDate;
    });
  }

  onFilterTypeChange(type: string) {
    this.filterType = type;
    this.applyFilters();
  }

  onDateRangeChange() {
    if (this.filterType === 'custom') {
      this.applyFilters();
    }
  }

  onMonthChange() {
    if (this.filterType === 'monthly') {
      this.applyFilters();
    }
  }
}
