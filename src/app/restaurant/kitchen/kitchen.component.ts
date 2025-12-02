import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../../../services/restaurant.service';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.scss']
})
export class KitchenComponent implements OnInit {

  pendingOrders: any[] = [];
  loading = true;

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.restaurantService.getOrders().subscribe((res: any) => {
      this.pendingOrders = res.filter((o: any) => o.status === 'Pending');
      this.loading = false;
    });
  }

  markDelivered(id: string) {
    this.restaurantService.updateOrder(id, { status: 'Delivered' })
      .subscribe({
        next: () => this.loadOrders(),
        error: err => console.error("Delivery error", err)
      });
  }
}
