import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Vehicles } from './components/vehicles/vehicles';
import { ServicesComponent } from './components/services-component/services-component';
import { RepairOrders } from './components/repair-orders/repair-orders';
import { authguardGuard } from './core/authguard-guard';
import { Machines } from './components/machines/machines';
import { Customers } from './components/customers/customers';
import { RepairorderList } from './components/repairorder-list/repairorder-list';
import { RepairOrderDetails } from './components/repair-order-details/repair-order-details';
import { Parts } from './components/parts/parts';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'vehicles', component: Vehicles },
  { path: 'machines', component: Machines },
  { path: 'repairList', component: RepairorderList },
  {
    path: 'services',
    component: ServicesComponent,
  },
  {
    path: 'parts',
    component: Parts,
  },

  {
    path: 'repairorders',
    component: RepairOrders,
    //
  },
  {
    path: 'repair-orders/edit/:id',
    component: RepairOrders, // Or your RepairOrderForm component
  },
  { path: 'by-customer/:customerId', component: RepairorderList },
  {
    path: 'customers',
    component: Customers,
    //
  },
  {
    path: 'repair-orders/:id',
    component: RepairOrderDetails,
  },
  { path: '', redirectTo: 'repairorders', pathMatch: 'full' },
  { path: '**', redirectTo: 'repairorders' },
];
