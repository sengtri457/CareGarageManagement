import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Vehicles } from './components/vehicles/vehicles';
import { ServicesComponent } from './components/services-component/services-component';
import { RepairOrders } from './components/repair-orders/repair-orders';
import { authguardGuard } from './core/authguard-guard';
import { Machines } from './components/machines/machines';
import { Customers } from './components/customers/customers';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'vehicles', component: Vehicles },
  { path: 'machines', component: Machines },
  {
    path: 'services',
    component: ServicesComponent,
  },
  {
    path: 'repair-orders',
    component: RepairOrders,
    //
  },
  {
    path: 'customers',
    component: Customers,
    //
  },
  { path: '', redirectTo: 'repair-orders', pathMatch: 'full' },
  { path: '**', redirectTo: 'repair-orders' },
];
