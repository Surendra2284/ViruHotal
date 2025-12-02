import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../../../services/restaurant.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  items: any[] = [];
  loading = true;

  constructor(
    private restaurantService: RestaurantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems() {
    this.restaurantService.getItems().subscribe({
      next: (res: any) => {
        this.items = res;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        console.error("Error fetching items", err);
      }
    });
  }

  delete(id: string) {
    if (!confirm("Delete this item?")) return;

    this.restaurantService.deleteItem(id).subscribe({
      next: () => this.loadItems(),
      error: err => console.error("Delete error", err)
    });
  }
}
