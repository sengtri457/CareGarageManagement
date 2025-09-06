import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Apiservice } from '../../core/apiservice';

@Component({
  selector: 'app-machines',
  imports: [CommonModule, FormsModule],
  templateUrl: './machines.html',
  styleUrl: './machines.css',
})
export class Machines {
  machines: any[] = [];
  form: any = null;

  constructor(private api: Apiservice) {}

  ngOnInit() {
    this.loadMachines();
  }

  loadMachines() {
    this.api.get<any>('machines').subscribe({
      next: (data: any) => {
        this.machines = data.data;
      },
    });
  }

  openNew() {
    this.form = { name: '', code: '', location: '' };
  }

  edit(machine: any) {
    this.form = { ...machine };
  }

  remove(machine: any) {
    if (confirm('Delete machine?')) {
      this.api
        .delete(`machines/${machine._id}`)
        .subscribe(() => this.loadMachines());
    }
  }

  cancel() {
    this.form = null;
  }

  save(event: any) {
    event.preventDefault();
    if (!this.form) return;
    if (this.form.id) {
      this.api.put(`machines/${this.form.id}`, this.form).subscribe(() => {
        this.loadMachines();
        this.form = null;
      });
    } else {
      this.api.post('machines', this.form).subscribe(() => {
        this.loadMachines();
        this.form = null;
      });
    }
  }
}
