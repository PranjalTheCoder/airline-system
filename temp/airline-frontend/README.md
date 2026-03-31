# ✈ SkyWay Airlines — Enterprise PSS Frontend

> Angular 17 + NgRx + Tailwind CSS | Full Passenger Service System UI

---

## 🚀 Quick Start

```bash
# 1. Clone / unzip the project
cd airline-frontend

# 2. Install dependencies
npm install

# 3. Start with mock backend (no real services needed)
ng serve
# → http://localhost:4200

# 4. When your microservices are running, flip mock off:
# src/environments/environment.ts → useMock: false
# Then start with proxy:
npm start   # uses proxy.conf.json
```

---

## 🧭 All Routes

| Route | Page | Auth Required |
|-------|------|---------------|
| `/` | Home / Flight Search | No |
| `/results` | Flight Results + Filters | No |
| `/seats` | Seat Map Selection | ✅ |
| `/passengers` | Passenger Details Form | ✅ |
| `/review` | Booking Review + PNR | ✅ |
| `/payment` | Payment (Card/UPI/NetBanking) | ✅ |
| `/ticket` | Boarding Pass / Confirmation | ✅ |
| `/my-bookings` | Manage Bookings | ✅ |
| `/profile` | User Profile | ✅ |
| `/checkin` | Web Check-in + Boarding Pass | No |
| `/baggage/track` | Baggage Status Timeline | No |
| `/loyalty` | Frequent Flyer Dashboard | No |
| `/operations` | Ops Control (Flight FIDS) | No |
| `/admin` | Admin Dashboard + CRUD | No |
| `/auth/login` | Login | No |
| `/auth/register` | Register | No |

---

## 🏗 Architecture

```
src/app/
│
├── core/
│   ├── interceptors/
│   │   ├── mock.interceptor.ts     ← intercepts all /api/* calls with mock data
│   │   ├── jwt.interceptor.ts      ← attaches Bearer token + auto-refresh
│   │   └── error.interceptor.ts   ← global error handling
│   ├── guards/
│   │   └── auth.guard.ts           ← authGuard + guestGuard
│   ├── models/
│   │   └── index.ts                ← all TypeScript interfaces (Flight, Passenger, Booking…)
│   └── services/
│       ├── auth-storage.service.ts
│       └── toast.service.ts
│
├── store/
│   ├── booking.store.ts            ← booking flow NgRx (actions, reducer, selectors)
│   └── feature.stores.ts          ← auth, flights, checkin, operations, admin stores
│
├── layouts/
│   ├── main-layout/                ← header + footer wrapper
│   └── auth-layout/               ← split-panel login/register
│
├── shared/components/
│   ├── header/                     ← dark navbar, scroll effect, user menu
│   ├── footer/
│   ├── toast/                      ← live notifications
│   └── step-progress/             ← 6-step booking progress bar
│
└── modules/
    ├── auth/         login, register, profile
    ├── flight/       search (hero), results (filters + sort)
    ├── inventory/    seat map (visual grid)
    ├── reservation/  passenger forms, review, manage-booking
    ├── payment/      card + UPI + net banking
    ├── ticketing/    boarding pass confirmation
    ├── checkin/      PNR lookup → boarding pass generation
    ├── baggage/      baggage status timeline
    ├── loyalty/      FF points, tier, rewards, transactions
    ├── operations/   FIDS board, delays, IROPS, OTP chart
    └── admin/        flight/aircraft/airport/crew CRUD
```

---

## 🔌 Mock Backend

The `MockInterceptor` intercepts **all `/api/*` calls** and returns realistic JSON from:

```
src/assets/mock/
├── flights/flights.json      ← 6 flights (B787, A380, A350, B777, A321)
├── inventory/seat_map.json   ← full seat grid (exit rows, premium, occupied)
├── reservations/reservations.json
├── operations/operations.json ← flight statuses, delays, IROPS, analytics
├── admin/admin.json          ← aircraft fleet, airports, crew roster
└── loyalty/loyalty.json      ← FF account, tiers, rewards, transactions
```

