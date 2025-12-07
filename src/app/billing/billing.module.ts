import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BillingComponent } from './billing/billing.component';
import { BillingDetailComponent } from './billing-detail/billing-detail.component';
import { BillingRoutingModule } from './billing-routing.module';

@NgModule({
  declarations: [
    BillingComponent,
    BillingDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BillingRoutingModule
  ],
  providers: [ DatePipe ]
})
export class BillingModule {}
