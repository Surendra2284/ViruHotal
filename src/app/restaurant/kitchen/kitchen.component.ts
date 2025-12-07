import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../../../services/restaurant.service';
import { RoomService } from '../../../services/rooms.service';
import { BookingService } from '../../../services/booking.service';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.scss']
})
export class KitchenComponent implements OnInit {

  customers: any[] = [];
  allPendingOrders: any[] = [];
  allDeliveredOrders: any[] = [];
  
  pendingOrders: any[] = [];
  deliveredOrders: any[] = [];
  
  rooms: any[] = [];
  bookings: any[] = [];
  loading = true;

  // 📅 FILTER VARIABLES
  filterType: string = 'all';
  startDate: string = '';
  endDate: string = '';
  selectedMonth: string = '';

  constructor(
    private restaurantService: RestaurantService,
    private roomService: RoomService,
    private customerService: CustomerService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.loadRooms();
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getAllCustomers().subscribe((res: any) => {
      this.customers = res;
    });
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

  loadOrders() {
    this.restaurantService.getOrders().subscribe((res: any) => {
      this.allPendingOrders = res.filter((o: any) => o.status === 'Pending');
      this.allDeliveredOrders = res.filter((o: any) => o.status === 'Delivered');
      
      this.applyFilters();
      this.loading = false;
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

  getCustomerNameFromOrder(order: any) {
    if (order.customername) {
      return order.room
        ? `${order.customername} (Room Guest)`
        : `${order.customername}`;
    }
    return 'Unknown Customer';
  }

  // 🚚 Mark Delivered
  markDelivered(id: string) {
    this.restaurantService.updateOrder(id, { status: 'Delivered' })
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
        break;

      case 'monthly':
        this.pendingOrders = this.filterByMonth(this.allPendingOrders, this.selectedMonth);
        this.deliveredOrders = this.filterByMonth(this.allDeliveredOrders, this.selectedMonth);
        break;

      case 'custom':
        this.pendingOrders = this.filterByDateRange(this.allPendingOrders, this.startDate, this.endDate);
        this.deliveredOrders = this.filterByDateRange(this.allDeliveredOrders, this.startDate, this.endDate);
        break;

      case 'all':
      default:
        this.pendingOrders = this.allPendingOrders;
        this.deliveredOrders = this.allDeliveredOrders;
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
