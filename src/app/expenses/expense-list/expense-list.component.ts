import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ExpenseService } from '../../../services/expenses.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit {

  @ViewChild('pdfExport', { static: false }) pdfExport!: ElementRef;

  tab: 'daily' | 'monthly' = 'daily';
  daily: any[] = [];
  monthly: any[] = [];
  filtered: any[] = [];
  loading = true;
expenses: any[] = [];
  categories = ["All", "Daily", "Monthly", "Hotel", "Restaurant"];
  selectedCategory = "All";

  dailyTotal = 0;
  monthlyTotal = 0;

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    this.loadDaily();
    this.loadMonthly();
  }

  loadDaily(): void {
  this.expenseService.getDailylist().subscribe({
    next: (data) => {
      this.expenses = data; // this is an array, safe for *ngFor
    },
    error: (err) => {
      console.error('Failed to load expenses', err);
    }
  });
}
  loadMonthly() {
    this.expenseService.getMonthlylist().subscribe((res: any) => {
      this.monthly = res;
      this.monthlyTotal = res.reduce((sum: number, x: any) => sum + x.amount, 0);
      this.applyFilter();
    });
  }

  changeTab(tab: 'daily' | 'monthly') {
    this.tab = tab;
    this.applyFilter();
  }

  filterCategory(cat: string) {
    this.selectedCategory = cat;
    this.applyFilter();
  }

  applyFilter() {
    const list = this.tab === 'daily' ? this.daily : this.monthly;

    if (this.selectedCategory === "All") {
      this.filtered = list;
    } else {
      this.filtered = list.filter((x: any) => x.category === this.selectedCategory);
    }
  }

  deleteExpense(id: string) {
    if (!confirm("Delete this expense?")) return;

    this.expenseService.deleteExpense(id).subscribe(() => {
      this.loadDaily();
      this.loadMonthly();
    });
  }

  exportPDF() {
    const element = this.pdfExport.nativeElement;

    html2canvas(element).then((canvas: HTMLCanvasElement) => {
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF('p', 'mm', 'a4');

      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;

      pdf.addImage(img, 'PNG', 0, 0, width, height);
      pdf.save("expenses.pdf");
    });
  }

}
