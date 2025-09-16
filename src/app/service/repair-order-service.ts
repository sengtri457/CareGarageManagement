import { Injectable } from '@angular/core';
import { Apiservice } from '../core/apiservice';
import { Customer } from '../Models/customer';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RepairOrderService {
  constructor(private api: Apiservice) {}

  getAll(): Observable<Customer[]> {
    return this.api.get<Customer[]>('customers');
  }

  getById(id: string): Observable<Customer> {
    return this.api.get<Customer>(`customers/${id}`);
  }
}
