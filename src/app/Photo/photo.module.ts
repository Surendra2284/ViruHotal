import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from '../auth/auth-routing.module';
@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule
  ]
})
export class PhotoModule {}