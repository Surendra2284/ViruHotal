import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { StaffListComponent } from './staff-list/staff-list.component';
import { AddStaffComponent } from './add-staff/add-staff.component';
import { AttendanceComponent } from './attendance/attendance.component';

import { StaffRoutingModule } from './staff-routing.module';

@NgModule({
  declarations: [
    StaffListComponent,
    AddStaffComponent,
    AttendanceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    StaffRoutingModule
  ]
})
export class StaffModule {}
