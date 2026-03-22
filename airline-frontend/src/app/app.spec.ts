import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

// ─── Pipe tests ───────────────────────────────────────────────
import {
  DurationPipe, CabinLabelPipe, RelativeTimePipe,
  FarePipe, StatusColorPipe, InitialsPipe
} from './shared/pipes/index';

describe('DurationPipe', () => {
  let pipe: DurationPipe;
  beforeEach(() => { pipe = new DurationPipe(); });

  it('converts 435 minutes to "7h 15m"', () => {
    expect(pipe.transform(435)).toBe('7h 15m');
  });

  it('converts 60 minutes to "1h"', () => {
    expect(pipe.transform(60)).toBe('1h');
  });

  it('converts 45 minutes to "45m"', () => {
    expect(pipe.transform(45)).toBe('45m');
  });

  it('handles 0', () => {
    expect(pipe.transform(0)).toBe('—');
  });

  it('handles 90 minutes (1h 30m)', () => {
    expect(pipe.transform(90)).toBe('1h 30m');
  });
});

describe('CabinLabelPipe', () => {
  let pipe: CabinLabelPipe;
  beforeEach(() => { pipe = new CabinLabelPipe(); });

  it('maps ECONOMY → "Economy"',            () => expect(pipe.transform('ECONOMY')).toBe('Economy'));
  it('maps PREMIUM_ECONOMY → "Prem. Economy"', () => expect(pipe.transform('PREMIUM_ECONOMY')).toBe('Prem. Economy'));
  it('maps BUSINESS → "Business"',          () => expect(pipe.transform('BUSINESS')).toBe('Business'));
  it('maps FIRST → "First Class"',          () => expect(pipe.transform('FIRST')).toBe('First Class'));
  it('returns unknown types as-is',         () => expect(pipe.transform('UNKNOWN')).toBe('UNKNOWN'));
});

describe('FarePipe', () => {
  let pipe: FarePipe;
  beforeEach(() => { pipe = new FarePipe(); });

  it('formats 1299.9 as "USD 1,300"',  () => expect(pipe.transform(1299.9)).toBe('USD 1,300'));
  it('formats 580 as "USD 580"',        () => expect(pipe.transform(580)).toBe('USD 580'));
  it('uses custom currency',            () => expect(pipe.transform(450, 'GBP')).toBe('GBP 450'));
  it('handles undefined gracefully',    () => expect(pipe.transform(undefined as any)).toBe('—'));
});

describe('StatusColorPipe', () => {
  let pipe: StatusColorPipe;
  beforeEach(() => { pipe = new StatusColorPipe(); });

  it('maps SCHEDULED → "badge badge-blue"',   () => expect(pipe.transform('SCHEDULED')).toBe('badge badge-blue'));
  it('maps DELAYED → "badge badge-amber"',    () => expect(pipe.transform('DELAYED')).toBe('badge badge-amber'));
  it('maps CONFIRMED → "badge badge-green"',  () => expect(pipe.transform('CONFIRMED')).toBe('badge badge-green'));
  it('maps CANCELLED → "badge badge-red"',    () => expect(pipe.transform('CANCELLED')).toBe('badge badge-red'));
  it('uses neutral for unknown',               () => expect(pipe.transform('UNKNOWN')).toBe('badge badge-neutral'));
});

describe('InitialsPipe', () => {
  let pipe: InitialsPipe;
  beforeEach(() => { pipe = new InitialsPipe(); });

  it('extracts initials from object',      () => expect(pipe.transform({ firstName: 'John', lastName: 'Doe' })).toBe('JD'));
  it('extracts initials from string',      () => expect(pipe.transform('John Doe')).toBe('JO'));
  it('handles null',                       () => expect(pipe.transform(null)).toBe(''));
  it('handles single name object',         () => expect(pipe.transform({ firstName: 'Alice' })).toBe('A'));
});

