import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../../services/expenses.service';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit {

  tab: 'daily' | 'monthly' = 'daily';
  daily: any[] = [];
  monthly: any[] = [];
  loading = true;

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.loadDaily();
    this.loadMonthly();
  }

  loadDaily() {
    this.expenseService.getDaily().subscribe({
      next: (res: any) => {
        this.daily = res;
        this.loading = false;
      },
      error: err => {
        console.error("Error loading daily expenses", err);
        this.loading = false;
      }
    });
  }

  loadMonthly() {
    this.expenseService.getMonthly().subscribe({
      next: (res: any) => {
        this.monthly = res;
      },
      error: err => console.error("Error loading monthly expenses", err)
    });
  }

  changeTab(tab: 'daily' | 'monthly') {
    this.tab = tab;
  }
}
