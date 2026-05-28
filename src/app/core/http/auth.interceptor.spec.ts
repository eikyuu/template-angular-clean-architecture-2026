import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AUTH_TOKEN_PROVIDER, AuthTokenProvider } from '../auth/auth-token.provider';
import { authInterceptor } from './auth.interceptor';

class StaticTokenProvider implements AuthTokenProvider {
  constructor(private token: string | null) {}
  getToken() { return this.token; }
  setToken(t: string | null) { this.token = t; }
}

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  function setup(token: string | null) {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AUTH_TOKEN_PROVIDER, useValue: new StaticTokenProvider(token) },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  }

  afterEach(() => httpMock?.verify());

  it('adds Bearer header when a token is available', () => {
    setup('abc123');
    http.get('/api/me').subscribe();
    const req = httpMock.expectOne('/api/me');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc123');
    req.flush({});
  });

  it('does not add a header when no token is available', () => {
    setup(null);
    http.get('/api/me').subscribe();
    const req = httpMock.expectOne('/api/me');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
