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
  q: string = ''; // search query
  total = 0;
  constructor(private api: Apiservice) {}

  ngOnInit() {
    this.loadServices();
    this.loadCategories();
  }

  loadServices(search?: string) {
    let query: any = {};
    if (search) query.search = search;
    this.api.get('services', query).subscribe((res: any) => {
      this.services = res.data;
      this.total = res.total ?? this.services.length;
      console.log(this.services);
    });
  }

  loadCategories() {
    this.api.get('categories').subscribe((res: any) => {
      this.categories = res.data;
      this.categoriesMap = Object.fromEntries(
        this.categories.map((c) => [c._id, c.name])
      );
    });
  }
  onSearch() {
    this.loadServices(this.q);
  }

  openNew() {
    this.form = {
      name: '',
      categoryId: this.categories[0]?._id || '',
      code: '',
      basePrice: 0,
    };
  }

  edit(service: any) {
    this.form = { ...service };
  }

  remove(service: any) {
    if (confirm('Delete service?')) {
      this.api
        .delete(`services/${service._id}`)
        .subscribe(() => this.loadServices());
    }
  }

  cancel() {
    this.form = null;
  }

  save(event: any) {
    event.preventDefault();
    if (!this.form) return;

    if (this.form._id) {
      // UPDATE
      this.api.put(`services/${this.form._id}`, this.form).subscribe(() => {
        this.loadServices();
        this.form = null;
      });
    } else {
      // CREATE
      this.api.post('services', this.form).subscribe(() => {
        this.loadServices();
        this.form = null;
      });
    }
  }
}
