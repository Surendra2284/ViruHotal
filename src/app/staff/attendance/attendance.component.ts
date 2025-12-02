import { Component, OnInit } from '@angular/core';
import { StaffService } from '../../../services/staff.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit {

  id!: string;
  staff: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private staffService: StaffService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.loadStaff();
  }

  loadStaff() {
    this.staffService.getStaff().subscribe((res: any) => {
      this.staff = res.find((s: any) => s._id === this.id);
      this.loading = false;

      if (!this.staff) {
        alert("Staff not found");
        this.router.navigate(['/staff']);
      }
    });
  }

  mark(status: 'Present' | 'Absent') {
    const today = new Date().toISOString().substring(0, 10);

    const payload = { date: today, status };

    this.staffService.markAttendance(this.id, payload).subscribe({
      next: () => {
        alert("Attendance marked");
        this.loadStaff();
      },
      error: err => console.error("Attendance error", err)
    });
  }
}
