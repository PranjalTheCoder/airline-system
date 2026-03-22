import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      // ── Search & results ──
      { path: '', loadComponent: () => import('./modules/flight/pages/search/search.component').then(m => m.SearchComponent) },
      { path: 'results',       loadComponent: () => import('./modules/flight/pages/results/results.component').then(m => m.ResultsComponent) },
      { path: 'flights/:id',   loadComponent: () => import('./modules/flight/pages/details/flight-details.component').then(m => m.FlightDetailsComponent) },

      // ── Full booking flow ──
      { path: 'seats',         canActivate: [authGuard], loadComponent: () => import('./modules/inventory/pages/seat-selection/seat-selection.component').then(m => m.SeatSelectionComponent) },
      { path: 'passengers',    canActivate: [authGuard], loadComponent: () => import('./modules/reservation/pages/passenger-details/passenger-details.component').then(m => m.PassengerDetailsComponent) },
      { path: 'ancillaries',   canActivate: [authGuard], loadComponent: () => import('./modules/reservation/pages/ancillaries/ancillaries.component').then(m => m.AncillariesComponent) },
      { path: 'review',        canActivate: [authGuard], loadComponent: () => import('./modules/reservation/pages/booking-review/booking-review.component').then(m => m.BookingReviewComponent) },
      { path: 'payment',       canActivate: [authGuard], loadComponent: () => import('./modules/payment/pages/payment/payment.component').then(m => m.PaymentComponent) },
      { path: 'payment/status',canActivate: [authGuard], loadComponent: () => import('./modules/payment/pages/payment-status/payment-status.component').then(m => m.PaymentStatusComponent) },
      { path: 'ticket',        canActivate: [authGuard], loadComponent: () => import('./modules/ticketing/pages/confirmation/confirmation.component').then(m => m.ConfirmationComponent) },

      // ── Passenger portal ──
      { path: 'my-bookings',   canActivate: [authGuard], loadComponent: () => import('./modules/reservation/pages/manage-booking/manage-booking.component').then(m => m.ManageBookingComponent) },
      { path: 'profile',       canActivate: [authGuard], loadComponent: () => import('./modules/auth/pages/profile/profile.component').then(m => m.ProfileComponent) },

      // ── Check-in (DCS) ──
      { path: 'checkin', loadComponent: () => import('./modules/checkin/pages/checkin-home/checkin-home.component').then(m => m.CheckinHomeComponent) },

      // ── Baggage ──
      { path: 'baggage/add',   canActivate: [authGuard], loadComponent: () => import('./modules/baggage/pages/add-baggage/add-baggage.component').then(m => m.AddBaggageComponent) },
      { path: 'baggage/track', loadComponent: () => import('./modules/baggage/pages/track-baggage/track-baggage.component').then(m => m.TrackBaggageComponent) },

      // ── Loyalty ──
      { path: 'loyalty',         loadComponent: () => import('./modules/loyalty/pages/dashboard/loyalty-dashboard.component').then(m => m.LoyaltyDashboardComponent) },
      { path: 'loyalty/rewards', loadComponent: () => import('./modules/loyalty/pages/rewards/loyalty-rewards.component').then(m => m.LoyaltyRewardsComponent) },

      // ── Crew ──
      { path: 'crew',          loadComponent: () => import('./modules/crew/pages/list/crew-list.component').then(m => m.CrewListComponent) },
      { path: 'crew/schedule', loadComponent: () => import('./modules/crew/pages/schedule/crew-schedule.component').then(m => m.CrewScheduleComponent) },

      // ── Operations (staff) ──
      { path: 'operations', loadComponent: () => import('./modules/operations/pages/dashboard/operations-dashboard.component').then(m => m.OperationsDashboardComponent) },

      // ── 404 ──
      { path: '404', loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent) },
    ],
  },

  // ── Auth layout ──
  {
    path: 'auth',
    loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      { path: 'login',    canActivate: [guestGuard], loadComponent: () => import('./modules/auth/pages/login/login.component').then(m => m.LoginComponent) },
      { path: 'register', canActivate: [guestGuard], loadComponent: () => import('./modules/auth/pages/register/register.component').then(m => m.RegisterComponent) },
    ],
  },

  // ── Admin (full-screen, own layout) ──
  { path: 'admin', loadComponent: () => import('./modules/admin/pages/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },

  // ── Wildcard → 404 ──
  { path: '**', redirectTo: '404' },
];
