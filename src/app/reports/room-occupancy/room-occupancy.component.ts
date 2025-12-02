import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/reports.service';

@Component({
  selector: 'app-room-occupancy',
  templateUrl: './room-occupancy.component.html',
  styleUrls: ['./room-occupancy.component.scss']
})
export class RoomOccupancyComponent implements OnInit {

  occupied = 0;
  totalRooms = 0;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.reportService.getRoomOccupancy().subscribe((res: any) => {
      this.occupied = res.occupied;
      this.totalRooms = res.total;
    });
  }
}
