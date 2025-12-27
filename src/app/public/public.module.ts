import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PublicRoutingModule } from './public-routing.module';
import { HotalPublicComponent } from './hotal-public/hotal-public.component';

@NgModule({
  declarations: [
    HotalPublicComponent
  ],
  imports: [
    CommonModule,     // 👈 gives *ngIf, *ngFor, date pipe
    FormsModule,      // 👈 enables [(ngModel)]
    PublicRoutingModule
  ]
})
export class PublicModule {}
