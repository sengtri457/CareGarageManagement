import { Datatable } from './../../shared/datatable/datatable';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Apiservice } from '../../core/apiservice';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, forkJoin, catchError, of, map } from 'rxjs';
import { RepairorderList } from '../repairorder-list/repairorder-list';
import { ActivatedRoute, Router } from '@angular/router';

// Type definitions
interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
}

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  licensePlate?: string;
  customerId: string;
}

interface Service {
  _id: string;
  name: string;
  description?: string;
  basePrice: number;
  category?: string;
}

interface Part {
  _id: string;
  name: string;
  sku: string;
  unitPrice: number;
  unit: string;
  availableQty: number;
  qtyStock?: number;
  location: string;
  batchNo?: string;
}

interface Mechanic {
  _id: string;
  firstName: string;
  lastName: string;
  specialization?: string;
  hourlyRate?: number;
}
interface MachineSnapshot {
  name: string;
  serialNo: string;
  type: string;
  lastServiceAt?: string | Date;
  active: boolean;
}
interface MechanicSnapshot {
  firstName: string;
  lastName: string;
  specialization?: string;
  hourlyRate?: number;
}
interface RepairOrder {
  customerId: string | null;
  vehicleId: string | null;
  servicesPerformed: ServicePerformed[];
  partsUsed: PartUsed[];
  machineUsed: string | null;
  machineSnapshot?: MachineSnapshot;
  mechanicSnapshot?: MechanicSnapshot;
  mechanicId: string | null;
  date: Date;
  totalCost: number;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  notes: string;
  // Add this:
  customerSnapshot?: {
    name: string;
    phone?: string;
    email?: string;
  };
}

interface ServicePerformed {
  serviceId: string;
  price?: number;
  basePrice?: number;
}

interface PartUsed {
  partId: string;
  quantity: number;
  pricePerUnit: number;
  location: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}
interface Machine {
  _id: string;
  name: string;
  serialNo: string;
  type: string;
  lastServiceAt: string; // or Date
  active: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

@Component({
  selector: 'app-repair-orders',
  standalone: true,
  imports: [FormsModule, CommonModule, RepairorderList],
  templateUrl: './repair-orders.html',
  styleUrls: ['./repair-orders.css'],
})
export class RepairOrders implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Step management
  step = 1;
  readonly MAX_STEPS = 5;

  // Loading states
  loading = {
    customers: false,
    vehicles: false,
    services: false,
    parts: false,
    mechanics: false,
    submitting: false,
    machines: false,
  };

  // Data arrays
  customers: Customer[] = [];
  vehicles: Vehicle[] = [];
  services: Service[] = [];
  parts: Part[] = [];
  prtInvern: Part[] = [];
  machines: Machine[] = [];
  mechanics: Mechanic[] = [];
  // Selection states
  selectedMechanicId: string | null = null;
  selectedParts: Record<string, boolean> = {};
  partQty: Record<string, number> = {};
  selectedServices: string[] = [];
  SelctedMachines: string[] = [];
  selectedMachineId: string | null = null;
  // Main order object
  order: RepairOrder = this.createEmptyOrder();

  // Computed properties
  get selectedCustomer(): Customer | null {
    return this.customers.find((c) => c._id === this.order.customerId) || null;
  }
  get selectedMechanic(): Mechanic | null {
    return (
      this.mechanics.find((me) => me._id === this.order.mechanicId) || null
    );
  }
  get selectedVehicle(): Vehicle | null {
    return this.vehicles.find((v) => v._id === this.order.vehicleId) || null;
  }

  get selectedServicesList(): Service[] {
    return this.services.filter((s) => this.selectedServices.includes(s._id));
  }

  get selectedPartsList(): Part[] {
    return this.prtInvern.filter((p: any) => this.selectedParts[p._id]);
  }
  isMachineSelected(machineId: string): boolean {
    return this.selectedMachineId === machineId;
  }

  getMachineLoard() {
    this.api.get<any>('machines').subscribe((data) => {
      this.machines = data;
      console.log(
        this.machines.map((data) => {
          return data._id;
        })
      );
    });
  }

