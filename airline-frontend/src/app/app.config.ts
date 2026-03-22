import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withViewTransitions,
  withComponentInputBinding
} from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { provideStore }        from '@ngrx/store';
import { provideEffects }      from '@ngrx/effects';
import { AuthEffects, FlightEffects, CheckinEffects, OperationsEffects, AdminEffects } from './store/app.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideAnimations }   from '@angular/platform-browser/animations';

import { routes }              from './app.routes';
import { environment }         from '../environments/environment';

import { MockInterceptor }     from './core/interceptors/mock.interceptor';
import { JwtInterceptor }      from './core/interceptors/jwt.interceptor';
import { ErrorInterceptor }    from './core/interceptors/error.interceptor';

import { bookingReducer }      from './store/booking.store';
import {
  authReducer,
  flightStoreReducer,
  checkinReducer,
  operationsReducer,
  adminReducer
} from './store/feature.stores';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions(), withComponentInputBinding()),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),

    // Order: Mock first → JWT → Error handler
    { provide: HTTP_INTERCEPTORS, useClass: MockInterceptor,  multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor,   multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    provideStore({
      auth:       authReducer,
      flights:    flightStoreReducer,
      booking:    bookingReducer,
      checkin:    checkinReducer,
      operations: operationsReducer,
      admin:      adminReducer,
    }),

    provideEffects([AuthEffects, FlightEffects, CheckinEffects, OperationsEffects, AdminEffects]),

    ...(!environment.production
      ? [provideStoreDevtools({
          maxAge: 50,
          logOnly: false,
          autoPause: true,
          name: 'SkyWay NgRx DevTools'
        })]
      : []
    ),
  ],
};
