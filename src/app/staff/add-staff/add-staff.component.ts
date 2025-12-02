import { Component } from '@angular/core';
import { StaffService } from '../../../services/staff.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-staff',
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.scss']
})
export class AddStaffComponent {

  data = {
    name: "",
    role: "",
    salary: 0
  };

  error = "";

  constructor(
    private staffService: StaffService,
    private router: Router
  ) {}

  save() {
    if (!this.data.name || !this.data.role || !this.data.salary) {
      this.error = "All fields are required!";
      return;
    }

    this.staffService.addStaff(this.data).subscribe({
      next: () => this.router.navigate(['/staff']),
      error: () => this.error = "Failed to save staff member"
    });
  }
}
