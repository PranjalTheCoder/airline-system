import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, switchMap, of, catchError } from 'rxjs';
import { FlightService } from '../../services/flight.service';
import { BookingActions } from '../../../../store/booking.store';
import { FlightSearchParams } from '../../../../core/models';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-overlay"></div>

      <div class="container-app hero-content">
        <div class="hero-text animate-fade-in-up">
          <span class="hero-eyebrow">✈ Premium Airline Booking</span>
          <h1 class="hero-title">Where would you<br/>like to fly today?</h1>
          <p class="hero-subtitle">200+ destinations · Best fares guaranteed · Free cancellation</p>
        </div>

        <!-- Search Card -->
        <div class="search-card animate-fade-in-up" style="animation-delay: 100ms">

          <!-- Trip type tabs -->
          <div class="trip-tabs">
            <button class="trip-tab"
              [class.active]="tripType() === 'ONE_WAY'"
              (click)="setTripType('ONE_WAY')">One Way</button>
            <button class="trip-tab"
              [class.active]="tripType() === 'ROUND_TRIP'"
              (click)="setTripType('ROUND_TRIP')">Round Trip</button>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSearch()">
            <div class="search-row">

              <!-- Origin -->
              <div class="search-field" (click)="focusOrigin()">
                <div class="field-icon">🛫</div>
                <div class="field-body">
                  <label>From</label>
                  <input #originInput type="text" formControlName="origin"
                    class="field-input" placeholder="City or airport"
                    (input)="onOriginSearch($event)"
                    autocomplete="off" />
                  @if (originSuggestions().length > 0) {
                    <div class="suggestions">
                      @for (s of originSuggestions(); track s.code) {
                        <div class="suggestion-item" (click)="selectOrigin(s)">
                          <span class="iata-code">{{ s.code }}</span>
                          <span class="airport-name">{{ s.city }} — {{ s.name }}</span>
                        </div>
                      }
                    </div>
                  }
                </div>
              </div>

              <!-- Swap button -->
              <button type="button" class="swap-btn" (click)="swapRoutes()" title="Swap">
                ⇄
              </button>

              <!-- Destination -->
              <div class="search-field">
                <div class="field-icon">🛬</div>
                <div class="field-body">
                  <label>To</label>
                  <input type="text" formControlName="destination"
                    class="field-input" placeholder="City or airport"
                    (input)="onDestSearch($event)"
                    autocomplete="off" />
                  @if (destSuggestions().length > 0) {
                    <div class="suggestions">
                      @for (s of destSuggestions(); track s.code) {
                        <div class="suggestion-item" (click)="selectDest(s)">
                          <span class="iata-code">{{ s.code }}</span>
                          <span class="airport-name">{{ s.city }} — {{ s.name }}</span>
                        </div>
                      }
                    </div>
                  }
                </div>
              </div>

              <!-- Depart date -->
              <div class="search-field narrow">
                <div class="field-icon">📅</div>
                <div class="field-body">
                  <label>Depart</label>
                  <input type="date" formControlName="departureDate" class="field-input" [min]="today" />
                </div>
              </div>

              <!-- Return date (round trip) -->
              @if (tripType() === 'ROUND_TRIP') {
                <div class="search-field narrow">
                  <div class="field-icon">📅</div>
                  <div class="field-body">
                    <label>Return</label>
                    <input type="date" formControlName="returnDate" class="field-input" [min]="form.get('departureDate')?.value || today" />
                  </div>
                </div>
              }

              <!-- Passengers -->
              <div class="search-field narrow" (click)="togglePassengerPanel()">
                <div class="field-icon">👤</div>
                <div class="field-body">
                  <label>Passengers</label>
                  <div class="field-display">{{ passengerLabel() }}</div>
                  @if (passengerPanelOpen()) {
                    <div class="passenger-panel">
                      @for (type of passengerTypes; track type.key) {
                        <div class="pax-row">
                          <div>
                            <div class="pax-label">{{ type.label }}</div>
                            <div class="pax-sub">{{ type.sub }}</div>
                          </div>
                          <div class="pax-counter">
                            <button type="button" (click)="$event.stopPropagation(); decrement(type.key)">−</button>
                            <span>{{ form.get(type.key)?.value }}</span>
                            <button type="button" (click)="$event.stopPropagation(); increment(type.key)">+</button>
                          </div>
                        </div>
                      }
                    </div>
                  }
                </div>
              </div>

              <!-- Cabin class -->
              <div class="search-field narrow">
                <div class="field-icon">💺</div>
                <div class="field-body">
                  <label>Class</label>
                  <select formControlName="cabinClass" class="field-input field-select">
                    <option value="ECONOMY">Economy</option>
                    <option value="PREMIUM_ECONOMY">Prem. Economy</option>
                    <option value="BUSINESS">Business</option>
                    <option value="FIRST">First</option>
                  </select>
                </div>
              </div>

              <!-- Search button -->
              <button type="submit" class="search-btn" [disabled]="loading()">
                @if (loading()) {
                  <span class="btn-spinner"></span>
                } @else {
                  Search Flights
                }
              </button>

            </div>

            @if (formError()) {
              <p class="search-error">{{ formError() }}</p>
            }
          </form>
        </div>

        <!-- Popular destinations -->
        <div class="popular-routes animate-fade-in-up stagger" style="animation-delay: 200ms">
          <span class="popular-label">Popular routes:</span>
          @for (route of popularRoutes; track route.label) {
            <button class="route-pill" (click)="fillRoute(route)">
              {{ route.label }}
            </button>
          }
        </div>
      </div>
    </section>

    <!-- Features strip -->
    <section class="features-strip">
      <div class="container-app features-grid">
        @for (f of features; track f.icon) {
          <div class="feature-item">
            <span class="feature-icon">{{ f.icon }}</span>
            <div>
              <div class="feature-title">{{ f.title }}</div>
              <div class="feature-desc">{{ f.desc }}</div>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    /* ── Hero ── */
    .hero {
      position: relative;
      min-height: 640px;
      display: flex;
      align-items: center;
      overflow: hidden;
    }

    .hero-bg {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, #0a0f1e 0%, #0f1829 40%, #1a2540 70%, #1e3a6e 100%);
    }

    .hero-bg::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        radial-gradient(ellipse at 15% 50%, rgba(59,130,246,0.15) 0%, transparent 55%),
        radial-gradient(ellipse at 85% 20%, rgba(201,162,39,0.08) 0%, transparent 45%),
        url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.015'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }

    .hero-overlay { position: absolute; inset: 0; }

    .hero-content {
      position: relative;
      z-index: 1;
      padding-top: 80px;
      padding-bottom: 60px;
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .hero-text {
      color: #fff;
      max-width: 600px;
    }

    .hero-eyebrow {
      font-size: 13px;
      font-weight: 500;
      color: var(--gold-400);
      text-transform: uppercase;
      letter-spacing: 0.12em;
      display: block;
      margin-bottom: 16px;
    }

    .hero-title {
      font-family: var(--font-display);
      font-size: clamp(36px, 5vw, 56px);
      font-weight: 500;
      line-height: 1.1;
      margin: 0 0 16px;
      color: #fff;
    }

    .hero-subtitle {
      font-size: 16px;
      color: rgba(255,255,255,0.6);
      margin: 0;
    }

    /* ── Search Card ── */
    .search-card {
      background: #fff;
      border-radius: 20px;
      padding: 28px;
      box-shadow: 0 24px 80px rgba(0,0,0,0.35);
    }

    .trip-tabs {
      display: flex;
      gap: 4px;
      margin-bottom: 20px;
      background: var(--neutral-100);
      border-radius: 10px;
      padding: 4px;
      width: fit-content;
    }

    .trip-tab {
      padding: 8px 20px;
      border-radius: 8px;
      border: none;
      background: transparent;
      font-size: 14px;
      font-weight: 500;
      color: var(--neutral-600);
      cursor: pointer;
      transition: all 0.2s;
    }
    .trip-tab.active {
      background: #fff;
      color: var(--sky-500);
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }

    .search-row {
      display: flex;
      align-items: stretch;
      gap: 1px;
      background: var(--neutral-200);
      border: 1.5px solid var(--neutral-200);
      border-radius: 12px;
      overflow: visible;
    }

    .search-field {
      position: relative;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      background: #fff;
      flex: 1;
      cursor: text;
      transition: background 0.15s;
      min-width: 0;
    }
    .search-field:first-child { border-radius: 10px 0 0 10px; }
    .search-field.narrow { flex: 0 0 auto; min-width: 130px; }
    .search-field:hover { background: var(--neutral-50); }

    .field-icon { font-size: 18px; flex-shrink: 0; }

    .field-body {
      flex: 1;
      min-width: 0;
      position: relative;
    }

    .field-body label {
      display: block;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: var(--neutral-400);
      margin-bottom: 3px;
    }

    .field-input {
      width: 100%;
      border: none;
      outline: none;
      font-size: 15px;
      font-weight: 500;
      color: var(--neutral-900);
      background: transparent;
      padding: 0;
      font-family: var(--font-body);
    }
    .field-input::placeholder { color: var(--neutral-300); font-weight: 400; }

    .field-select {
      cursor: pointer;
      -webkit-appearance: none;
      appearance: none;
    }

    .field-display {
      font-size: 15px;
      font-weight: 500;
      color: var(--neutral-900);
      cursor: pointer;
    }

    /* Suggestions dropdown */
    .suggestions {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      right: 0;
      background: #fff;
      border: 1px solid var(--neutral-200);
      border-radius: 12px;
      box-shadow: var(--shadow-float);
      z-index: 200;
      overflow: hidden;
      min-width: 260px;
    }

    .suggestion-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 11px 14px;
      cursor: pointer;
      transition: background 0.15s;
    }
    .suggestion-item:hover { background: var(--neutral-50); }

    .iata-code {
      font-family: var(--font-mono);
      font-size: 13px;
      font-weight: 600;
      color: var(--sky-500);
      background: var(--sky-50);
      padding: 2px 6px;
      border-radius: 4px;
      flex-shrink: 0;
    }

    .airport-name { font-size: 13px; color: var(--neutral-600); }

    /* Swap button */
    .swap-btn {
      align-self: center;
      flex-shrink: 0;
      width: 32px; height: 32px;
      border-radius: 50%;
      border: 1.5px solid var(--neutral-200);
      background: #fff;
      font-size: 16px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      margin: 0 -16px;
      z-index: 1;
      position: relative;
    }
    .swap-btn:hover {
      background: var(--sky-50);
      border-color: var(--sky-400);
      color: var(--sky-500);
    }

    /* Passenger panel */
    .passenger-panel {
      position: absolute;
      top: calc(100% + 8px);
      left: 0;
      background: #fff;
      border: 1px solid var(--neutral-200);
      border-radius: 14px;
      box-shadow: var(--shadow-float);
      z-index: 200;
      min-width: 260px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .pax-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .pax-label { font-size: 14px; font-weight: 500; color: var(--neutral-800); }
    .pax-sub   { font-size: 12px; color: var(--neutral-400); }

    .pax-counter {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .pax-counter button {
      width: 28px; height: 28px;
      border-radius: 50%;
      border: 1.5px solid var(--neutral-300);
      background: #fff;
      font-size: 16px;
      font-weight: 500;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .pax-counter button:hover {
      border-color: var(--sky-400);
      background: var(--sky-50);
      color: var(--sky-500);
    }
    .pax-counter span {
      font-size: 16px;
      font-weight: 600;
      color: var(--neutral-900);
      min-width: 20px;
      text-align: center;
    }

    /* Search button */
    .search-btn {
      flex-shrink: 0;
      padding: 0 28px;
      background: var(--sky-500);
      color: #fff;
      border: none;
      border-radius: 0 10px 10px 0;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
      display: flex;
      align-items: center;
      gap: 8px;
      min-height: 56px;
    }
    .search-btn:hover:not(:disabled) { background: var(--sky-600); }
    .search-btn:disabled { opacity: 0.7; cursor: not-allowed; }

    .btn-spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      display: inline-block;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .search-error {
      color: var(--danger);
      font-size: 13px;
      margin: 10px 0 0;
    }

    /* Popular routes */
    .popular-routes {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .popular-label {
      font-size: 13px;
      color: rgba(255,255,255,0.5);
      flex-shrink: 0;
    }

    .route-pill {
      padding: 6px 14px;
      border-radius: 20px;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.15);
      color: rgba(255,255,255,0.8);
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .route-pill:hover {
      background: rgba(255,255,255,0.18);
      color: #fff;
    }

    /* ── Features Strip ── */
    .features-strip {
      background: #fff;
      border-bottom: 1px solid var(--neutral-200);
      padding: 24px 0;
    }

    .features-grid {
      display: flex;
      justify-content: space-around;
      gap: 24px;
      flex-wrap: wrap;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .feature-icon { font-size: 24px; }

    .feature-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--neutral-900);
    }

    .feature-desc {
      font-size: 12px;
      color: var(--neutral-400);
    }

    @media (max-width: 900px) {
      .search-row {
        flex-direction: column;
        gap: 0;
      }
      .search-field { border-radius: 0 !important; }
      .search-btn { border-radius: 0 0 10px 10px; }
      .swap-btn { display: none; }
      .search-field.narrow { min-width: unset; }
    }
  `]
})
export class SearchComponent implements OnInit {
  private fb      = inject(FormBuilder);
  private flight  = inject(FlightService);
  private store   = inject(Store);
  private router  = inject(Router);

  loading             = signal(false);
  formError           = signal('');
  originSuggestions   = signal<any[]>([]);
  destSuggestions     = signal<any[]>([]);
  tripType            = signal<'ONE_WAY' | 'ROUND_TRIP'>('ONE_WAY');
  passengerPanelOpen  = signal(false);

  today = new Date().toISOString().split('T')[0];

  passengerTypes = [
    { key: 'adults',   label: 'Adults',   sub: '12+ years' },
    { key: 'children', label: 'Children', sub: '2–11 years' },
    { key: 'infants',  label: 'Infants',  sub: 'Under 2' },
  ];

  popularRoutes = [
    { label: 'New York → London',  origin: 'JFK', dest: 'LHR' },
    { label: 'Dubai → Mumbai',     origin: 'DXB', dest: 'BOM' },
    { label: 'Singapore → Sydney', origin: 'SIN', dest: 'SYD' },
    { label: 'Paris → Tokyo',      origin: 'CDG', dest: 'NRT' },
  ];

  features = [
    { icon: '✅', title: 'Best Price Guarantee',   desc: 'We match any lower fare' },
    { icon: '🔄', title: 'Free Cancellation',       desc: 'Up to 24 hours before' },
    { icon: '🛡️', title: 'Secure Booking',          desc: 'SSL encrypted checkout' },
    { icon: '🎧', title: '24/7 Support',            desc: 'Always here to help' },
  ];

  form = this.fb.group({
    origin:        ['', Validators.required],
    destination:   ['', Validators.required],
    departureDate: ['', Validators.required],
    returnDate:    [''],
    adults:        [1],
    children:      [0],
    infants:       [0],
    cabinClass:    ['ECONOMY'],
  });

  ngOnInit() { this.form.get('departureDate')?.setValue(this.today); }

  setTripType(type: 'ONE_WAY' | 'ROUND_TRIP') {
    this.tripType.set(type);
    if (type === 'ONE_WAY') this.form.get('returnDate')?.setValue('');
  }

  onOriginSearch(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    if (val.length < 2) { this.originSuggestions.set([]); return; }
    this.flight.getAirports(val).subscribe({ next: r => this.originSuggestions.set(r), error: () => {} });
  }

  onDestSearch(e: Event) {
    const val = (e.target as HTMLInputElement).value;
    if (val.length < 2) { this.destSuggestions.set([]); return; }
    this.flight.getAirports(val).subscribe({ next: r => this.destSuggestions.set(r), error: () => {} });
  }

  selectOrigin(s: any) {
    this.form.get('origin')?.setValue(s.code);
    this.originSuggestions.set([]);
  }

  selectDest(s: any) {
    this.form.get('destination')?.setValue(s.code);
    this.destSuggestions.set([]);
  }

  swapRoutes() {
    const o = this.form.get('origin')?.value;
    const d = this.form.get('destination')?.value;
    this.form.get('origin')?.setValue(d ?? '');
    this.form.get('destination')?.setValue(o ?? '');
  }

  togglePassengerPanel() { this.passengerPanelOpen.update(v => !v); }

  increment(key: string) {
    const ctrl = this.form.get(key);
    if (ctrl && ctrl.value < 9) ctrl.setValue(ctrl.value + 1);
  }

  decrement(key: string) {
    const ctrl = this.form.get(key);
    const min = key === 'adults' ? 1 : 0;
    if (ctrl && ctrl.value > min) ctrl.setValue(ctrl.value - 1);
  }

  passengerLabel(): string {
    const a = this.form.get('adults')?.value  ?? 1;
    const c = this.form.get('children')?.value ?? 0;
    const i = this.form.get('infants')?.value  ?? 0;
    const total = a + c + i;
    return `${total} Passenger${total > 1 ? 's' : ''}`;
  }

  fillRoute(r: { origin: string; dest: string }) {
    this.form.get('origin')?.setValue(r.origin);
    this.form.get('destination')?.setValue(r.dest);
  }

  focusOrigin() {}

  onSearch() {
    this.formError.set('');
    if (this.form.invalid) {
      this.formError.set('Please fill in origin, destination, and departure date.');
      return;
    }
    const v = this.form.value;
    const params: FlightSearchParams = {
      origin:        v.origin!,
      destination:   v.destination!,
      departureDate: v.departureDate!,
      returnDate:    v.returnDate || undefined,
      tripType:      this.tripType(),
      adults:        v.adults    ?? 1,
      children:      v.children  ?? 0,
      infants:       v.infants   ?? 0,
      cabinClass:    (v.cabinClass ?? 'ECONOMY') as any,
    };
    this.store.dispatch(BookingActions.setSearchParams({ params }));
    this.router.navigate(['/results']);
  }
}
