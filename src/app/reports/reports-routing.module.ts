import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { RoomOccupancyComponent } from './room-occupancy/room-occupancy.component';
import { RestaurantSalesComponent } from './restaurant-sales/restaurant-sales.component';
import { ProfitLossComponent } from './profit-loss/profit-loss.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'room-occupancy', component: RoomOccupancyComponent },
  { path: 'restaurant-sales', component: RestaurantSalesComponent },
  { path: 'profit-loss', component: ProfitLossComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule {}
