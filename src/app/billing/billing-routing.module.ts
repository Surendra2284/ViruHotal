import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillingComponent } from './billing/billing.component';
import { BillingDetailComponent } from './billing-detail/billing-detail.component';

const routes: Routes = [
  { path: '', component: BillingComponent },              // billing/
  { path: 'detail', component: BillingDetailComponent },  // billing/detail
  { path: ':id', component: BillingComponent }            // billing/:id → view
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingRoutingModule {}
