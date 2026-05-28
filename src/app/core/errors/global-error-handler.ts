import { ErrorHandler, Injectable, isDevMode } from '@angular/core';
import { DomainError } from './domain.error';

@Injectable({ providedIn: 'root' })
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    if (error instanceof DomainError) {
      if (isDevMode()) console.warn('[domain]', error.name, error.message);
      return;
    }
    console.error('[unexpected]', error);
  }
}
