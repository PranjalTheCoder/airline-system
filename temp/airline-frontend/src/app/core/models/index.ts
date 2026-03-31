/* ═══════════════════════════════════════════
   AUTH MODELS
═══════════════════════════════════════════ */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'PASSENGER' | 'ADMIN' | 'AGENT';
  phone?: string;
  dateOfBirth?: string;
  passportNumber?: string;
  nationality?: string;
  profileImage?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

/* ═══════════════════════════════════════════
   FLIGHT MODELS
═══════════════════════════════════════════ */
export interface Airport {
  code: string;       // IATA e.g. "LHR"
  name: string;
  city: string;
  country: string;
  timezone: string;
}

export interface Flight {
  id: string;
  flightNumber: string;        // e.g. "SW 204"
  airline: string;
  airlineCode: string;
  aircraftType: string;
  origin: Airport;
  destination: Airport;
  departureTime: string;       // ISO 8601
  arrivalTime: string;
  durationMinutes: number;
  stops: number;               // 0 = direct
  cabinClasses: CabinClass[];
  status: FlightStatus;
  amenities: string[];
}

export type FlightStatus = 'SCHEDULED' | 'DELAYED' | 'CANCELLED' | 'DEPARTED' | 'ARRIVED';

export interface CabinClass {
  type: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  basePrice: number;
  currency: string;
  availableSeats: number;
  totalSeats: number;
  baggage: BaggageAllowance;
}

export interface BaggageAllowance {
  cabin: string;     // e.g. "1 x 7kg"
  checked: string;   // e.g. "1 x 23kg"
}

export interface FlightSearchParams {
  origin: string;        // IATA code
  destination: string;
  departureDate: string; // YYYY-MM-DD
  returnDate?: string;
  tripType: 'ONE_WAY' | 'ROUND_TRIP';
  adults: number;
  children: number;
  infants: number;
  cabinClass: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
}

export interface FlightSearchResult {
  outbound: Flight[];
  inbound?: Flight[];
  searchId: string;
  currency: string;
  totalResults: number;
}

export interface FlightFilter {
  maxPrice?: number;
  stops?: number[];       // [0] = direct only, [0,1] = direct + 1 stop
  departureTimeRange?: [number, number]; // hours [6, 18]
  airlines?: string[];
  maxDuration?: number;   // minutes
}

export interface FlightSort {
  field: 'price' | 'duration' | 'departure' | 'arrival';
  direction: 'asc' | 'desc';
}

/* ═══════════════════════════════════════════
   INVENTORY / SEAT MODELS
═══════════════════════════════════════════ */
export interface SeatMap {
  flightId: string;
  aircraft: string;
  cabinClass: string;
  rows: SeatRow[];
  legend: SeatLegend;
}

export interface SeatRow {
  rowNumber: number;
  seats: Seat[];
  isExitRow: boolean;
}

export interface Seat {
  id: string;
  seatNumber: string;  // e.g. "12A"
  row: number;
  column: string;      // A,B,C,aisle,D,E,F
  status: SeatStatus;
  type: SeatType;
  price: number;
  currency: string;
  features: SeatFeature[];
}

export type SeatStatus = 'AVAILABLE' | 'OCCUPIED' | 'SELECTED' | 'BLOCKED';
export type SeatType   = 'STANDARD' | 'EXTRA_LEGROOM' | 'PREMIUM' | 'WINDOW' | 'AISLE';
export type SeatFeature = 'WINDOW' | 'EXTRA_LEGROOM' | 'RECLINE' | 'BULKHEAD' | 'EXIT_ROW';

export interface SeatLegend {
  available: string;
  occupied: string;
  selected: string;
  premium: string;
}

/* ═══════════════════════════════════════════
   PASSENGER & RESERVATION MODELS
═══════════════════════════════════════════ */
export interface Passenger {
  id?: string;
  type: 'ADULT' | 'CHILD' | 'INFANT';
  title: 'Mr' | 'Mrs' | 'Ms' | 'Dr';
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
  email?: string;
  phone?: string;
  mealPreference?: MealPreference;
  specialAssistance?: string;
  selectedSeatId?: string;
  selectedSeatNumber?: string;
}

export type MealPreference = 'STANDARD' | 'VEGETARIAN' | 'VEGAN' | 'HALAL' | 'KOSHER' | 'GLUTEN_FREE';

export interface Reservation {
  id: string;
  pnr: string;
  status: ReservationStatus;
  userId: string;
  outboundFlight: Flight;
  inboundFlight?: Flight;
  passengers: Passenger[];
  cabinClass: string;
  contactEmail: string;
  contactPhone: string;
  pricing: PricingBreakdown;
  createdAt: string;
  expiresAt: string;
}

export type ReservationStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'TICKETED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface PricingBreakdown {
  baseFare: number;
  taxes: TaxItem[];
  seatCharges: number;
  baggageCharges: number;
  serviceFee: number;
  discount: number;
  totalAmount: number;
  currency: string;
}

export interface TaxItem {
  code: string;
  name: string;
  amount: number;
}

export interface CreateReservationRequest {
  outboundFlightId: string;
  inboundFlightId?: string;
  cabinClass: string;
  passengers: Passenger[];
  contactEmail: string;
  contactPhone: string;
  seatSelections?: SeatSelection[];
}

export interface SeatSelection {
  passengerId: string;
  seatId: string;
}

/* ═══════════════════════════════════════════
   PAYMENT MODELS
═══════════════════════════════════════════ */
export interface PaymentMethod {
  type: 'CREDIT_CARD' | 'DEBIT_CARD' | 'UPI' | 'NET_BANKING' | 'WALLET';
  label: string;
  icon: string;
}

export interface CardDetails {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface PaymentRequest {
  reservationId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod['type'];
  cardDetails?: CardDetails;
  upiId?: string;
  bankCode?: string;
}

export interface PaymentResponse {
  paymentId: string;
  reservationId: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  transactionRef: string;
  paidAt: string;
  message?: string;
}

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED' | 'CANCELLED';

/* ═══════════════════════════════════════════
   TICKET MODELS
═══════════════════════════════════════════ */
export interface Ticket {
  id: string;
  ticketNumber: string;
  pnr: string;
  reservationId: string;
  passenger: Passenger;
  flight: Flight;
  seatNumber: string;
  cabinClass: string;
  baggage: BaggageAllowance;
  status: TicketStatus;
  issuedAt: string;
  qrCode?: string;
  barcode?: string;
}

export type TicketStatus = 'ISSUED' | 'CHECKED_IN' | 'BOARDED' | 'CANCELLED';

/* ═══════════════════════════════════════════
   SHARED / API MODELS
═══════════════════════════════════════════ */
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  timestamp: string;
}

/* ═══════════════════════════════════════════
   BOOKING STATE (Global)
═══════════════════════════════════════════ */
export interface BookingState {
  searchParams: FlightSearchParams | null;
  selectedOutboundFlight: Flight | null;
  selectedInboundFlight:  Flight | null;
  selectedCabinClass: string;
  selectedSeats: SeatSelection[];
  passengers: Passenger[];
  contactEmail: string;
  contactPhone: string;
  reservationId: string | null;
  pnr: string | null;
  pricing: PricingBreakdown | null;
  currentStep: BookingStep;
}

export type BookingStep = 'SEARCH' | 'RESULTS' | 'SEATS' | 'PASSENGERS' | 'REVIEW' | 'PAYMENT' | 'CONFIRMATION';
