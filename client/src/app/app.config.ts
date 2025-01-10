import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ErrorInterceptor } from './Interceptors/error.interceptor';
import { JwtInterceptor } from './Interceptors/jwt.interceptor';
import { NgxSpinnerModule } from "ngx-spinner";
import { LoadingInterceptor } from './Interceptors/loading.interceptor';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TimeagoModule } from 'ngx-timeago';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide:  HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide:  HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: Aura
            }
        }),
    importProvidersFrom(
      BrowserAnimationsModule,
      NgxSpinnerModule,
      TabsModule.forRoot(),
      TimeagoModule.forRoot(),
      ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: "toast-bottom-right",
        preventDuplicates: false
      })
    )
  ]
};
