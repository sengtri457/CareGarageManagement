import { Injectable } from '@angular/core';
import { Apiservice } from '../core/apiservice';
import { Observable } from 'rxjs';
import { Customer } from '../Models/customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private api: Apiservice) {}

  getAll(): Observable<Customer[]> {
    return this.api.get<Customer[]>('customers');
  }

  getById(id: string): Observable<Customer> {
    return this.api.get<Customer>(`customers/${id}`);
  }
}
