// src/app/app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { PublicMenuComponent } from './restaurant/public-menu/public-menu.component';
import { HotalPublicComponent } from './public/hotal-public/hotal-public.component';
import { DashboardComponent } from './reports/dashboard/dashboard.component';
import { HotelPhotoManagerComponent } from './Photo/hotel-photo-manager.component';

import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [

  /* -------------------------------
     DEFAULT PAGE → HOTEL PUBLIC
  -------------------------------- */

  { path: '', redirectTo: 'hotel-public', pathMatch: 'full' },

  /* -------------------------------
     PUBLIC ROUTES
  -------------------------------- */

  { path: 'hotel-public', component: HotalPublicComponent },

  { path: 'menu', component: PublicMenuComponent },

  { path: 'login', loadChildren: () =>
      import('./auth/auth.module').then(m => m.AuthModule)
  },

  /* -------------------------------
     ADMIN ROUTES (PROTECTED)
  -------------------------------- */

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'photo',
    component: HotelPhotoManagerComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'rooms',
    loadChildren: () =>
      import('./rooms/rooms.module').then(m => m.RoomsModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'booking',
    loadChildren: () =>
      import('./booking/booking.module').then(m => m.BookingModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'restaurant',
    loadChildren: () =>
      import('./restaurant/restaurant.module').then(m => m.RestaurantModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'staff',
    loadChildren: () =>
      import('./staff/staff.module').then(m => m.StaffModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'expenses',
    loadChildren: () =>
      import('./expenses/expenses.module').then(m => m.ExpensesModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'reports',
    loadChildren: () =>
      import('./reports/reports.module').then(m => m.ReportsModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'billing',
    loadChildren: () =>
      import('./billing/billing.module').then(m => m.BillingModule),
    canActivate: [AuthGuard]
  },

  /* -------------------------------
     FALLBACK
  -------------------------------- */

  { path: '**', redirectTo: 'hotel-public' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: 'enabled'
    })
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {}