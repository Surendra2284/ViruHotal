import { Component } from '@angular/core';
import { ExpenseService } from '../../../services/expenses.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss']
})
export class AddExpenseComponent {

  data = {
    title: "",
    amount: 0,
    category: "Daily"
  };

  error = "";

  constructor(
    private expenseService: ExpenseService,
    private router: Router
  ) {}

  save() {
    if (!this.data.title || !this.data.amount) {
      this.error = "All fields are required!";
      return;
    }

    this.expenseService.addExpense(this.data).subscribe({
      next: () => this.router.navigate(['/expenses']),
      error: () => this.error = "Failed to save expense"
    });
  }
}
