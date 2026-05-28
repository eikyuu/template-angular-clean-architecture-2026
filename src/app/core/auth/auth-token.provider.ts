import { Injectable, InjectionToken } from '@angular/core';

export interface AuthTokenProvider {
  getToken(): string | null;
  setToken(token: string | null): void;
}

export const AUTH_TOKEN_PROVIDER = new InjectionToken<AuthTokenProvider>('AUTH_TOKEN_PROVIDER');

const STORAGE_KEY = 'auth.token';

@Injectable({ providedIn: 'root' })
export class StorageAuthTokenProvider implements AuthTokenProvider {
  getToken(): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEY);
  }

  setToken(token: string | null): void {
    if (typeof localStorage === 'undefined') return;
    if (token === null) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, token);
  }
}
