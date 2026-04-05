import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';

// ─── Import JSON data ────────────────────────────────────────
import flightsData from '../../../assets/mock/flights/flights.json';
import seatMapData from '../../../assets/mock/inventory/seat_map.json';
import reservationsData from '../../../assets/mock/reservations/reservations.json';
import operationsData from '../../../assets/mock/operations/operations.json';
import adminData from '../../../assets/mock/admin/admin.json';
import loyaltyData from '../../../assets/mock/loyalty/loyalty.json';

/**
 * MockInterceptor — intercepts HTTP calls when environment.useMock = true
 * and returns realistic mock responses with simulated network delay.
 *
 * Route matching:
 *   GET  /api/flights/search        → flight search results
 *   GET  /api/flights/airports      → airport autocomplete
 *   GET  /api/inventory/seat-map/*  → seat map for a flight
 *   POST /api/auth/login            → mock JWT login
 *   POST /api/auth/register         → mock JWT register
 *   GET  /api/auth/profile          → logged-in user profile
 *   GET  /api/reservations/my-bookings → passenger bookings
 *   POST /api/reservations          → create PNR
 *   POST /api/payments/initiate     → process payment
 *   GET  /api/tickets/reservation/* → tickets for reservation
 *   GET  /api/operations/status     → flight operations board
 *   GET  /api/operations/delays     → active delays
 *   GET  /api/operations/irops      → IROPS events
 *   GET  /api/admin/stats           → admin dashboard stats
 *   GET  /api/admin/aircraft        → aircraft list
 *   GET  /api/admin/airports        → airports list
 *   GET  /api/loyalty               → loyalty account
 *   GET  /api/loyalty/transactions  → point transactions
 *   GET  /api/loyalty/rewards       → rewards catalogue
 *   GET  /api/checkin/pnr/*         → check-in lookup
 *   POST /api/checkin               → complete check-in
 */
@Injectable()
export class MockInterceptor implements HttpInterceptor {
  private NETWORK_DELAY = 600; // ms — simulate realistic latency

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const url = req.url;
    const method = req.method;

    const isLiveAdminRoute =
      url.includes('/api/admin/dashboard') ||
      url.includes('/api/admin/stats') ||
      url.includes('/api/admin/aircraft') ||
      url.includes('/api/admin/airports') ||
      url.includes('/api/admin/crew');

    // 2. NEW: Add Flight Bypass
    const isLiveFlightRoute =
      url.includes('/api/flights') ||
      url.includes('/api/flights/search') ||
      url.includes('/api/flights/airports') ||
      (url.endsWith('/api/flights') && method === 'GET');

    // 3. NEW: Add Inventory Bypass
    const isLiveInventoryRoute = url.includes('/api/inventory');

    // 3. Let both Admin and Flight routes pass through to the Gateway
    if (isLiveAdminRoute || isLiveFlightRoute || isLiveInventoryRoute) {
      return next.handle(req); // Forward to Gateway (localhost:8080)
    }

    if (url.includes('/api/tickets') && url.includes('/pdf')) {
      const blob = new Blob(['PDF mock content'], { type: 'application/pdf' });
      return of(new HttpResponse({ status: 200, body: blob }));
    }

    // ── Auth ──────────────────────────────────────────────────
    if (url.includes('/api/auth/login') && method === 'POST') {
      return this.respond(this.mockLogin(req.body as any));
    }
    if (url.includes('/api/auth/register') && method === 'POST') {
      return this.respond(this.mockRegister(req.body as any));
    }
    if (url.includes('/api/auth/refresh') && method === 'POST') {
      return this.respond(this.mockRefresh());
    }
    if (url.includes('/api/auth/profile')) {
      return this.respond(this.mockProfile());
    }

