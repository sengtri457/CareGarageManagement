import { Component, OnInit } from '@angular/core';
import { Apiservice } from '../../core/apiservice';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-repair-orders',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './repair-orders.html',
  styleUrls: ['./repair-orders.css'],
})
export class RepairOrders implements OnInit {
  step = 1;

  customers: any[] = [];
  vehicles: any[] = [];
  services: any[] = [];
  parts: any[] = [];
  machines: any[] = [];
  mechanics: any[] = [];

  selectedParts: Record<string, boolean> = {};
  partQty: Record<string, number> = {};
  selectedServices: string[] = [];

  order: any = {
    customerId: null,
    vehicleId: null,
    servicesPerformed: [],
    partsUsed: [],
    machineUsed: null,
    mechanic: null,
    date: new Date(),
    totalCost: 0,
    status: 'open',
    notes: '',
  };

  constructor(private api: Apiservice) {}

  ngOnInit() {
    this.loadCustomers();
    this.loadServices();
    this.loadParts();
    this.loadMachines();
    this.loadMechanics();
  }

  loadCustomers() {
    this.api.get<any>('customers').subscribe((r) => (this.customers = r.data));
  }

  loadServices() {
    this.api.get<any>('services').subscribe((r) => (this.services = r.data));
  }

  loadParts() {
    this.api.get<any>('parts').subscribe((r) => (this.parts = r.data));
  }

  loadMachines() {
    this.api.get<any>('machines').subscribe((r) => (this.machines = r.data));
  }

  loadMechanics() {
    this.api.get<any>('mechanics').subscribe((r) => (this.mechanics = r));
  }

  loadVehicles() {
    if (!this.order.customerId) {
      this.vehicles = [];
      return;
    }
    this.api
      .get<any>(`vehicles?customerId=${this.order.customerId}`)
      .subscribe({
        next: (res) => (this.vehicles = res.data),
        error: (err) => {
          console.error('Failed to load vehicles', err);
          this.vehicles = [];
        },
      });
  }

  nextStep() {
    this.step++;
    this.updateTotals();
  }

  prevStep() {
    this.step--;
    this.updateTotals();
  }

  updateTotals() {
    // services total
    const serviceTotal = this.services
      .filter((s) => this.selectedServices.includes(s.id))
      .reduce((sum, s) => sum + s.price, 0);

    // parts total
    const partsSelected = this.parts.filter((p) => this.selectedParts[p.id]);
    const partsTotal = partsSelected.reduce(
      (sum, p) => sum + p.price * (this.partQty[p.id] || 1),
      0
    );

    this.order.totalCost = serviceTotal + partsTotal;
  }

  submitOrder() {
    // map selected services
    this.order.servicesPerformed = this.services
      .filter((s) => this.selectedServices.includes(s._id))
      .map((s) => ({ serviceId: s._id, price: s.price }));

    // map selected parts
    this.order.partsUsed = this.parts
      .filter((p) => this.selectedParts[p._id])
      .map((p) => ({
        partId: p._id,
        quantity: this.partQty[p._id] || 1,
        pricePerUnit: p.price,
      }));

    // machineUsed and mechanic should already be selected in order.machineUsed and order.mechanic

    this.api.post('repair-orders', this.order).subscribe({
      next: () => {
        alert('Repair order created successfully!');
        this.resetForm();
      },
      error: (err) => console.error('Failed to submit order', err),
    });
  }

  resetForm() {
    this.step = 1;
    this.order = {
      customerId: null,
      vehicleId: null,
      servicesPerformed: [],
      partsUsed: [],
      machineUsed: null,
      mechanic: null,
      date: new Date(),
      totalCost: 0,
      status: 'open',
      notes: '',
    };
    this.selectedParts = {};
    this.partQty = {};
    this.selectedServices = [];
  }
}