  onMachineSelect(machineId: string): void {
    this.selectedMachineId = machineId;
    this.order.machineUsed = machineId;

    const selected = this.machines.find((m) => m._id === machineId);
    this.order.machineSnapshot = selected
      ? {
          name: selected.name,
          serialNo: selected.serialNo,
          type: selected.type,
          lastServiceAt: selected.lastServiceAt,
          active: selected.active,
        }
      : undefined;
  }
  onMechanicSelect(mechanicId: string): void {
    this.selectedMechanicId = mechanicId;
    this.order.mechanicId = mechanicId;

    const selected = this.mechanics.find((me) => me._id === mechanicId);
    this.order.mechanicSnapshot = selected
      ? {
          firstName: selected.firstName, // typo fix ✅
          lastName: selected.lastName,
          specialization: selected.specialization,
          hourlyRate: selected.hourlyRate,
        }
      : undefined;
  }

  get selectedMachine(): Machine | null {
    return this.machines.find((m) => m._id === this.order.machineUsed) || null;
  }
  get canProceedToNextStep(): boolean {
    switch (this.step) {
      case 1:
        return !!this.order.customerId;
      case 2:
        return true;
      case 3:
        return true; // Parts are optional
      case 4:
        return true; // Review step
      default:
        return false;
    }
  }

  get isFormValid(): boolean {
    return !!(
      this.order.customerId &&
      this.order.vehicleId &&
      this.selectedServices.length > 0
    );
  }