    // ── Flights ───────────────────────────────────────────────
    if (url.includes('/api/flights/airports')) {
      const q = this.getQueryParam(url, 'q')?.toUpperCase() ?? '';
      const results = (flightsData as any).airports
        .filter(
          (a: any) =>
            a.code.includes(q) ||
            a.city.toUpperCase().includes(q) ||
            a.name.toUpperCase().includes(q),
        )
        .slice(0, 6);
      return this.respond(results);
    }
    if (url.includes('/api/flights/search')) {
      const flights = (flightsData as any).flights;
      return this.respond({
        outbound: flights,
        searchId: 'SRCH-' + Date.now(),
        currency: 'USD',
        totalResults: flights.length,
      });
    }
    if (url.match(/\/api\/flights\/[A-Z0-9]+$/)) {
      const id = url.split('/').pop();
      const flight = (flightsData as any).flights.find((f: any) => f.id === id);
      return this.respond(flight ?? null, !!flight ? 200 : 404);
    }

    // ── Inventory ─────────────────────────────────────────────
    if (url.includes('/api/inventory/seat-map')) {
      const seatMap = (seatMapData as any).seatMaps[0];
      return this.respond(seatMap);
    }
    if (
      url.includes('/api/inventory/seats') &&
      url.includes('/lock') &&
      method === 'POST'
    ) {
      return this.respond({ success: true });
    }
    if (url.includes('/api/inventory/seats') && method === 'DELETE') {
      return this.respond({ success: true });
    }

    // ── Reservations ──────────────────────────────────────────
    if (url.includes('/api/reservations/my-bookings')) {
      return this.respond((reservationsData as any).reservations);
    }
    if (url.includes('/api/reservations/pnr/')) {
      const pnr = url.split('/').pop();
      const res = (reservationsData as any).reservations.find(
        (r: any) => r.pnr === pnr,
      );
      return this.respond(res ?? null, res ? 200 : 404);
    }
    if (
      url.match(/\/api\/reservations\/[A-Z0-9]+$/) &&
      method === 'POST' &&
      url.includes('/cancel')
    ) {
      return this.respond({ ...this.mockReservation(), status: 'CANCELLED' });
    }
    if (url.match(/\/api\/reservations\/[A-Z0-9]+$/) && method === 'GET') {
      return this.respond((reservationsData as any).reservations[0]);
    }
    if (url.includes('/api/reservations') && method === 'POST') {
      return this.respond(this.mockReservation(), 201);
    }

    // ── Payments ──────────────────────────────────────────────
    if (url.includes('/api/payments/initiate') && method === 'POST') {
      return this.respond(this.mockPayment(), 201, 1200); // longer delay
    }
    if (url.match(/\/api\/payments\/[A-Z0-9]+\/retry/)) {
      return this.respond(this.mockPayment());
    }
    if (url.match(/\/api\/payments\/[A-Z0-9]+$/)) {
      return this.respond(this.mockPayment());
    }

    // ── Ticketing ─────────────────────────────────────────────
    if (url.includes('/api/tickets/reservation/')) {
      return this.respond([this.mockTicket()]);
    }
    if (url.includes('/api/tickets') && url.includes('/pdf')) {
      const blob = new Blob(['PDF mock content'], { type: 'application/pdf' });
      return of(new HttpResponse({ status: 200, body: blob }));
    }
    if (url.match(/\/api\/tickets\/[A-Z0-9]+$/)) {
      return this.respond(this.mockTicket());
    }

    // ── Check-in ──────────────────────────────────────────────
    if (url.includes('/api/checkin/pnr/')) {
      const pnr = url.split('/').pop();
      const res = (reservationsData as any).reservations.find(
        (r: any) => r.pnr === pnr,
      );
      if (!res) return this.respond({ message: 'PNR not found' }, 404);
      return this.respond({
        reservation: res,
        eligible: true,
        message: 'Check-in open',
      });
    }
    if (url.includes('/api/checkin') && method === 'POST') {
      return this.respond(this.mockBoardingPass());
    }

    // ── Baggage ───────────────────────────────────────────────
    if (url.includes('/api/baggage/track')) {
      return this.respond(this.mockBaggageStatus());
    }
    if (url.includes('/api/baggage') && method === 'POST') {
      return this.respond({
        id: 'BG-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
        success: true,
      });
    }

