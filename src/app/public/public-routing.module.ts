import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotalPublicComponent } from './hotal-public/hotal-public.component';

const routes: Routes = [
  { path: 'hotel-public', component: HotalPublicComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule {}
