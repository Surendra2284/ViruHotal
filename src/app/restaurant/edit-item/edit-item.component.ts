import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantService } from '../../../services/restaurant.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit {

  id!: string;
  item: any = {};
  error = "";
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.loadItem();
  }

  loadItem() {
    this.restaurantService.getItems().subscribe((items: any) => {
      this.item = items.find((i: any) => i._id === this.id);
      this.loading = false;

      if (!this.item) {
        this.error = "Item not found";
      }
    });
  }

  save() {
    if (!this.item.name || !this.item.category || !this.item.price) {
      this.error = "All fields are required!";
      return;
    }

    this.restaurantService.updateItem(this.id, this.item).subscribe({
      next: () => this.router.navigate(['/restaurant']),
      error: () => this.error = "Failed to update item"
    });
  }
}
