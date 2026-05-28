import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AUTH_TOKEN_PROVIDER } from '../auth/auth-token.provider';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AUTH_TOKEN_PROVIDER).getToken();
  if (token === null) {
    return next(req);
  }
  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