    // ── Loyalty ───────────────────────────────────────────────
    if (url.includes('/api/loyalty/transactions')) {
      return this.respond((loyaltyData as any).transactions);
    }
    if (url.includes('/api/loyalty/rewards')) {
      return this.respond((loyaltyData as any).rewards);
    }
    if (url.includes('/api/loyalty/redeem') && method === 'POST') {
      return this.respond({ success: true, newBalance: 37850 });
    }
    if (url.includes('/api/loyalty')) {
      return this.respond({
        account: (loyaltyData as any).account,
        tiers: (loyaltyData as any).tiers,
      });
    }

    // ── Operations ────────────────────────────────────────────
    if (url.includes('/api/operations/delays')) {
      return this.respond((operationsData as any).delays);
    }
    if (url.includes('/api/operations/irops')) {
      return this.respond((operationsData as any).iropsEvents);
    }
    if (url.includes('/api/operations/analytics')) {
      return this.respond((operationsData as any).analytics);
    }
    if (url.includes('/api/operations/status')) {
      return this.respond((operationsData as any).flightStatuses);
    }
    if (
      url.includes('/api/operations') &&
      url.includes('/delay') &&
      method === 'POST'
    ) {
      return this.respond({ id: 'DLY-' + Date.now(), success: true });
    }

    // ── Admin ─────────────────────────────────────────────────
    if (url.includes('/api/admin/stats')) {
      return this.respond((adminData as any).adminStats);
    }
    if (url.includes('/api/admin/aircraft') && method === 'GET') {
      return this.respond((adminData as any).aircraft);
    }
    if (url.includes('/api/admin/airports') && method === 'GET') {
      return this.respond((adminData as any).airports);
    }
    if (url.includes('/api/admin/crew')) {
      return this.respond((adminData as any).crews);
    }
    if (url.includes('/api/admin/flights') && method === 'GET') {
      return this.respond((flightsData as any).flights);
    }
    if (
      url.includes('/api/admin/flights') &&
      (method === 'POST' || method === 'PUT')
    ) {
      return this.respond({ ...(req.body as any), id: 'FL' + Date.now() });
    }
    if (url.includes('/api/admin/flights') && method === 'DELETE') {
      return this.respond({ success: true });
    }
    if (
      url.includes('/api/admin/aircraft') &&
      (method === 'POST' || method === 'PUT')
    ) {
      return this.respond({ ...(req.body as any), id: 'AC' + Date.now() });
    }

    // ── Popular routes ────────────────────────────────────────
    if (url.includes('/api/flights/popular-routes')) {
      return this.respond([
        { origin: 'JFK', destination: 'LHR', price: 490 },
        { origin: 'DXB', destination: 'BOM', price: 240 },
        { origin: 'SIN', destination: 'SYD', price: 680 },
        { origin: 'CDG', destination: 'NRT', price: 890 },
      ]);
    }

