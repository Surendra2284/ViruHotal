import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BookingListComponent } from './booking-list/booking-list.component';
import { AddBookingComponent } from './add-booking/add-booking.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { CheckoutComponent } from './checkout/checkout.component';

import { BookingRoutingModule } from './booking-routing.module';

@NgModule({
  declarations: [
    BookingListComponent,
    AddBookingComponent,
    BookingDetailsComponent,
    CheckoutComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BookingRoutingModule
  ]
})
export class BookingModule {}