// ─── Toast Service tests ──────────────────────────────────────
import { ToastService } from './core/services/toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ToastService] });
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('adds a toast on show()', (done) => {
    service.show('Test message', 'success');
    service.toasts$.subscribe(toasts => {
      if (toasts.length > 0) {
        expect(toasts[0].message).toBe('Test message');
        expect(toasts[0].type).toBe('success');
        done();
      }
    });
  });

  it('removes a toast by id', (done) => {
    service.show('To remove', 'info');
    service.toasts$.subscribe(toasts => {
      if (toasts.length > 0) {
        const id = toasts[0].id;
        service.remove(id);
        service.toasts$.subscribe(updated => {
          expect(updated.find(t => t.id === id)).toBeUndefined();
          done();
        });
      }
    });
  });

  it('success() shorthand works', (done) => {
    service.success('All good');
    service.toasts$.subscribe(toasts => {
      if (toasts.length > 0) {
        expect(toasts[toasts.length-1].type).toBe('success');
        done();
      }
    });
  });

  it('error() shorthand works', (done) => {
    service.error('Something broke');
    service.toasts$.subscribe(toasts => {
      if (toasts.length > 0) {
        expect(toasts[toasts.length-1].type).toBe('error');
        done();
      }
    });
  });
});

// ─── Booking Store tests ──────────────────────────────────────
import { bookingReducer, BookingActions, initialBookingState } from './store/booking.store';

describe('bookingReducer', () => {
  it('returns initial state for unknown action', () => {
    const state = bookingReducer(undefined, { type: '@@INIT' } as any);
    expect(state).toEqual(initialBookingState);
  });

  it('setSearchParams updates searchParams and sets step to RESULTS', () => {
    const params: any = {
      origin: 'JFK', destination: 'LHR',
      departureDate: '2026-04-15', tripType: 'ONE_WAY',
      adults: 2, children: 0, infants: 0, cabinClass: 'ECONOMY'
    };
    const state = bookingReducer(initialBookingState, BookingActions.setSearchParams({ params }));
    expect(state.searchParams).toEqual(params);
    expect(state.currentStep).toBe('RESULTS');
  });

  it('selectOutboundFlight sets flight and cabin, moves to SEATS', () => {
    const flight: any = { id: 'FL001', flightNumber: 'SW101' };
    const state = bookingReducer(initialBookingState, BookingActions.selectOutboundFlight({ flight, cabinClass: 'BUSINESS' }));
    expect(state.selectedOutboundFlight).toEqual(flight);
    expect(state.selectedCabinClass).toBe('BUSINESS');
    expect(state.currentStep).toBe('SEATS');
  });

  it('setSeats updates seats and moves to PASSENGERS', () => {
    const seats = [{ passengerId: 'pax-0', seatId: '12A' }];
    const state = bookingReducer(initialBookingState, BookingActions.setSeats({ seats }));
    expect(state.selectedSeats).toEqual(seats);
    expect(state.currentStep).toBe('PASSENGERS');
  });

  it('addSeat adds a seat selection', () => {
    const seat = { passengerId: 'pax-0', seatId: '12A' };
    const state = bookingReducer(initialBookingState, BookingActions.addSeat({ seat }));
    expect(state.selectedSeats).toContain(seat);
  });

  it('removeSeat removes a seat selection', () => {
    const initial = { ...initialBookingState, selectedSeats: [{ passengerId: 'pax-0', seatId: '12A' }] };
    const state = bookingReducer(initial, BookingActions.removeSeat({ seatId: '12A' }));
    expect(state.selectedSeats.length).toBe(0);
  });

  it('setPassengers updates passengers and moves to REVIEW', () => {
    const passengers: any[] = [{ firstName: 'John', lastName: 'Doe' }];
    const state = bookingReducer(initialBookingState, BookingActions.setPassengers({ passengers }));
    expect(state.passengers).toEqual(passengers);
    expect(state.currentStep).toBe('REVIEW');
  });

  it('setContactInfo updates email and phone', () => {
    const state = bookingReducer(initialBookingState, BookingActions.setContactInfo({ email: 'test@test.com', phone: '+1234567890' }));
    expect(state.contactEmail).toBe('test@test.com');
    expect(state.contactPhone).toBe('+1234567890');
  });

  it('setReservation updates pnr, reservationId, pricing, moves to PAYMENT', () => {
    const pricing: any = { totalAmount: 659.99, currency: 'USD', baseFare: 580, taxes: [], seatCharges: 0, baggageCharges: 0, serviceFee: 9.99, discount: 0 };
    const state = bookingReducer(initialBookingState, BookingActions.setReservation({ reservationId: 'RES001', pnr: 'SKY7X2', pricing }));
    expect(state.pnr).toBe('SKY7X2');
    expect(state.reservationId).toBe('RES001');
    expect(state.currentStep).toBe('PAYMENT');
  });

  it('resetBooking returns to initial state', () => {
    const modified = { ...initialBookingState, pnr: 'SKY7X2', currentStep: 'PAYMENT' as any };
    const state = bookingReducer(modified, BookingActions.resetBooking());
    expect(state).toEqual(initialBookingState);
  });

  it('setStep updates currentStep', () => {
    const state = bookingReducer(initialBookingState, BookingActions.setStep({ step: 'CONFIRMATION' }));
    expect(state.currentStep).toBe('CONFIRMATION');
  });
});

