import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Authservice } from './authservice';

export const authguardGuard: CanActivateFn = (route, state) => {
  const auth = inject(Authservice);
  const router = inject(Router);
  if (!auth.isLogged()) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
