import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import {
  AuthActions,
  FlightStoreActions,
  CheckinActions,
  OperationsActions,
  AdminActions,
} from './feature.stores';
import { ToastService } from '../core/services/toast.service';
import { AuthStorageService } from '../core/services/auth-storage.service';

// ════════════════════════════════════════════════════════════
// AUTH EFFECTS
// ════════════════════════════════════════════════════════════
@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private http     = inject(HttpClient);
  private storage  = inject(AuthStorageService);
  private router   = inject(Router);
  private toast    = inject(ToastService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ email, password }) =>
        this.http.post<any>(`${environment.authUrl}/login`, { email, password }).pipe(
          map(res => {
            this.storage.setTokens(res.tokens);
            localStorage.setItem('sw_user', JSON.stringify(res.user));
            this.toast.success(`Welcome back, ${res.user.firstName}!`);
            return AuthActions.loginSuccess({ user: res.user, token: res.tokens.accessToken });
          }),
          catchError(err => {
            this.toast.error(err.error?.message ?? 'Login failed');
            return of(AuthActions.loginFailure({ error: err.message }));
          })
        )
      )
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(() => this.router.navigate(['/']))
    ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        this.storage.clearTokens();
        this.router.navigate(['/auth/login']);
        this.toast.info('Logged out successfully.');
      })
    ),
    { dispatch: false }
  );
}

// ════════════════════════════════════════════════════════════
// FLIGHT EFFECTS
// ════════════════════════════════════════════════════════════
@Injectable()
export class FlightEffects {
  private actions$ = inject(Actions);
  private http     = inject(HttpClient);
  private router   = inject(Router);

  searchFlights$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FlightStoreActions.searchFlights),
      switchMap(({ criteria }) => {
        const params = new URLSearchParams({
          origin:        criteria.origin,
          destination:   criteria.destination,
          departureDate: criteria.departureDate,
          tripType:      criteria.tripType,
          adults:        criteria.adults,
          children:      criteria.children,
          infants:       criteria.infants,
          cabinClass:    criteria.cabinClass,
        });
        return this.http.get<any>(`${environment.flightUrl}/search?${params}`).pipe(
          map(res => {
            this.router.navigate(['/results']);
            return FlightStoreActions.searchFlightsSuccess({ results: res.outbound ?? res });
          }),
          catchError(err =>
            of(FlightStoreActions.searchFlightsFailure({ error: err.message }))
          )
        );
      })
    )
  );
}

// ════════════════════════════════════════════════════════════
// CHECK-IN EFFECTS
// ════════════════════════════════════════════════════════════
@Injectable()
export class CheckinEffects {
  private actions$ = inject(Actions);
  private http     = inject(HttpClient);
  private toast    = inject(ToastService);

  loadPnr$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CheckinActions.loadPnr),
      switchMap(({ pnr }) =>
        this.http.get<any>(`${environment.apiUrl}/checkin/pnr/${pnr}`).pipe(
          map(res => CheckinActions.loadPnrSuccess({ reservation: res.reservation })),
          catchError(err => {
            this.toast.error('PNR not found. Please check and try again.');
            return of(CheckinActions.loadPnrFailure({ error: err.message }));
          })
        )
      )
    )
  );

  completeCheckin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CheckinActions.completeCheckin),
      switchMap(({ payload }) =>
        this.http.post<any>(`${environment.apiUrl}/checkin`, payload).pipe(
          map(res => {
            this.toast.success('Check-in complete! Your boarding pass is ready.');
            return CheckinActions.completeCheckinSuccess({ boardingPass: res });
          }),
          catchError(err => {
            this.toast.error('Check-in failed. Please try again.');
            return of(CheckinActions.completeCheckinFailure({ error: err.message }));
          })
        )
      )
    )
  );
}

// ════════════════════════════════════════════════════════════
// OPERATIONS EFFECTS
// ════════════════════════════════════════════════════════════
@Injectable()
export class OperationsEffects {
  private actions$ = inject(Actions);
  private http     = inject(HttpClient);

  loadStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OperationsActions.loadStatus),
      switchMap(() =>
        this.http.get<any[]>(`${environment.operationsUrl}/status`).pipe(
          map(statuses => OperationsActions.loadStatusSuccess({ statuses })),
          catchError(() => of(OperationsActions.loadStatusSuccess({ statuses: [] })))
        )
      )
    )
  );

  loadDelays$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OperationsActions.loadDelays),
      switchMap(() =>
        this.http.get<any[]>(`${environment.operationsUrl}/delays`).pipe(
          map(delays => OperationsActions.loadDelaysSuccess({ delays })),
          catchError(() => of(OperationsActions.loadDelaysSuccess({ delays: [] })))
        )
      )
    )
  );

  loadIrops$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OperationsActions.loadIrops),
      switchMap(() =>
        this.http.get<any[]>(`${environment.operationsUrl}/irops`).pipe(
          map(events => OperationsActions.loadIropsSuccess({ events })),
          catchError(() => of(OperationsActions.loadIropsSuccess({ events: [] })))
        )
      )
    )
  );

  loadAnalytics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OperationsActions.loadAnalytics),
      switchMap(() =>
        this.http.get<any>(`${environment.operationsUrl}/analytics`).pipe(
          map(analytics => OperationsActions.loadAnalyticsSuccess({ analytics })),
          catchError(() => of(OperationsActions.loadAnalyticsSuccess({ analytics: null })))
        )
      )
    )
  );
}

// ════════════════════════════════════════════════════════════
// ADMIN EFFECTS
// ════════════════════════════════════════════════════════════
@Injectable()
export class AdminEffects {
  private actions$ = inject(Actions);
  private http     = inject(HttpClient);
  private toast    = inject(ToastService);

  loadStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadStats),
      switchMap(() =>
        this.http.get<any>(`${environment.adminUrl}/stats`).pipe(
          map(stats => AdminActions.loadStatsSuccess({ stats })),
          catchError(() => of(AdminActions.loadStatsSuccess({ stats: null })))
        )
      )
    )
  );

  loadFlights$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadFlights),
      switchMap(() =>
        this.http.get<any[]>(`${environment.adminUrl}/flights`).pipe(
          map(flights => AdminActions.loadFlightsSuccess({ flights })),
          catchError(() => of(AdminActions.loadFlightsSuccess({ flights: [] })))
        )
      )
    )
  );

  deleteFlight$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.deleteFlight),
      switchMap(({ id }) =>
        this.http.delete(`${environment.adminUrl}/flights/${id}`).pipe(
          map(() => {
            this.toast.success('Flight deleted successfully.');
            return AdminActions.deleteFlightSuccess({ id });
          }),
          catchError(() => {
            this.toast.error('Failed to delete flight.');
            return of(AdminActions.deleteFlightSuccess({ id: '' }));
          })
        )
      )
    )
  );

  loadAircraft$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadAircraft),
      switchMap(() =>
        this.http.get<any[]>(`${environment.adminUrl}/aircraft`).pipe(
          map(aircraft => AdminActions.loadAircraftSuccess({ aircraft })),
          catchError(() => of(AdminActions.loadAircraftSuccess({ aircraft: [] })))
        )
      )
    )
  );

  loadCrew$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AdminActions.loadCrew),
      switchMap(() =>
        this.http.get<any[]>(`${environment.adminUrl}/crew`).pipe(
          map(crews => AdminActions.loadCrewSuccess({ crews })),
          catchError(() => of(AdminActions.loadCrewSuccess({ crews: [] })))
        )
      )
    )
  );
}
