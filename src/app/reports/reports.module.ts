import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard/dashboard.component';
import { RoomOccupancyComponent } from './room-occupancy/room-occupancy.component';
import { RestaurantSalesComponent } from './restaurant-sales/restaurant-sales.component';
import { ProfitLossComponent } from './profit-loss/profit-loss.component';

import { ReportsRoutingModule } from './reports-routing.module';

@NgModule({
  declarations: [
    DashboardComponent,
    RoomOccupancyComponent,
    RestaurantSalesComponent,
    ProfitLossComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReportsRoutingModule
  ]
})
export class ReportsModule {}
