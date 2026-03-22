import { createAction, props, createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import { User } from '../core/models/index';

// ════════════════════════════════════════════════════════════
// AUTH STORE
// ════════════════════════════════════════════════════════════
export interface AuthState {
  user:    User | null;
  token:   string | null;
  role:    'PASSENGER' | 'ADMIN' | 'STAFF' | 'OPERATIONS_MANAGER';
  loading: boolean;
  error:   string | null;
}

const authInitial: AuthState = {
  user: null, token: null, role: 'PASSENGER', loading: false, error: null
};

export const AuthActions = {
  login:           createAction('[Auth] Login',            props<{ email: string; password: string }>()),
  loginSuccess:    createAction('[Auth] Login Success',    props<{ user: User; token: string }>()),
  loginFailure:    createAction('[Auth] Login Failure',    props<{ error: string }>()),
  logout:          createAction('[Auth] Logout'),
  loadUser:        createAction('[Auth] Load User'),
  loadUserSuccess: createAction('[Auth] Load User Success', props<{ user: User }>()),
};

export const authReducer = createReducer(authInitial,
  on(AuthActions.login,           s => ({ ...s, loading: true, error: null })),
  on(AuthActions.loginSuccess,    (s, { user, token }) => ({ ...s, user, token, role: user.role as any, loading: false })),
  on(AuthActions.loginFailure,    (s, { error }) => ({ ...s, error, loading: false })),
  on(AuthActions.logout,          () => authInitial),
  on(AuthActions.loadUserSuccess, (s, { user }) => ({ ...s, user })),
);

const selectAuthState = createFeatureSelector<AuthState>('auth');
export const AuthSelectors = {
  user:    createSelector(selectAuthState, s => s.user),
  token:   createSelector(selectAuthState, s => s.token),
  role:    createSelector(selectAuthState, s => s.role),
  loading: createSelector(selectAuthState, s => s.loading),
  isLoggedIn: createSelector(selectAuthState, s => !!s.token),
};

// ════════════════════════════════════════════════════════════
// FLIGHTS STORE
// ════════════════════════════════════════════════════════════
export interface FlightState {
  searchCriteria: any;
  results:        any[];
  selectedFlight: any;
  loading:        boolean;
  error:          string | null;
}

const flightInitial: FlightState = {
  searchCriteria: null, results: [], selectedFlight: null, loading: false, error: null
};

export const FlightStoreActions = {
  searchFlights:        createAction('[Flights] Search',         props<{ criteria: any }>()),
  searchFlightsSuccess: createAction('[Flights] Search Success', props<{ results: any[] }>()),
  searchFlightsFailure: createAction('[Flights] Search Failure', props<{ error: string }>()),
  selectFlight:         createAction('[Flights] Select',         props<{ flight: any }>()),
  clearFlights:         createAction('[Flights] Clear'),
};

export const flightStoreReducer = createReducer(flightInitial,
  on(FlightStoreActions.searchFlights,        (s, { criteria }) => ({ ...s, searchCriteria: criteria, loading: true, error: null })),
  on(FlightStoreActions.searchFlightsSuccess, (s, { results })  => ({ ...s, results, loading: false })),
  on(FlightStoreActions.searchFlightsFailure, (s, { error })    => ({ ...s, error, loading: false })),
  on(FlightStoreActions.selectFlight,         (s, { flight })   => ({ ...s, selectedFlight: flight })),
  on(FlightStoreActions.clearFlights,         ()                 => flightInitial),
);

const selectFlightState = createFeatureSelector<FlightState>('flights');
export const FlightStoreSelectors = {
  results:        createSelector(selectFlightState, s => s.results),
  selectedFlight: createSelector(selectFlightState, s => s.selectedFlight),
  loading:        createSelector(selectFlightState, s => s.loading),
  criteria:       createSelector(selectFlightState, s => s.searchCriteria),
};

// ════════════════════════════════════════════════════════════
// CHECK-IN STORE
// ════════════════════════════════════════════════════════════
export interface CheckinState {
  pnr:         string | null;
  reservation: any | null;
  passengers:  any[];
  boardingPass: any | null;
  status:      'IDLE' | 'PNR_LOADED' | 'CHECKED_IN';
  loading:     boolean;
  error:       string | null;
}

const checkinInitial: CheckinState = {
  pnr: null, reservation: null, passengers: [], boardingPass: null,
  status: 'IDLE', loading: false, error: null
};

export const CheckinActions = {
  loadPnr:                    createAction('[Checkin] Load PNR',            props<{ pnr: string }>()),
  loadPnrSuccess:             createAction('[Checkin] Load PNR Success',    props<{ reservation: any }>()),
  loadPnrFailure:             createAction('[Checkin] Load PNR Failure',    props<{ error: string }>()),
  completeCheckin:            createAction('[Checkin] Complete',             props<{ payload: any }>()),
  completeCheckinSuccess:     createAction('[Checkin] Complete Success',    props<{ boardingPass: any }>()),
  completeCheckinFailure:     createAction('[Checkin] Complete Failure',    props<{ error: string }>()),
  resetCheckin:               createAction('[Checkin] Reset'),
};

export const checkinReducer = createReducer(checkinInitial,
  on(CheckinActions.loadPnr,                (s, { pnr }) => ({ ...s, pnr, loading: true, error: null })),
  on(CheckinActions.loadPnrSuccess,         (s, { reservation }) => ({ ...s, reservation, loading: false, status: 'PNR_LOADED' as const })),
  on(CheckinActions.loadPnrFailure,         (s, { error }) => ({ ...s, error, loading: false })),
  on(CheckinActions.completeCheckin,        s => ({ ...s, loading: true })),
  on(CheckinActions.completeCheckinSuccess, (s, { boardingPass }) => ({ ...s, boardingPass, loading: false, status: 'CHECKED_IN' as const })),
  on(CheckinActions.completeCheckinFailure, (s, { error }) => ({ ...s, error, loading: false })),
  on(CheckinActions.resetCheckin,           () => checkinInitial),
);

const selectCheckinState = createFeatureSelector<CheckinState>('checkin');
export const CheckinSelectors = {
  reservation:  createSelector(selectCheckinState, s => s.reservation),
  boardingPass: createSelector(selectCheckinState, s => s.boardingPass),
  status:       createSelector(selectCheckinState, s => s.status),
  loading:      createSelector(selectCheckinState, s => s.loading),
  pnr:          createSelector(selectCheckinState, s => s.pnr),
  error:        createSelector(selectCheckinState, s => s.error),
};

// ════════════════════════════════════════════════════════════
// OPERATIONS STORE
// ════════════════════════════════════════════════════════════
export interface OperationsState {
  flightStatuses: any[];
  delays:         any[];
  iropsEvents:    any[];
  analytics:      any | null;
  loading:        boolean;
  lastRefreshed:  string | null;
}

const opsInitial: OperationsState = {
  flightStatuses: [], delays: [], iropsEvents: [],
  analytics: null, loading: false, lastRefreshed: null
};

export const OperationsActions = {
  loadStatus:         createAction('[Ops] Load Status'),
  loadStatusSuccess:  createAction('[Ops] Load Status Success',  props<{ statuses: any[] }>()),
  loadDelays:         createAction('[Ops] Load Delays'),
  loadDelaysSuccess:  createAction('[Ops] Load Delays Success',  props<{ delays: any[] }>()),
  loadIrops:          createAction('[Ops] Load IROPS'),
  loadIropsSuccess:   createAction('[Ops] Load IROPS Success',   props<{ events: any[] }>()),
  loadAnalytics:      createAction('[Ops] Load Analytics'),
  loadAnalyticsSuccess: createAction('[Ops] Load Analytics Success', props<{ analytics: any }>()),
  updateFlightStatus: createAction('[Ops] Update Status',        props<{ flightId: string; status: string }>()),
};

export const operationsReducer = createReducer(opsInitial,
  on(OperationsActions.loadStatus,           s => ({ ...s, loading: true })),
  on(OperationsActions.loadStatusSuccess,    (s, { statuses }) => ({ ...s, flightStatuses: statuses, loading: false, lastRefreshed: new Date().toISOString() })),
  on(OperationsActions.loadDelaysSuccess,    (s, { delays })   => ({ ...s, delays })),
  on(OperationsActions.loadIropsSuccess,     (s, { events })   => ({ ...s, iropsEvents: events })),
  on(OperationsActions.loadAnalyticsSuccess, (s, { analytics }) => ({ ...s, analytics })),
  on(OperationsActions.updateFlightStatus,   (s, { flightId, status }) => ({
    ...s,
    flightStatuses: s.flightStatuses.map(f => f.flightId === flightId ? { ...f, status } : f)
  })),
);

const selectOpsState = createFeatureSelector<OperationsState>('operations');
export const OperationsSelectors = {
  flightStatuses: createSelector(selectOpsState, s => s.flightStatuses),
  delays:         createSelector(selectOpsState, s => s.delays),
  iropsEvents:    createSelector(selectOpsState, s => s.iropsEvents),
  analytics:      createSelector(selectOpsState, s => s.analytics),
  loading:        createSelector(selectOpsState, s => s.loading),
  lastRefreshed:  createSelector(selectOpsState, s => s.lastRefreshed),
  delayCount:     createSelector(selectOpsState, s => s.delays.length),
  iropsCount:     createSelector(selectOpsState, s => s.iropsEvents.length),
};

// ════════════════════════════════════════════════════════════
// ADMIN STORE
// ════════════════════════════════════════════════════════════
export interface AdminState {
  stats:    any | null;
  flights:  any[];
  aircraft: any[];
  airports: any[];
  crews:    any[];
  loading:  boolean;
}

const adminInitial: AdminState = {
  stats: null, flights: [], aircraft: [], airports: [], crews: [], loading: false
};

export const AdminActions = {
  loadStats:           createAction('[Admin] Load Stats'),
  loadStatsSuccess:    createAction('[Admin] Load Stats Success',    props<{ stats: any }>()),
  loadFlights:         createAction('[Admin] Load Flights'),
  loadFlightsSuccess:  createAction('[Admin] Load Flights Success',  props<{ flights: any[] }>()),
  createFlight:        createAction('[Admin] Create Flight',          props<{ flight: any }>()),
  updateFlight:        createAction('[Admin] Update Flight',          props<{ id: string; flight: any }>()),
  deleteFlight:        createAction('[Admin] Delete Flight',          props<{ id: string }>()),
  deleteFlightSuccess: createAction('[Admin] Delete Flight Success',  props<{ id: string }>()),
  loadAircraft:        createAction('[Admin] Load Aircraft'),
  loadAircraftSuccess: createAction('[Admin] Load Aircraft Success',  props<{ aircraft: any[] }>()),
  loadAirports:        createAction('[Admin] Load Airports'),
  loadAirportsSuccess: createAction('[Admin] Load Airports Success',  props<{ airports: any[] }>()),
  loadCrew:            createAction('[Admin] Load Crew'),
  loadCrewSuccess:     createAction('[Admin] Load Crew Success',      props<{ crews: any[] }>()),
};

export const adminReducer = createReducer(adminInitial,
  on(AdminActions.loadStats,           s => ({ ...s, loading: true })),
  on(AdminActions.loadStatsSuccess,    (s, { stats })    => ({ ...s, stats, loading: false })),
  on(AdminActions.loadFlightsSuccess,  (s, { flights })  => ({ ...s, flights })),
  on(AdminActions.loadAircraftSuccess, (s, { aircraft }) => ({ ...s, aircraft })),
  on(AdminActions.loadAirportsSuccess, (s, { airports }) => ({ ...s, airports })),
  on(AdminActions.loadCrewSuccess,     (s, { crews })    => ({ ...s, crews })),
  on(AdminActions.deleteFlightSuccess, (s, { id })       => ({ ...s, flights: s.flights.filter((f: any) => f.id !== id) })),
);

const selectAdminState = createFeatureSelector<AdminState>('admin');
export const AdminSelectors = {
  stats:    createSelector(selectAdminState, s => s.stats),
  flights:  createSelector(selectAdminState, s => s.flights),
  aircraft: createSelector(selectAdminState, s => s.aircraft),
  airports: createSelector(selectAdminState, s => s.airports),
  crews:    createSelector(selectAdminState, s => s.crews),
  loading:  createSelector(selectAdminState, s => s.loading),
};
