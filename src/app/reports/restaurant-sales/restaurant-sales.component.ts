import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/reports.service';

@Component({
  selector: 'app-restaurant-sales',
  templateUrl: './restaurant-sales.component.html',
  styleUrls: ['./restaurant-sales.component.scss']
})
export class RestaurantSalesComponent implements OnInit {

  total = 0;
  todayOrders: any[] = [];
  loading = true;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales() {
    this.reportService.getDailyRestaurantSalesDetails().subscribe({
      next: (res: any) => {
        this.todayOrders = res.orders;
        this.total = this.todayOrders.reduce((sum: number, o: any) => sum + o.total, 0);
        this.loading = false;
      },
      error: err => {
        console.error("Daily sales load error", err);
        this.loading = false;
      }
    });
  }
}