**To switch to real backend:**
1. Set `useMock: false` in `environment.ts`
2. Run `npm start` (uses `proxy.conf.json`)
3. Each microservice port is configured in `proxy.conf.json`

---

## 🎨 Design System

Global CSS variables in `src/styles.scss`:

| Token | Value | Usage |
|-------|-------|-------|
| `--sky-900` | `#0a0f1e` | Dark navy (hero, header) |
| `--sky-500` | `#1d4ed8` | Primary blue (buttons, CTAs) |
| `--gold-400` | `#d4af37` | Accent gold (logo, prices) |
| `--font-display` | Playfair Display | Headings, times, IATA codes |
| `--font-body` | DM Sans | All body text |
| `--font-mono` | DM Mono | PNR, flight numbers, codes |

CSS utility classes: `.btn`, `.btn-primary`, `.btn-gold`, `.btn-outline`, `.card`, `.card-hover`, `.badge`, `.form-input`, `.form-label`, `.skeleton`, `.seat.*`

---

## 🧬 NgRx Store Shape

```typescript
{
  auth: {
    user, token, role, loading, error
  },
  flights: {
    searchCriteria, results, selectedFlight, loading, error
  },
  booking: {
    searchParams, selectedOutboundFlight, selectedInboundFlight,
    selectedCabinClass, selectedSeats, passengers,
    contactEmail, contactPhone, reservationId, pnr,
    pricing, currentStep
  },
  checkin: {
    pnr, reservation, boardingPass, status, loading, error
  },
  operations: {
    flightStatuses, delays, iropsEvents, analytics, loading, lastRefreshed
  },
  admin: {
    stats, flights, aircraft, airports, crews, loading
  }
}
```

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Angular 17 (standalone components) |
| State | NgRx 17 (Store + Effects + DevTools) |
| Styling | Tailwind CSS 3 + Custom SCSS design system |
| HTTP | Angular HttpClient + 3 interceptors |
| Fonts | Playfair Display + DM Sans + DM Mono |
| Testing | Jasmine + Karma + Cypress (e2e) |
| Build | Angular CLI + esbuild |

---

## 🔄 Booking Flow

```
/ (Search)
  → /results (select flight + cabin class)
    → /seats (seat map — auth required)
      → /passengers (multi-passenger reactive forms)
        → /review (itinerary + create PNR via API)
          → /payment (card/UPI/net banking)
            → /ticket (confirmation + boarding pass download)
```

Each step dispatches NgRx actions and updates the global `booking` state slice.

---

## 🔐 Authentication (Mock)

Login with any email + password → returns mock JWT.

Roles supported: `PASSENGER`, `ADMIN`, `STAFF`, `OPERATIONS_MANAGER`

JWT stored in `localStorage` as `sw_access_token`. The `JwtInterceptor` attaches it as `Authorization: Bearer <token>` to every request. Token auto-refresh on 401.

Demo credentials (mock always accepts):
- Email: `user@skyway.com` / Password: `anything`

---

## 📡 Microservice Port Map

| Service | Port |
|---------|------|
| auth-service | 8081 |
| flight-service | 8082 |
| inventory-service | 8083 |
| reservation-service | 8084 |
| payment-service | 8085 |
| ticketing-service | 8086 |
| checkin-service | 8087 |
| baggage-service | 8088 |
| loyalty-service | 8089 |
| operations-service | 8090 |
| admin-service | 8091 |

---

## 🧪 Demo Scenarios

| Scenario | Steps |
|----------|-------|
| Book a flight | `/` → search JFK→LHR → select → seats → passengers → review → payment |
| Web check-in | `/checkin` → enter PNR `SKY7X2` |
| Track baggage | `/baggage/track` → enter PNR `SKY7X2` |
| Loyalty account | `/loyalty` |
| Operations view | `/operations` |
| Admin panel | `/admin` |

---

## 🚀 Production Build

```bash
ng build --configuration production
# Output: dist/airline-frontend/
```

**Docker:**
```dockerfile
FROM nginx:alpine
COPY dist/airline-frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

---

*Built with Angular 17 standalone components, NgRx enterprise state management, and a premium airline design system.*
