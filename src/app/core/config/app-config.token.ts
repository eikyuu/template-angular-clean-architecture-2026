import { InjectionToken } from '@angular/core';

export interface AppConfig {
  readonly apiBaseUrl: string;
  readonly production: boolean;
  readonly useMocks: boolean;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');
