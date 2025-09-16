import { Component, inject, OnInit } from '@angular/core';
import { Apiservice } from '../../core/apiservice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-parts',
  imports: [CommonModule, FormsModule],
  templateUrl: './parts.html',
  styleUrl: './parts.css',
})
export class Parts implements OnInit {
  api = inject(Apiservice);
  part: any[] = [];
  form: any = null; // used for add/edit form
  categories: any[] = []; // assume you load categories from API
  categoriesMap: Record<string, string> = {};
  q: string = ''; // search query
  total = 0;
  ngOnInit(): void {
    this.getPart();
    this.loadCategories();
  }
  getPart(search?: string) {
    let query: any = {};
    if (search) query.search = search;
    this.api.get<any>('parts', query).subscribe({
      next: (res: any) => {
        this.part = res.data;
        console.log(this.part);
      },
      error: (err) => console.log(err),
    });
  }
  onSearch() {
    this.getPart(this.q);
  }
  // Load categories
  loadCategories() {
    this.api.get('categories').subscribe((res: any) => {
      this.categories = res.data;
      console.log(this.categories);
      this.categoriesMap = Object.fromEntries(
        this.categories.map((c) => [c._id, c.name])
      );
    });
  }
  // CREATE
  // Open empty form for new part
  openNew() {
    this.form = {
      sku: '',
      name: '',
      manufacturer: '',
      qtyStock: 0,
      unit: '',
      unitPrice: 0,
      categoryId: this.categories[0]?._id || '',
    };
  }

  // Edit existing part
  edit(part: any) {
    this.form = { ...part };
  }

  // Delete part
  remove(part: any) {
    if (confirm('Delete part?')) {
      this.api.delete(`parts/${part._id}`).subscribe(() => this.getPart());
    }
  }

  // Cancel form
  cancel() {
    this.form = null;
  }

  // Save (create or update)
  save(event: any) {
    event.preventDefault();
    if (!this.form) return;

    if (this.form._id) {
      // UPDATE
      this.api.put(`parts/${this.form._id}`, this.form).subscribe(() => {
        this.getPart();
        this.form = null;
      });
    } else {
      // CREATE
      this.api.post('parts', this.form).subscribe(() => {
        this.getPart();
        this.form = null;
      });
    }
  }
}
