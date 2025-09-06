import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-datatable',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './datatable.html',
  styleUrls: ['./datatable.css'], // fixed typo styleUrl → styleUrls
})
export class Datatable {
  @Input() columns: { key: string; label: string }[] = [];
  @Input() data: any[] = [];
  @Input() page = 1;
  @Input() total = 0;
  @Input() limit = 10;

  @Output() pageChange = new EventEmitter<number>();
  @Output() rowClick = new EventEmitter<any>();
  @Output() search = new EventEmitter<string>();

  // delete & update emitters
  @Output() delCustomers = new EventEmitter<string>();
  @Output() updateCustomer = new EventEmitter<any>();
  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  onPage(n: number) {
    this.pageChange.emit(n);
  }

  onRow(r: any) {
    this.rowClick.emit(r);
  }

  onSearch(q: string) {
    this.search.emit(q);
  }

  delCustomer(_id: string) {
    debugger;
    this.delCustomers.emit(_id);
    console.log(_id);
  }

  editCustomer(row: any) {
    this.updateCustomer.emit(row);
  }
}
