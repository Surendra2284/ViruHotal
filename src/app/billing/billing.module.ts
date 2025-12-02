import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BillingComponent } from './billing/billing.component';
import { BillingRoutingModule } from './billing-routing.module';

@NgModule({
  declarations: [BillingComponent],
  imports: [
    CommonModule,
    FormsModule,
    BillingRoutingModule
  ]
})
export class BillingModule {}
