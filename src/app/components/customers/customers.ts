import { Component } from '@angular/core';
import { Apiservice } from '../../core/apiservice';
import { Datatable } from '../../shared/datatable/datatable';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-customers',
  imports: [Datatable, CommonModule, FormsModule],
  templateUrl: './customers.html',
  styleUrls: ['./customers.css'],
})
export class Customers {
  saving = false;
  successMsg = '';
  errorMsg = '';
  data: any[] = [];
  page = 1;
  limit = 10;
  total = 0;
  q = '';
  form: any = null;

  columns = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'phone', label: 'Phone Number' },
    { key: 'email', label: 'Email' },
    { key: 'address.street', label: 'Street' },
    { key: 'address.city', label: 'City' },
    { key: 'actions', label: 'Actions' }, // add column for buttons
  ];

  constructor(private api: Apiservice) {}

  ngOnInit() {
    this.load();
  }

  getNestedValue(obj: any, path: string) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  load(q?: string) {
    const query: any = { page: this.page, limit: this.limit };
    if (q) query.search = q;
    this.api.get<any>('customers', query).subscribe({
      next: (res: any) => {
        this.data = res.data ?? res;
        this.total = res.total ?? this.data.length;
      },
      error: (err) => console.error(err),
    });
  }

  onPage(n: number) {
    this.page = n;
    this.load(this.q);
  }

  onSearch() {
    this.page = 1;
    this.load(this.q);
  }

  openNew() {
    this.form = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: { street: '', city: '', zip: '' },
    };
  }

  onEdit(row: any) {
    // Fill form with selected customer’s data
    this.form = {
      ...row,
      address: { ...row.address },
    };
  }

  cancel() {
    this.form = null;
  }

  clearMessages() {
    this.successMsg = '';
    this.errorMsg = '';
  }

  onDelete(id: string) {
    if (!confirm('Delete this customer?')) return;
    this.api.delete(`customers/${id}`).subscribe(() => {
      this.data = this.data.filter((c) => c._id !== id);
      this.total = Math.max(0, this.total - 1);
    });
  }

  save(f: NgForm) {
    this.clearMessages();
    if (f.invalid || !this.form) {
      this.errorMsg = 'Please fix form errors.';
      return;
    }

    this.saving = true;

    if (this.form._id) {
      // UPDATE
      this.api.put(`customers/${this.form._id}`, this.form).subscribe({
        next: (res: any) => {
          this.saving = false;
          this.successMsg = 'Customer updated successfully.';
          this.data = this.data.map((c) => (c._id === res._id ? res : c));
          this.cancel();
        },
        error: (err) => {
          this.saving = false;
          this.errorMsg = err?.error?.message || 'Failed to update customer.';
        },
      });
    } else {
      // CREATE
      this.api.post('customers', this.form).subscribe({
        next: (res: any) => {
          this.saving = false;
          this.successMsg = 'Customer created successfully.';
          this.load();
          this.cancel();
        },
        error: (err) => {
          this.saving = false;
          this.errorMsg = err?.error?.message || 'Failed to create customer.';
        },
      });
    }
  }
}
