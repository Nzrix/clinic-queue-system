import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideNativeDateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'th-TH' },
    { provide: LOCALE_ID, useValue: 'th-TH' }
  ]
};
