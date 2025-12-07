import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BillingDetailComponent } from './billing-detail/billing-detail.component';

const routes: Routes = [
  {
    path: 'billing-detailAll/:id',
    component: BillingDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingDetailRoutingModule {}
