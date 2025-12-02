import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/reports.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dailyRevenue = 0;
  restaurantRevenue = 0;
  occupied = 0;
  totalRooms = 0;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadSummary();
    this.loadCharts();
  }

  loadSummary() {
    this.reportService.getSummary().subscribe((res: any) => {
      this.dailyRevenue = res.dailyRevenue;
      this.occupied = res.occupied;
      this.totalRooms = res.totalRooms;
      this.restaurantRevenue = res.restaurantRevenue;
    });
  }

  loadCharts() {
    this.reportService.getDailyRevenue().subscribe((res: any) => {
      new Chart("dailyChart", {
        type: "line",
        data: {
          labels: res.map((x: any) => x.date),
          datasets: [{
            label: "Daily Revenue",
            data: res.map((x: any) => x.total),
          }]
        }
      });
    });

    this.reportService.getRoomOccupancy().subscribe((res: any) => {
      new Chart("roomChart", {
        type: "bar",
        data: {
          labels: ["Occupied", "Available"],
          datasets: [{
            label: "Rooms",
            data: [res.occupied, res.total - res.occupied],
          }]
        }
      });
    });

    this.reportService.getRestaurantSales().subscribe((res: any) => {
      new Chart("restaurantChart", {
        type: "line",
        data: {
          labels: res.map((x: any) => x.date),
          datasets: [{
            label: "Restaurant Sales",
            data: res.map((x: any) => x.total),
          }]
        }
      });
    });
  }
}
