import { Injectable } from '@angular/core';
import { Apiservice } from '../core/apiservice';
import { Observable } from 'rxjs';
import { Machine } from '../Models/machine';

@Injectable({
  providedIn: 'root',
})
export class MachineService {
  constructor(private api: Apiservice) {}

  getAll(): Observable<Machine[]> {
    return this.api.get<Machine[]>('machines');
  }

  getById(id: string): Observable<Machine> {
    return this.api.get<Machine>(`machines/${id}`);
  }
}
