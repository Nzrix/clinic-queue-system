import { registerLocaleData } from '@angular/common';
import localeTh from '@angular/common/locales/th';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// Required for DecimalPipe / DatePipe when LOCALE_ID is th-TH
registerLocaleData(localeTh, 'th-TH');

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
