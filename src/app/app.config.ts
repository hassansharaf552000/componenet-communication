import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { APP_FEATURE_CONFIG } from './examples/di/app-config.token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: APP_FEATURE_CONFIG, useValue: { apiBase: '/api', enableDebug: true } }
  ]
};
