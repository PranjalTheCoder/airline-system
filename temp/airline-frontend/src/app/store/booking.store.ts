import { createAction, props, createReducer, on, createSelector, createFeatureSelector } from '@ngrx/store';
import {
  BookingState, BookingStep, Flight, FlightSearchParams,
  Passenger, SeatSelection, PricingBreakdown
} from '../core/models';

/* ─── Initial State ─────────────────────── */
export const initialBookingState: BookingState = {
  searchParams:             null,
  selectedOutboundFlight:   null,
  selectedInboundFlight:    null,
  selectedCabinClass:       'ECONOMY',
  selectedSeats:            [],
  passengers:               [],
  contactEmail:             '',
  contactPhone:             '',
  reservationId:            null,
  pnr:                      null,
  pricing:                  null,
  currentStep:              'SEARCH',
};

/* ─── Actions ───────────────────────────── */
export const BookingActions = {
  setSearchParams:       createAction('[Booking] Set Search Params',        props<{ params: FlightSearchParams }>()),
  selectOutboundFlight:  createAction('[Booking] Select Outbound Flight',   props<{ flight: Flight; cabinClass: string }>()),
  selectInboundFlight:   createAction('[Booking] Select Inbound Flight',    props<{ flight: Flight }>()),
  setSeats:              createAction('[Booking] Set Seat Selections',       props<{ seats: SeatSelection[] }>()),
  addSeat:               createAction('[Booking] Add Seat',                  props<{ seat: SeatSelection }>()),
  removeSeat:            createAction('[Booking] Remove Seat',               props<{ seatId: string }>()),
  setPassengers:         createAction('[Booking] Set Passengers',            props<{ passengers: Passenger[] }>()),
  setContactInfo:        createAction('[Booking] Set Contact Info',          props<{ email: string; phone: string }>()),
  setReservation:        createAction('[Booking] Set Reservation',           props<{ reservationId: string; pnr: string; pricing: PricingBreakdown }>()),
  setStep:               createAction('[Booking] Set Step',                  props<{ step: BookingStep }>()),
  resetBooking:          createAction('[Booking] Reset'),
};

/* ─── Reducer ───────────────────────────── */
export const bookingReducer = createReducer(
  initialBookingState,

  on(BookingActions.setSearchParams, (state, { params }) => ({
    ...state, searchParams: params, currentStep: 'RESULTS' as BookingStep
  })),

  on(BookingActions.selectOutboundFlight, (state, { flight, cabinClass }) => ({
    ...state,
    selectedOutboundFlight: flight,
    selectedCabinClass: cabinClass,
    currentStep: 'SEATS' as BookingStep
  })),

  on(BookingActions.selectInboundFlight, (state, { flight }) => ({
    ...state, selectedInboundFlight: flight
  })),

  on(BookingActions.setSeats, (state, { seats }) => ({
    ...state, selectedSeats: seats, currentStep: 'PASSENGERS' as BookingStep
  })),

  on(BookingActions.addSeat, (state, { seat }) => ({
    ...state,
    selectedSeats: [...state.selectedSeats.filter(s => s.passengerId !== seat.passengerId), seat]
  })),

  on(BookingActions.removeSeat, (state, { seatId }) => ({
    ...state,
    selectedSeats: state.selectedSeats.filter(s => s.seatId !== seatId)
  })),

  on(BookingActions.setPassengers, (state, { passengers }) => ({
    ...state, passengers, currentStep: 'REVIEW' as BookingStep
  })),

  on(BookingActions.setContactInfo, (state, { email, phone }) => ({
    ...state, contactEmail: email, contactPhone: phone
  })),

  on(BookingActions.setReservation, (state, { reservationId, pnr, pricing }) => ({
    ...state, reservationId, pnr, pricing, currentStep: 'PAYMENT' as BookingStep
  })),

  on(BookingActions.setStep, (state, { step }) => ({
    ...state, currentStep: step
  })),

  on(BookingActions.resetBooking, () => initialBookingState),
);

/* ─── Selectors ─────────────────────────── */
export const selectBookingState = createFeatureSelector<BookingState>('booking');

export const BookingSelectors = {
  searchParams:           createSelector(selectBookingState, s => s.searchParams),
  selectedOutbound:       createSelector(selectBookingState, s => s.selectedOutboundFlight),
  selectedInbound:        createSelector(selectBookingState, s => s.selectedInboundFlight),
  cabinClass:             createSelector(selectBookingState, s => s.selectedCabinClass),
  selectedSeats:          createSelector(selectBookingState, s => s.selectedSeats),
  passengers:             createSelector(selectBookingState, s => s.passengers),
  contactEmail:           createSelector(selectBookingState, s => s.contactEmail),
  contactPhone:           createSelector(selectBookingState, s => s.contactPhone),
  reservationId:          createSelector(selectBookingState, s => s.reservationId),
  pnr:                    createSelector(selectBookingState, s => s.pnr),
  pricing:                createSelector(selectBookingState, s => s.pricing),
  currentStep:            createSelector(selectBookingState, s => s.currentStep),
  passengerCount:         createSelector(selectBookingState, s =>
    (s.searchParams?.adults ?? 0) + (s.searchParams?.children ?? 0)
  ),
};
