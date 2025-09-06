import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Apiservice } from './apiservice';
import { tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class Authservice {
  constructor(
    private api: Apiservice,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(creds: { email: string; password: string }) {
    return this.api.post<{ token: string }>('auth/login', creds).pipe(
      tap((r) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', r.token);
        }
      })
    );
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  isLogged(): boolean {
    return !!this.getToken();
  }
}
