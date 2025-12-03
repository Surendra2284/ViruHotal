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
  today = new Date().toISOString().substring(0, 10);

  constructor(
    private route: ActivatedRoute,
    private staffService: StaffService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];this.route.paramMap.subscribe(params => {
  this.id = params.get('id') || params.get('_id') || params.get('staffId') || "";
  console.log("💛 Final resolved ID:", this.id);
});

    this.loadStaff();
  }

  loadStaff() {
  console.log("Loading staff data... id:", this.id);

  const extractId = (val: any) => {
    if (!val) return "";
    if (typeof val === "string") return val.trim();
    if (val.$oid) return val.$oid.trim();
    if (val._id) return val._id.trim();
    return String(val).trim();
  };

  this.staffService.getStaff().subscribe({
    next: (res: any) => {

      console.log("🟢 Staff list received:", res);

      this.staff = res.find((s: any) => {
        console.log("Comparing:", extractId(s._id), "with", extractId(this.id));
        return extractId(s._id) === extractId(this.id);
      });

      console.log("🟣 Matched staff:", this.staff);

      this.loading = false;

      if (!this.staff) {
        alert("Staff not found");
        this.router.navigate(['/staff']);
      }
    },
    error: () => {
      this.loading = false;
      alert("Unable to load staff");
    }
  });
}


  alreadyMarked(): boolean {
    return this.staff?.attendance?.some((a: any) => a.date === this.today);
  }

  mark(status: 'Present' | 'Absent') {

    if (this.alreadyMarked()) {
      alert("Attendance for today is already marked!");
      return;
    }

    const payload = { date: this.today, status };

    this.staffService.markAttendance(this.id, payload).subscribe({
      next: () => {
        alert("Attendance marked successfully");
        this.loadStaff();
      },
      error: err => console.error("Attendance error", err)
    });
  }
}
