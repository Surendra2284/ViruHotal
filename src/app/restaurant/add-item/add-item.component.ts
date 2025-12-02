import { Component } from '@angular/core';
import { RestaurantService } from '../../../services/restaurant.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent {

  data = {
    name: "",
    category: "",
    price: 0,
    available: true
  };

  error = "";

  constructor(
    private restaurantService: RestaurantService,
    private router: Router
  ) {}

  save() {
    if (!this.data.name || !this.data.category || !this.data.price) {
      this.error = "All fields are required!";
      return;
    }

    this.restaurantService.addItem(this.data).subscribe({
      next: () => this.router.navigate(['/restaurant']),
      error: err => {
        console.error("Add item error", err);
        this.error = "Failed to add item!";
      }
    });
  }
}
