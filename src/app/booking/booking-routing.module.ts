import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BookingListComponent } from './booking-list/booking-list.component';
import { AddBookingComponent } from './add-booking/add-booking.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { CheckoutComponent } from './checkout/checkout.component';

const routes: Routes = [
  { path: '', component: BookingListComponent },
  { path: 'add', component: AddBookingComponent },
  { path: 'details/:id', component: BookingDetailsComponent },
  { path: 'checkout/:id', component: CheckoutComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule {}