  constructor(private api: Apiservice, private route: ActivatedRoute) {
    console.log(this.getPartsTotal(), this.getServiceTotal());
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.getPartInv();
    this.getMachineLoard();
    console.log(this.selectedMachine);
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      // We're in edit mode
      this.api.get<any>(`repairs/${orderId}`).subscribe({
        next: (order) => {
          this.order = order;
          this.selectedServices = order.servicesPerformed.map(
            (s: any) => s.serviceId._id
          );
          this.selectedParts = {};
          order.partsUsed.forEach((p: any) => {
            this.selectedParts[p.partId._id] = true;
            this.partQty[p.partId._id] = p.quantity;
          });
          this.selectedMachineId = order.machineUsed;
          this.selectedMechanicId = order.mechanicId;
        },
      });
    }
  }
  initializePartQty() {
    this.prtInvern.forEach((p) => {
      if (!this.partQty[p._id]) this.partQty[p._id] = 1;
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createEmptyOrder(): RepairOrder {
    return {
      customerId: null,
      vehicleId: null,
      servicesPerformed: [],
      partsUsed: [],
      machineUsed: null,
      mechanicId: null,
      date: new Date(),
      totalCost: 0,
      status: 'open',
      notes: '',
    };
  }

  getPartInv() {
    this.api.get<any>('parts').subscribe((data) => {
      this.prtInvern = data.data;
      console.log(this.prtInvern);
    });
  }

  // ---------------- Data Loaders ----------------
  private loadInitialData(): void {
    this.loading.customers = true;
    this.loading.services = true;
    this.loading.parts = true;
    this.loading.mechanics = true;
    this.loading.machines = true;

    forkJoin({
      customers: this.loadCustomers(),
      services: this.loadServices(),
      mechanics: this.loadMechanics(),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results) => {
          this.customers = results.customers;
          this.services = results.services;
          // this.parts = results.parts;
          this.mechanics = results.mechanics;
          this.initializePartQty();
          this.updateTotals();
        },
        error: (error) => {
          console.error('Error loading initial data:', error);
          // Handle error appropriately - maybe show a toast notification
        },
        complete: () => {
          this.loading.customers = false;
          this.loading.services = false;
          this.loading.parts = false;
          this.loading.mechanics = false;
        },
      });
  }
  private loadCustomers() {
    return this.api
      .get<ApiResponse<Customer[]>>('customers')
      .pipe(
        catchError((err) => {
          console.error('Failed to load customers:', err);
          return of({ success: false, data: [] as Customer[] });
        })
      )
      .pipe(
        takeUntil(this.destroy$),
        // Extract data from response
        map((res) => res.data || [])
      );
  }

  private loadServices() {
    return this.api
      .get<ApiResponse<Service[]>>('services')
      .pipe(
        catchError((err) => {
          console.error('Failed to load services:', err);
          return of({ success: false, data: [] as Service[] });
        })
      )
      .pipe(
        takeUntil(this.destroy$),
        map((res) => res.data || [])
      );
  }
  private loadMechanics() {
    return this.api
      .get<Mechanic[]>('mechanics')
      .pipe(
        catchError((err) => {
          console.error('Failed to load mechanics:', err);
          return of([] as Mechanic[]);
        })
      )
      .pipe(takeUntil(this.destroy$));
  }

  loadVehicles(): void {
    if (!this.order.customerId) {
      this.vehicles = [];
      return;
    }

    this.loading.vehicles = true;
    this.api
      .get<ApiResponse<Vehicle[]>>(
        `vehicles?customerId=${this.order.customerId}`
      )
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          console.error('Failed to load vehicles:', err);
          return of({ success: false, data: [] as Vehicle[] });
        })
      )
      .subscribe({
        next: (res) => {
          this.vehicles = res.data || [];
          // Reset vehicle selection if current selection is not available
          if (
            this.order.vehicleId &&
            !this.vehicles.find((v) => v._id === this.order.vehicleId)
          ) {
            this.order.vehicleId = null;
          }
        },
        complete: () => {
          this.loading.vehicles = false;
        },
      });
  }

  // ---------------- Event Handlers ----------------
  onCustomerChange(): void {
    this.order.vehicleId = null; // Reset vehicle when customer changes
    this.loadVehicles();
    this.updateTotals();
  }

  onServiceToggle(serviceId: string): void {
    const index = this.selectedServices.indexOf(serviceId);
    if (index > -1) {
      this.selectedServices.splice(index, 1);
    } else {
      this.selectedServices.push(serviceId);
    }
    this.updateTotals();
  }

  onPartToggle(partId: string): void {
    if (this.selectedParts[partId]) {
      delete this.selectedParts[partId];
      delete this.partQty[partId];
    } else {
      this.selectedParts[partId] = true;
      this.partQty[partId] = 1;
    }
    this.updateTotals();
  }

  // ---------------- Navigation ----------------
  nextStep(): void {
    if (this.canProceedToNextStep && this.step < this.MAX_STEPS) {
      this.step++;
      this.updateTotals();
    }
  }

  prevStep(): void {
    if (this.step > 1) {
      this.step--;
      this.updateTotals();
    }
  }

  goToStep(stepNumber: number): void {
    if (stepNumber >= 1 && stepNumber <= this.MAX_STEPS) {
      this.step = stepNumber;
      this.updateTotals();
    }
  }
  onPartQtyChange(partId: string) {
    const part = this.prtInvern.find((p) => p._id === partId);
    if (!part) return;

    let qty = Number(this.partQty[partId] || 1);

    if (qty > part.availableQty) qty = part.availableQty;
    if (qty < 1) qty = 1;

    this.partQty[partId] = qty; // ensure stored as number
    this.updateTotals();
  }

  // Calculate total cost (optional)
  updateTotals() {
    // Example: sum of parts and services
    const partsTotal = Object.entries(this.partQty).reduce(
      (sum, [partId, qty]) => {
        const part = this.prtInvern.find((p) => p._id === partId);
        return part ? sum + part.unitPrice * qty : sum;
      },
      0
    );

    const servicesTotal = this.selectedServices.reduce(
      (sum, s: any) => sum + (s.price ?? 0),
      0
    );
    console.log('Total:', partsTotal + servicesTotal, this.partQty);
  }

  // ---------------- Validation ----------------
  private validateOrder(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.order.customerId) {
      errors.push('Customer is required');
    }

    if (!this.order.vehicleId) {
      errors.push('Vehicle is required');
    }

    if (this.selectedServices.length === 0) {
      errors.push('At least one service must be selected');
    }

    // Validate part quantities
    const insufficientParts = this.selectedPartsList.filter((part) => {
      debugger;
      const requestedQty = this.partQty[part._id] || 0;
      const stockQty = part.qtyStock ?? 0;
      if (requestedQty > stockQty) {
        errors.push(
          `Insufficient stock for: ${insufficientParts
            .map((p) => p.name)
            .join(', ')}`
        );
      }
    });
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // ---------------- Submission ----------------
  submitOrder(): void {
    // Validate the order first
    const validation = this.validateOrder();
    if (!validation.isValid) {
      alert(`Please fix the following:\n${validation.errors.join('\n')}`);
      return;
    }

    this.loading.submitting = true;

    // Get selected machine and mechanic objects
    const selectedMachine = this.machines.find(
      (m) => m._id === this.selectedMachineId
    );
    const selectedMechanic = this.mechanics.find(
      (me) => me._id === this.selectedMechanicId
    );
    // Populate customerSnapshot
    const selectedCustomer = this.selectedCustomer;
    if (selectedCustomer) {
      this.order.customerSnapshot = {
        name: `${selectedCustomer.firstName} ${selectedCustomer.lastName}`,
        phone: selectedCustomer.phone || '',
        email: selectedCustomer.email || '',
      };
    }
    // Prepare the order to submit
    const orderToSubmit: RepairOrder = {
      ...this.order,
      machineUsed: selectedMachine?._id || null,
      machineSnapshot: selectedMachine
        ? {
            name: selectedMachine.name,
            serialNo: selectedMachine.serialNo,
            type: selectedMachine.type,
            lastServiceAt: selectedMachine.lastServiceAt,
            active: selectedMachine.active,
          }
        : undefined,
      mechanicId: selectedMechanic?._id || null, // ✅ fixed field name
      mechanicSnapshot: selectedMechanic
        ? {
            firstName: selectedMechanic.firstName,
            lastName: selectedMechanic.lastName,
            specialization: selectedMechanic.specialization,
            hourlyRate: selectedMechanic.hourlyRate,
          }
        : undefined,
      servicesPerformed: this.selectedServicesList.map((s) => ({
        serviceId: s._id,
        price: s.basePrice,
      })),
      partsUsed: this.selectedPartsList.map((p) => ({
        partId: p._id,
        quantity: Number(this.partQty[p._id] || 1),
        pricePerUnit: p.unitPrice,
        location: p.location,
      })),
    };

    // Determine if this is an update or create
    const orderId = this.route.snapshot.paramMap.get('id');
    const request$ = orderId
      ? this.api.put(`repairs/${orderId}`, orderToSubmit) // UPDATE
      : this.api.post(`repairs`, orderToSubmit); // CREATE

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        alert(orderId ? 'Repair order updated!' : 'Repair order created!');
        this.resetForm();
      },
      error: (err) => {
        console.error('Submission error:', err);
        alert('Failed to submit repair order.');
      },
      complete: () => (this.loading.submitting = false),
    });
  }

  onPartQtyInput(partId: string, event: Event) {
    const input = event.target as HTMLInputElement;
    let qty = Number(input.value);

    // Ensure it's a valid number >=1
    if (!qty || isNaN(qty) || qty < 1) qty = 1;

    const part = this.prtInvern.find((p) => p._id === partId);
    if (part) qty = Math.min(qty, part.availableQty);

    this.partQty[partId] = qty; // store as number
    this.updateTotals();
  }

  // ---------------- Utility ----------------
  resetForm(): void {
    this.step = 1;
    this.order = this.createEmptyOrder();
    this.selectedParts = {};
    this.partQty = {};
    this.selectedServices = [];
    this.vehicles = [];
    this.selectedMachineId = null;
    this.selectedMechanicId = null;
    this.order.machineUsed = null; // ✅ force null, not ""
  }

  // Helper methods for template
  getPartQuantity(partId: string): number {
    return this.partQty[partId] || 1;
  }

  isPartSelected(partId: string): boolean {
    return !!this.selectedParts[partId];
  }

  isServiceSelected(serviceId: string): boolean {
    return this.selectedServices.includes(serviceId);
  }

  getServiceTotal(): number {
    return this.selectedServicesList.reduce(
      (sum, service) => sum + service.basePrice,
      0
    );
  }

  getPartsTotal(): number {
    return this.selectedPartsList.reduce((sum, part) => {
      const qty = this.getPartQuantity(part._id);
      return sum + part.unitPrice * qty;
    }, 0);
  }
  getGrandTotal(): number {
    const servicesTotal = this.getServiceTotal();
    const partsTotal = this.getPartsTotal();
    return servicesTotal + partsTotal;
  }

  // Utility for currency formatting (you can expand this)
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
}
