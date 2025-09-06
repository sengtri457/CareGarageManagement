import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Apiservice } from '../../core/apiservice';

@Component({
  selector: 'app-vehicles',
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicles.html',
  styleUrls: ['./vehicles.css'], // fixed typo
})
export class Vehicles {
  vehicles: any[] = [];
  customers: any[] = [];
  customersMap: Record<string, string> = {};
  form: any = null;
  q: string = ''; // search query
  total = 0;

  constructor(private api: Apiservice) {}

  ngOnInit() {
    this.loadVehicles();
    this.loadCustomers();
  }

  loadVehicles(search?: string) {
    let query: any = {};
    if (search) query.search = search;

    this.api.get<any>('vehicles', query).subscribe({
      next: (res: any) => {
        this.vehicles = res.data ?? res;
        this.total = res.total ?? this.vehicles.length;
      },
      error: (err) => console.error(err),
    });
  }

  loadCustomers() {
    this.api.get<any>('customers').subscribe({
      next: (res: any) => {
        this.customers = res.data;
        this.customersMap = Object.fromEntries(
          this.customers.map((c: any) => [
            c._id,
            c.firstName + ' ' + c.lastName,
          ])
        );
      },
      error: (err) => console.log(err),
    });
  }

  onSearch() {
    this.loadVehicles(this.q);
  }

  openNew() {
    this.form = {
      _id: null,
      licensePlate: '',
      vin: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      customerId: null, // initially empty
    };
  }

  edit(vehicle: any) {
    this.form = { ...vehicle };
  }

  remove(vehicle: any) {
    if (!confirm('Delete vehicle?')) return;
    this.api
      .delete(`vehicles/${vehicle._id}`)
      .subscribe(() => this.loadVehicles());
  }

  cancel() {
    this.form = null;
  }

  save(event: any) {
    event.preventDefault();
    if (!this.form) return;

    if (this.form._id) {
      this.api.put(`vehicles/${this.form._id}`, this.form).subscribe(() => {
        this.loadVehicles();
        this.form = null;
      });
    } else {
      this.api.post('vehicles', this.form).subscribe(() => {
        this.loadVehicles();
        this.form = null;
      });
    }
  }
}
