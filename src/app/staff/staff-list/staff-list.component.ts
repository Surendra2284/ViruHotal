import { Component, OnInit } from '@angular/core';
import { StaffService } from '../../../services/staff.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss']
})
export class StaffListComponent implements OnInit {

  staff: any[] = [];
  loading = true;

  constructor(
    private staffService: StaffService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadStaff();
  }

  loadStaff() {
    this.staffService.getStaff().subscribe({
      next: (res: any) => {
        this.staff = res || [];
        this.loading = false;
      },
      error: err => {
        console.error("Error loading staff", err);
        this.loading = false;
      }
    });
  }

  delete(id: string) {
    if (!confirm("Delete this staff member?")) return;

    this.staffService.deleteStaff(id).subscribe({
      next: () => this.loadStaff(),
      error: err => console.error("Error deleting staff", err)
    });
  }
}
