import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/reports.service';

@Component({
  selector: 'app-profit-loss',
  templateUrl: './profit-loss.component.html',
  styleUrls: ['./profit-loss.component.scss']
})
export class ProfitLossComponent implements OnInit {

  revenue = 0;
  expenses = 0;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.reportService.getProfitLoss().subscribe((res: any) => {
      this.revenue = res.revenue;
      this.expenses = res.expenses;
    });
  }

  get isProfit() {
    return this.revenue >= this.expenses;
  }

  get value() {
    return Math.abs(this.revenue - this.expenses);
  }
}
