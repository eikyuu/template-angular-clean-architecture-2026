import {
  ApplicationConfig,
  ErrorHandler,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { AUTH_TOKEN_PROVIDER, StorageAuthTokenProvider } from '@core/auth/auth-token.provider';
import { APP_CONFIG } from '@core/config/app-config.token';
import { GlobalErrorHandler } from '@core/errors/global-error-handler';
import { authInterceptor } from '@core/http/auth.interceptor';
import { baseUrlInterceptor } from '@core/http/base-url.interceptor';
import { usersMockInterceptor } from '@features/users/infrastructure/http/mocks/users.mock.interceptor';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([baseUrlInterceptor, usersMockInterceptor, authInterceptor]),
    ),
    { provide: APP_CONFIG, useValue: environment },
    { provide: AUTH_TOKEN_PROVIDER, useClass: StorageAuthTokenProvider },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
