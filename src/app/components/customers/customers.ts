import { Component } from '@angular/core';
import { Apiservice } from '../../core/apiservice';
import { Datatable } from '../../shared/datatable/datatable';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-customers',
  imports: [Datatable, CommonModule, FormsModule],
  templateUrl: './customers.html',
  styleUrls: ['./customers.css'], // fixed typo
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

  columns = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'phone', label: 'Phone Number' },
    { key: 'email', label: 'Email' },
    { key: 'address.street', label: 'Street' },
    { key: 'address.city', label: 'City' },
  ];

  model: any = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: { street: '', city: '', zip: '' },
  };
  editingCustomer: any = null;

  constructor(private api: Apiservice) {}

  ngOnInit() {
    this.load();
  }

  // helper to get nested values for datatable
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

  createCustomer(form: NgForm) {
    this.clearMessages();
    if (form.invalid) {
      this.errorMsg = 'Please fix form errors.';
      return;
    }

    this.saving = true;
    this.api.post('customers', this.model).subscribe({
      next: (res: any) => {
        this.saving = false;
        this.successMsg = 'Customer created successfully.';
        this.resetForm(form);
        this.load(); // reload table
      },
      error: (err: any) => {
        this.saving = false;
        console.error('Create customer error', err);
        this.errorMsg = err?.error?.message || 'Failed to create customer.';
      },
    });
  }

  resetForm(form: NgForm) {
    form.resetForm();
    this.model = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: { street: '', city: '', zip: '' },
    };
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

  onEdit(row: any) {
    const updated = { ...row }; // modify fields here as needed
    this.api.put(`customers/${row._id}`, updated).subscribe((res) => {
      this.data = this.data.map((c) => (c._id === row._id ? res : c));
    });
  }
}
