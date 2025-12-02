import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ExpenseListComponent } from './expense-list/expense-list.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';

import { ExpensesRoutingModule } from '../expenses/expence-routing.module';

@NgModule({
  declarations: [
    ExpenseListComponent,
    AddExpenseComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ExpensesRoutingModule
  ]
})
export class ExpensesModule {}
