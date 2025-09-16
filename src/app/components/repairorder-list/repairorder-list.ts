import { Component, inject, Input, OnInit } from '@angular/core';
import { Apiservice } from '../../core/apiservice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RepairOrder } from '../../Models/repair-order';

@Component({
  selector: 'app-repairorder-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './repairorder-list.html',
  styleUrl: './repairorder-list.css',
})
export class RepairorderList implements OnInit {
  repair: any[] = [];
  router = inject(Router);
  repairs = inject(Apiservice);
  rout = inject(Router);
  ngOnInit(): void {
    this.loadRepairOrders();
  }
  loadRepairOrders(): void {
    debugger;
    this.repairs.get<any>('repairs').subscribe({
      next: (res) => {
        this.repair = res || [];
        console.log(this.repair);
      },
      error: (err) => {
        console.error('Failed to load repair orders:', err);
      },
    });
  }

  // RepairOrders component
  viewCustomerOrders(customerId: string) {
    this.router.navigate(['repair-orders/', customerId]);
    console.log(customerId);
  }
  // Edit / Update

  editOrder(order: any) {
    // Navigate to the edit page with the order ID
    this.rout.navigate(['/repair-orders/edit', order._id]);
  }
  // Delete
  deleteOrder(order: any) {
    if (
      !confirm(`Are you sure you want to delete repair order ${order.number}?`)
    )
      return;

    this.repairs.delete(`repairs/${order._id}`).subscribe({
      next: () => {
        alert('Repair order deleted successfully');
        // Remove from local array so UI updates immediately
        this.repair = this.repair.filter((o) => o._id !== order._id);
      },
      error: (err) => {
        console.error('Delete failed:', err);
        alert('Failed to delete repair order.');
      },
    });
  }
}
