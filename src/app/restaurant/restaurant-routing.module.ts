import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MenuComponent } from './menu/menu.component';
import { AddItemComponent } from './add-item/add-item.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { OrdersComponent } from './orders/orders.component';
import { KitchenComponent } from './kitchen/kitchen.component';

const routes: Routes = [
  { path: '', component: MenuComponent },
  { path: 'add', component: AddItemComponent },
  { path: 'edit/:id', component: EditItemComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'kitchen', component: KitchenComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestaurantRoutingModule {}
