import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/reports.service';

@Component({
  selector: 'app-restaurant-sales',
  templateUrl: './restaurant-sales.component.html',
  styleUrls: ['./restaurant-sales.component.scss']
})
export class RestaurantSalesComponent implements OnInit {

  total = 0;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.reportService.getRestaurantSalesTotal().subscribe((res: any) => {
      this.total = res.total;
    });
  }
}