// ─── Auth Storage Service tests ───────────────────────────────
import { AuthStorageService } from './core/services/auth-storage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AuthStorageService', () => {
  let service: AuthStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthStorageService]
    });
    service = TestBed.inject(AuthStorageService);
    localStorage.clear();
  });

  it('should be created', () => expect(service).toBeTruthy());

  it('setTokens stores access and refresh tokens', () => {
    service.setTokens({ accessToken: 'acc123', refreshToken: 'ref456', expiresIn: 3600 });
    expect(service.getAccessToken()).toBe('acc123');
    expect(service.getRefreshToken()).toBe('ref456');
  });

  it('isLoggedIn returns false when no token', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('isLoggedIn returns true when token set', () => {
    service.setTokens({ accessToken: 'tok', refreshToken: 'ref', expiresIn: 3600 });
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('clearTokens removes all stored tokens', () => {
    service.setTokens({ accessToken: 'tok', refreshToken: 'ref', expiresIn: 3600 });
    service.clearTokens();
    expect(service.getAccessToken()).toBeNull();
    expect(service.getRefreshToken()).toBeNull();
    expect(service.isLoggedIn()).toBeFalse();
  });
});

// ─── Feature Store tests ──────────────────────────────────────
import {
  authReducer, AuthActions,
  checkinReducer, CheckinActions,
  operationsReducer, OperationsActions,
} from './store/feature.stores';

describe('authReducer', () => {
  const initial = { user: null, token: null, role: 'PASSENGER' as const, loading: false, error: null };

  it('sets loading on login', () => {
    const state = authReducer(initial, AuthActions.login({ email: 'a@b.com', password: 'pw' }));
    expect(state.loading).toBeTrue();
  });

  it('sets user and token on loginSuccess', () => {
    const user: any = { id: '1', email: 'a@b.com', role: 'PASSENGER', firstName: 'Test', lastName: 'User', createdAt: '' };
    const state = authReducer(initial, AuthActions.loginSuccess({ user, token: 'jwt123' }));
    expect(state.user).toEqual(user);
    expect(state.token).toBe('jwt123');
    expect(state.loading).toBeFalse();
  });

  it('sets error on loginFailure', () => {
    const state = authReducer(initial, AuthActions.loginFailure({ error: 'Invalid credentials' }));
    expect(state.error).toBe('Invalid credentials');
    expect(state.loading).toBeFalse();
  });

  it('clears state on logout', () => {
    const loggedIn = { ...initial, user: { id: '1' } as any, token: 'jwt' };
    const state = authReducer(loggedIn, AuthActions.logout());
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });
});

describe('checkinReducer', () => {
  const initial = { pnr: null, reservation: null, passengers: [], boardingPass: null, status: 'IDLE' as const, loading: false, error: null };

  it('sets pnr and loading on loadPnr', () => {
    const state = checkinReducer(initial, CheckinActions.loadPnr({ pnr: 'SKY7X2' }));
    expect(state.pnr).toBe('SKY7X2');
    expect(state.loading).toBeTrue();
  });

  it('sets reservation and status PNR_LOADED on loadPnrSuccess', () => {
    const res: any = { pnr: 'SKY7X2', status: 'CONFIRMED' };
    const state = checkinReducer(initial, CheckinActions.loadPnrSuccess({ reservation: res }));
    expect(state.reservation).toEqual(res);
    expect(state.status).toBe('PNR_LOADED');
    expect(state.loading).toBeFalse();
  });

  it('sets boardingPass and CHECKED_IN on completeCheckinSuccess', () => {
    const bp: any = { pnr: 'SKY7X2', boardingPasses: [] };
    const state = checkinReducer(initial, CheckinActions.completeCheckinSuccess({ boardingPass: bp }));
    expect(state.boardingPass).toEqual(bp);
    expect(state.status).toBe('CHECKED_IN');
  });

  it('resets on resetCheckin', () => {
    const modified = { ...initial, pnr: 'SKY7X2', status: 'CHECKED_IN' as const };
    const state = checkinReducer(modified, CheckinActions.resetCheckin());
    expect(state).toEqual(initial);
  });
});
