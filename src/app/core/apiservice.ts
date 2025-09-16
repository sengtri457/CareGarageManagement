import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import { RepairOrder } from '../Models/repair-order';
import path from 'path';

@Injectable({
  providedIn: 'root',
})
export class Apiservice {
  private base = environment.apiBase;

  constructor(private http: HttpClient) {}

  // --- Helper to get headers with token ---
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }

  // --- GET request ---
  get<T>(path: string, params?: any): Observable<T> {
    debugger;
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value);
        }
      });
    }
    return this.http.get<T>(`${this.base}/${path}`, {
      headers: this.getHeaders(),
      params: httpParams,
    });
  }

  // --- POST request ---
  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.base}/${path}`, body, {
      headers: this.getHeaders(),
    });
  }

  // --- PUT request ---
  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.base}/${path}`, body, {
      headers: this.getHeaders(),
    });
  }

  // --- DELETE request ---
  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.base}/${path}`, {
      headers: this.getHeaders(),
    });
  }
  getByCustomer(customerId: string): Observable<any> {
    return this.http.get(`${this.base}/repairs/${customerId}`);
  }
}
