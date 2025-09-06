import { HttpInterceptorFn } from '@angular/common/http';
import { Authservice } from './authservice';
import { inject } from '@angular/core';

export const tokeninterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Authservice);
  const token = auth.getToken();
  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(cloned);
  }
  return next(req);
};
