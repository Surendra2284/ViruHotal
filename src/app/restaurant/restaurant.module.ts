import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MenuComponent } from './menu/menu.component';
import { AddItemComponent } from './add-item/add-item.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import {OrdersComponent } from './orders/orders.component';
import { KitchenComponent } from './kitchen/kitchen.component';

import { RestaurantRoutingModule } from './restaurant-routing.module';
import { PublicMenuComponent } from './public-menu/public-menu.component';

@NgModule({
  declarations: [
    MenuComponent,
    AddItemComponent,
    EditItemComponent,
    OrdersComponent,
    KitchenComponent,
    PublicMenuComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RestaurantRoutingModule
  ]
})
export class RestaurantModule {}
