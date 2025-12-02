import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StaffListComponent } from './staff-list/staff-list.component';
import { AddStaffComponent } from './add-staff/add-staff.component';
import { AttendanceComponent } from './attendance/attendance.component';

const routes: Routes = [
  { path: '', component: StaffListComponent },
  { path: 'add', component: AddStaffComponent },
  { path: 'attendance', component: AttendanceComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule {}
