import { Component } from '@angular/core';
import { Apiservice } from '../../core/apiservice';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services-component',
  imports: [FormsModule, CommonModule],
  templateUrl: './services-component.html',
  styleUrl: './services-component.css',
})
export class ServicesComponent {
  services: any[] = [];
  categories: any[] = [];
  categoriesMap: Record<string, string> = {};
  form: any = null;

  constructor(private api: Apiservice) {}

  ngOnInit() {
    this.loadServices();
    this.loadCategories();
  }

  loadServices() {
    this.api.get('services').subscribe((res: any) => (this.services = res));
  }

  loadCategories() {
    this.api.get('categories').subscribe((res: any) => {
      this.categories = res;
      this.categoriesMap = Object.fromEntries(
        this.categories.map((c) => [c.id, c.name])
      );
    });
  }

  openNew() {
    this.form = {
      name: '',
      categoryId: this.categories[0]?.id || '',
      price: 0,
    };
  }

  edit(service: any) {
    this.form = { ...service };
  }

  remove(service: any) {
    if (confirm('Delete service?')) {
      this.api
        .delete(`services/${service.id}`)
        .subscribe(() => this.loadServices());
    }
  }

  cancel() {
    this.form = null;
  }

  save(event: any) {
    event.preventDefault();
    if (!this.form) return;
    if (this.form.id) {
      this.api.put(`services/${this.form.id}`, this.form).subscribe(() => {
        this.loadServices();
        this.form = null;
      });
    } else {
      this.api.post('services', this.form).subscribe(() => {
        this.loadServices();
        this.form = null;
      });
    }
  }
}