    // Pass-through for anything not mocked
    return next.handle(req);
  }

  // ─── Helpers ──────────────────────────────────────────────────

  private respond<T>(
    body: T,
    status = 200,
    networkDelay?: number,
  ): Observable<HttpEvent<T>> {
    return of(new HttpResponse({ status, body })).pipe(
      delay(networkDelay ?? this.NETWORK_DELAY),
    );
  }

  private getQueryParam(url: string, param: string): string | null {
    const match = url.match(new RegExp(`[?&]${param}=([^&]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  }

  // ─── Mock entity builders ─────────────────────────────────────

  private mockLogin(body: any) {
    const token =
      'mock.jwt.' +
      btoa(
        JSON.stringify({
          sub: 'USR001',
          role: 'PASSENGER',
          exp: Date.now() + 3600000,
        }),
      );
    return {
      user: {
        id: 'USR001',
        email: body?.email ?? 'user@skyway.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'PASSENGER',
        phone: '+1-555-0101',
        createdAt: '2023-01-01',
      },
      tokens: {
        accessToken: token,
        refreshToken: 'mock.refresh.' + Date.now(),
        expiresIn: 3600,
      },
    };
  }

  private mockRegister(body: any) {
    const token =
      'mock.jwt.' +
      btoa(JSON.stringify({ sub: 'USR' + Date.now(), role: 'PASSENGER' }));
    return {
      user: {
        id: 'USR' + Date.now(),
        email: body?.email,
        firstName: body?.firstName,
        lastName: body?.lastName,
        role: 'PASSENGER',
        createdAt: new Date().toISOString(),
      },
      tokens: {
        accessToken: token,
        refreshToken: 'mock.refresh.' + Date.now(),
        expiresIn: 3600,
      },
    };
  }

  private mockRefresh() {
    return {
      accessToken: 'mock.jwt.refreshed.' + Date.now(),
      refreshToken: 'mock.refresh.' + Date.now(),
    };
  }

  private mockProfile() {
    return {
      id: 'USR001',
      email: 'john.doe@email.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'PASSENGER',
      phone: '+1-555-0101',
      createdAt: '2023-01-01',
    };
  }

  private mockReservation() {
    const pnr = 'SKY' + Math.random().toString(36).substr(2, 4).toUpperCase();
    return {
      id: 'RES' + Date.now(),
      pnr,
      status: 'CONFIRMED',
      userId: 'USR001',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      pricing: {
        baseFare: 580,
        taxes: [{ code: 'YQ', name: 'Fuel surcharge', amount: 45 }],
        seatCharges: 25,
        baggageCharges: 0,
        serviceFee: 9.99,
        discount: 0,
        totalAmount: 659.99,
        currency: 'USD',
      },
    };
  }

  private mockPayment() {
    return {
      paymentId: 'PAY' + Date.now(),
      reservationId: 'RES001',
      status: 'SUCCESS',
      amount: 659.99,
      currency: 'USD',
      transactionRef:
        'TXN' + Math.random().toString(36).substr(2, 10).toUpperCase(),
      paidAt: new Date().toISOString(),
      message: 'Payment successful',
    };
  }

  private mockTicket() {
    return {
      id: 'TKT' + Date.now(),
      ticketNumber: '098' + Math.floor(Math.random() * 900000 + 100000),
      pnr: 'SKY7X2',
      reservationId: 'RES001',
      status: 'ISSUED',
      issuedAt: new Date().toISOString(),
      qrCode: 'MOCK_QR_CODE_DATA',
    };
  }

  private mockBoardingPass() {
    return {
      pnr: 'SKY7X2',
      status: 'CHECKED_IN',
      boardingPasses: [
        {
          passengerId: 'PAX001',
          passengerName: 'John Doe',
          flightNumber: 'SW101',
          origin: 'JFK',
          destination: 'LHR',
          departureDate: '2026-04-15',
          departureTime: '08:30',
          seatNumber: '12A',
          gate: 'B12',
          terminal: 'T4',
          boardingGroup: 'A',
          boardingTime: '07:45',
          qrCode: 'SKY7X2-PAX001-SW101-12A',
        },
      ],
    };
  }

  private mockBaggageStatus() {
    return {
      tagNumber: 'BG-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
      pnr: 'SKY7X2',
      weight: 22.5,
      status: 'IN_TRANSIT',
      timeline: [
        {
          event: 'CHECKED_IN',
          location: 'JFK T4 Check-in',
          timestamp: '2026-04-15T06:30:00',
          completed: true,
        },
        {
          event: 'SECURITY_CLEARED',
          location: 'JFK Security',
          timestamp: '2026-04-15T07:00:00',
          completed: true,
        },
        {
          event: 'LOADED',
          location: 'JFK Baggage Hold',
          timestamp: '2026-04-15T08:00:00',
          completed: true,
        },
        {
          event: 'IN_TRANSIT',
          location: 'On Board SW101',
          timestamp: '2026-04-15T08:30:00',
          completed: true,
        },
        {
          event: 'ARRIVED',
          location: 'LHR T4',
          timestamp: '2026-04-15T20:45:00',
          completed: false,
        },
        {
          event: 'DELIVERED',
          location: 'LHR Baggage Claim Belt 6',
          timestamp: '2026-04-15T21:15:00',
          completed: false,
        },
      ],
    };
  }
}
