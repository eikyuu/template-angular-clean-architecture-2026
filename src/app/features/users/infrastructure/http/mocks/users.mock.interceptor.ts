import {
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { APP_CONFIG } from '@core/config/app-config.token';
import { CreateUserDto, UserDto } from '../user.dto';
import { usersSeed } from './users.seed';

const MOCK_LATENCY_MS = 150;

let users: UserDto[] = [...usersSeed];
let nextId = usersSeed.length + 1;

export const usersMockInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(APP_CONFIG);
  if (!config.useMocks) {
    return next(req);
  }

  const prefix = `${config.apiBaseUrl}/users`;
  if (!req.url.startsWith(prefix)) {
    return next(req);
  }

  const tail = req.url.slice(prefix.length);

  if (req.method === 'GET' && (tail === '' || tail === '/')) {
    return respond(new HttpResponse<UserDto[]>({ status: 200, body: [...users] }));
  }

  if (req.method === 'GET' && tail.startsWith('/')) {
    const id = tail.slice(1);
    const found = users.find((u) => u.id === id);
    if (!found) {
      return throwError(
        () => new HttpErrorResponse({ status: 404, url: req.url }),
      );
    }
    return respond(new HttpResponse<UserDto>({ status: 200, body: found }));
  }

  if (req.method === 'POST' && (tail === '' || tail === '/')) {
    const input = req.body as CreateUserDto;
    const created: UserDto = {
      id: String(nextId++),
      email: input.email,
      name: input.name,
      created_at: new Date().toISOString(),
    };
    users = [...users, created];
    return respond(new HttpResponse<UserDto>({ status: 201, body: created }));
  }

  return next(req);
};

function respond<T>(response: HttpResponse<T>): Observable<HttpEvent<T>> {
  return of(response).pipe(delay(MOCK_LATENCY_MS));
}
