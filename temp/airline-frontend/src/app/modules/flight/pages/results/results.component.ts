import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import { FlightService } from '../../services/flight.service';
import { BookingSelectors, BookingActions } from '../../../../store/booking.store';
import { Flight, CabinClass, FlightSearchResult } from '../../../../core/models';
import { StepProgressComponent } from '../../../../shared/components/step-progress/step-progress.component';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, FormsModule, StepProgressComponent],
  template: `
    <app-step-progress [currentStep]="'RESULTS'" />

    <div class="results-page">
      <div class="container-app results-layout">

        <!-- Sidebar Filters -->
        <aside class="filters-sidebar">
          <div class="filters-header">
            <h3>Filters</h3>
            <button class="btn btn-ghost btn-sm" (click)="resetFilters()">Reset</button>
          </div>

          <!-- Stops -->
          <div class="filter-group">
            <h4>Stops</h4>
            <label class="filter-check" *ngFor="let opt of stopOptions">
              <input type="checkbox" [value]="opt.value"
                (change)="toggleStop(opt.value, $any($event.target).checked)" />
              <span>{{ opt.label }}</span>
              <span class="filter-count">{{ opt.count }}</span>
            </label>
          </div>

          <!-- Price Range -->
          <div class="filter-group">
            <h4>Max Price</h4>
            <div class="price-range">
              <input type="range" [(ngModel)]="maxPrice"
                [min]="minFare" [max]="maxFare" step="50"
                (input)="applyFilters()" class="price-slider" />
              <div class="price-labels">
                <span>{{ currency }}{{ minFare }}</span>
                <span class="price-val">{{ currency }}{{ maxPrice }}</span>
              </div>
            </div>
          </div>

          <!-- Departure time -->
          <div class="filter-group">
            <h4>Departure Time</h4>
            @for (slot of timeSlots; track slot.label) {
              <label class="filter-check">
                <input type="checkbox" (change)="toggleTimeSlot(slot, $any($event.target).checked)" />
                <span>{{ slot.icon }} {{ slot.label }}</span>
              </label>
            }
          </div>

          <!-- Airlines -->
          @if (airlines().length > 0) {
            <div class="filter-group">
              <h4>Airlines</h4>
              @for (airline of airlines(); track airline) {
                <label class="filter-check">
                  <input type="checkbox" (change)="toggleAirline(airline, $any($event.target).checked)" />
                  <span>{{ airline }}</span>
                </label>
              }
            </div>
          }
        </aside>

        <!-- Main Results -->
        <div class="results-main">

          <!-- Results header -->
          <div class="results-header">
            <div class="results-summary">
              @if (!loading()) {
                <h2>
                  {{ filteredFlights().length }} flights found
                  @if (searchParams()) {
                    <span class="route-badge">
                      {{ searchParams()!.origin }} → {{ searchParams()!.destination }}
                    </span>
                  }
                </h2>
                <p>{{ searchParams()?.departureDate | date:'EEEE, d MMMM' }} · {{ searchParams()?.adults }} Adult(s) · {{ searchParams()?.cabinClass | titlecase }}</p>
              } @else {
                <div class="skeleton" style="height:28px;width:280px;margin-bottom:8px"></div>
                <div class="skeleton" style="height:16px;width:200px"></div>
              }
            </div>

            <!-- Sort -->
            <div class="sort-row">
              <span class="sort-label">Sort by:</span>
              @for (opt of sortOptions; track opt.value) {
                <button class="sort-btn" [class.active]="sortBy === opt.value"
                  (click)="setSortBy(opt.value)">{{ opt.label }}</button>
              }
            </div>
          </div>

          <!-- Cabin class selector -->
          <div class="cabin-tabs">
            @for (cabin of cabinOptions; track cabin.value) {
              <button class="cabin-tab"
                [class.active]="selectedCabin === cabin.value"
                (click)="selectedCabin = cabin.value; applyFilters()">
                {{ cabin.label }}
              </button>
            }
          </div>

          <!-- Loading skeletons -->
          @if (loading()) {
            @for (_ of [1,2,3,4]; track $index) {
              <div class="flight-card-skeleton">
                <div class="skeleton" style="height:100px;border-radius:12px"></div>
              </div>
            }
          }

          <!-- Flight cards -->
          @if (!loading()) {
            @if (filteredFlights().length === 0) {
              <div class="empty-state">
                <span class="empty-icon">✈</span>
                <h3>No flights found</h3>
                <p>Try adjusting your filters or search for a different date.</p>
              </div>
            }

            @for (flight of filteredFlights(); track flight.id; let i = $index) {
              <div class="flight-card card card-hover animate-fade-in-up"
                [style.animation-delay]="(i * 60) + 'ms'">

                <!-- Airline info -->
                <div class="fc-header">
                  <div class="airline-info">
                    <div class="airline-logo">{{ flight.airlineCode }}</div>
                    <div>
                      <div class="airline-name">{{ flight.airline }}</div>
                      <div class="flight-num">{{ flight.flightNumber }} · {{ flight.aircraftType }}</div>
                    </div>
                  </div>
                  <div class="fc-badges">
                    @if (flight.stops === 0) {
                      <span class="badge badge-green">Direct</span>
                    } @else {
                      <span class="badge badge-neutral">{{ flight.stops }} stop{{ flight.stops > 1 ? 's' : '' }}</span>
                    }
                    @if (flight.status === 'DELAYED') {
                      <span class="badge badge-red">Delayed</span>
                    }
                  </div>
                </div>

                <!-- Route & times -->
                <div class="fc-route">
                  <div class="fc-time">
                    <div class="time">{{ flight.departureTime | date:'HH:mm' }}</div>
                    <div class="airport-code">{{ flight.origin.code }}</div>
                    <div class="city">{{ flight.origin.city }}</div>
                  </div>

                  <div class="fc-duration">
                    <div class="dur-line">
                      <div class="dur-dot"></div>
                      <div class="dur-track">
                        @for (_ of [].constructor(flight.stops); track $index) {
                          <div class="dur-stop"></div>
                        }
                      </div>
                      <div class="dur-dot"></div>
                    </div>
                    <div class="dur-label">{{ formatDuration(flight.durationMinutes) }}</div>
                    <div class="stops-label">{{ flight.stops === 0 ? 'Nonstop' : flight.stops + ' stop(s)' }}</div>
                  </div>

                  <div class="fc-time right">
                    <div class="time">{{ flight.arrivalTime | date:'HH:mm' }}</div>
                    <div class="airport-code">{{ flight.destination.code }}</div>
                    <div class="city">{{ flight.destination.city }}</div>
                  </div>
                </div>

                <!-- Amenities -->
                <div class="fc-amenities">
                  @for (a of flight.amenities.slice(0,4); track a) {
                    <span class="amenity-tag">{{ a }}</span>
                  }
                </div>

                <!-- Cabin pricing -->
                <div class="fc-footer">
                  <div class="fc-pricing">
                    @for (cabin of getAvailableCabins(flight); track cabin.type) {
                      <div class="cabin-price"
                        [class.selected]="cabin.type === selectedCabin"
                        (click)="selectedCabin = cabin.type">
                        <div class="cp-label">{{ formatCabinLabel(cabin.type) }}</div>
                        <div class="cp-price">{{ cabin.currency }} {{ cabin.basePrice | number:'1.0-0' }}</div>
                        <div class="cp-seats">{{ cabin.availableSeats }} left</div>
                      </div>
                    }
                  </div>

                  <div class="fc-select">
                    <div class="selected-price">
                      @if (getSelectedCabin(flight)) {
                        <span class="price-amount">
                          {{ getSelectedCabin(flight)!.currency }}
                          {{ getSelectedCabin(flight)!.basePrice | number:'1.0-0' }}
                        </span>
                        <span class="price-note">per person</span>
                      }
                    </div>
                    <button class="btn btn-primary" (click)="selectFlight(flight)">
                      Select Flight →
                    </button>
                  </div>
                </div>
              </div>
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .results-page {
      background: var(--neutral-100);
      min-height: calc(100vh - 72px);
      padding: 32px 0 64px;
    }

    .results-layout {
      display: grid;
      grid-template-columns: 260px 1fr;
      gap: 24px;
      align-items: start;
    }

    /* ── Sidebar ── */
    .filters-sidebar {
      background: #fff;
      border-radius: 16px;
      border: 1px solid var(--neutral-200);
      padding: 20px;
      position: sticky;
      top: 90px;
    }

    .filters-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .filters-header h3 {
      font-family: var(--font-display);
      font-size: 18px;
      font-weight: 500;
      margin: 0;
    }

    .filter-group {
      border-top: 1px solid var(--neutral-200);
      padding: 16px 0;
    }
    .filter-group h4 {
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--neutral-600);
      margin: 0 0 12px;
    }

    .filter-check {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      cursor: pointer;
      font-size: 14px;
      color: var(--neutral-700);
    }
    .filter-check input { accent-color: var(--sky-500); }
    .filter-count {
      margin-left: auto;
      font-size: 12px;
      color: var(--neutral-400);
    }

    .price-slider { width: 100%; accent-color: var(--sky-500); }
    .price-labels {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: var(--neutral-600);
      margin-top: 6px;
    }
    .price-val { font-weight: 600; color: var(--sky-500); }

    /* ── Results ── */
    .results-main { display: flex; flex-direction: column; gap: 16px; }

    .results-header {
      background: #fff;
      border-radius: 16px;
      border: 1px solid var(--neutral-200);
      padding: 20px 24px;
    }

    .results-summary h2 {
      font-family: var(--font-display);
      font-size: 22px;
      font-weight: 500;
      margin: 0 0 4px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .results-summary p { font-size: 14px; color: var(--neutral-400); margin: 0; }

    .route-badge {
      font-family: var(--font-mono);
      font-size: 14px;
      background: var(--sky-50);
      color: var(--sky-600);
      padding: 3px 10px;
      border-radius: 20px;
    }

    .sort-row {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 14px;
      flex-wrap: wrap;
    }
    .sort-label { font-size: 13px; color: var(--neutral-400); flex-shrink: 0; }

    .sort-btn {
      padding: 6px 14px;
      border-radius: 20px;
      border: 1px solid var(--neutral-200);
      background: #fff;
      font-size: 13px;
      font-weight: 500;
      color: var(--neutral-600);
      cursor: pointer;
      transition: all 0.2s;
    }
    .sort-btn.active, .sort-btn:hover {
      background: var(--sky-500);
      border-color: var(--sky-500);
      color: #fff;
    }

    .cabin-tabs {
      display: flex;
      gap: 6px;
      background: #fff;
      border: 1px solid var(--neutral-200);
      border-radius: 12px;
      padding: 8px;
    }
    .cabin-tab {
      flex: 1;
      padding: 8px;
      border-radius: 8px;
      border: none;
      background: transparent;
      font-size: 13px;
      font-weight: 500;
      color: var(--neutral-600);
      cursor: pointer;
      transition: all 0.2s;
    }
    .cabin-tab.active {
      background: var(--sky-500);
      color: #fff;
    }

    /* ── Flight Card ── */
    .flight-card {
      padding: 0;
      overflow: hidden;
    }

    .fc-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--neutral-100);
    }

    .airline-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .airline-logo {
      width: 44px; height: 44px;
      background: var(--sky-900);
      color: #fff;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-family: var(--font-mono);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.05em;
    }

    .airline-name { font-size: 15px; font-weight: 600; color: var(--neutral-900); }
    .flight-num   { font-size: 13px; color: var(--neutral-400); }

    .fc-badges { display: flex; gap: 6px; }

    .fc-route {
      display: flex;
      align-items: center;
      padding: 20px 24px;
      gap: 16px;
    }

    .fc-time { min-width: 80px; }
    .fc-time.right { text-align: right; }

    .time { font-size: 28px; font-weight: 600; color: var(--neutral-900); font-family: var(--font-display); }
    .airport-code { font-family: var(--font-mono); font-size: 14px; font-weight: 600; color: var(--sky-500); }
    .city { font-size: 12px; color: var(--neutral-400); margin-top: 2px; }

    .fc-duration {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .dur-line {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .dur-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: var(--sky-400);
      flex-shrink: 0;
    }

    .dur-track {
      flex: 1;
      height: 2px;
      background: var(--sky-300);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 40px;
    }

    .dur-stop {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: var(--gold-400);
      border: 2px solid #fff;
    }

    .dur-label  { font-size: 13px; font-weight: 600; color: var(--neutral-700); }
    .stops-label { font-size: 12px; color: var(--neutral-400); }

    .fc-amenities {
      padding: 0 24px 16px;
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .amenity-tag {
      font-size: 12px;
      color: var(--neutral-500);
      background: var(--neutral-100);
      padding: 3px 10px;
      border-radius: 20px;
    }

    .fc-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-top: 1px solid var(--neutral-100);
      background: var(--neutral-50);
      gap: 16px;
    }

    .fc-pricing { display: flex; gap: 8px; }

    .cabin-price {
      padding: 10px 14px;
      border-radius: 10px;
      border: 1.5px solid var(--neutral-200);
      background: #fff;
      cursor: pointer;
      transition: all 0.2s;
      min-width: 90px;
      text-align: center;
    }
    .cabin-price.selected {
      border-color: var(--sky-500);
      background: var(--sky-50);
    }
    .cabin-price:hover { border-color: var(--sky-300); }

    .cp-label { font-size: 11px; font-weight: 600; color: var(--neutral-400); text-transform: uppercase; margin-bottom: 4px; }
    .cp-price { font-size: 15px; font-weight: 700; color: var(--neutral-900); }
    .cp-seats { font-size: 11px; color: var(--danger); margin-top: 2px; }

    .fc-select {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-shrink: 0;
    }

    .price-amount { font-size: 22px; font-weight: 700; color: var(--sky-500); }
    .price-note   { display: block; font-size: 12px; color: var(--neutral-400); }

    .empty-state {
      text-align: center;
      padding: 80px 20px;
      background: #fff;
      border-radius: 16px;
      border: 1px solid var(--neutral-200);
    }
    .empty-icon { font-size: 48px; display: block; margin-bottom: 16px; }
    .empty-state h3 { font-family: var(--font-display); font-size: 22px; margin: 0 0 8px; }
    .empty-state p  { color: var(--neutral-400); margin: 0; }

    .flight-card-skeleton { margin-bottom: 4px; }

    @media (max-width: 900px) {
      .results-layout { grid-template-columns: 1fr; }
      .filters-sidebar { position: static; }
      .fc-footer { flex-direction: column; align-items: flex-start; }
    }
  `]
})
export class ResultsComponent implements OnInit {
  private store   = inject(Store);
  private router  = inject(Router);
  private flight  = inject(FlightService);

  loading        = signal(true);
  allFlights     = signal<Flight[]>([]);
  filteredFlights = signal<Flight[]>([]);
  searchParams   = this.store.selectSignal(BookingSelectors.searchParams);
  currentStep    = this.store.selectSignal(BookingSelectors.currentStep);

  selectedCabin = 'ECONOMY';
  sortBy = 'price';
  maxPrice = 5000;
  minFare  = 100;
  maxFare  = 5000;
  currency = 'USD';
  selectedStops:    number[] = [];
  selectedAirlines: string[] = [];

  stopOptions = [
    { value: 0, label: 'Nonstop',  count: 0 },
    { value: 1, label: '1 Stop',   count: 0 },
    { value: 2, label: '2+ Stops', count: 0 },
  ];

  timeSlots = [
    { icon: '🌅', label: 'Morning (06–12)',    range: [6,  12] },
    { icon: '☀️', label: 'Afternoon (12–18)',  range: [12, 18] },
    { icon: '🌙', label: 'Evening (18–24)',    range: [18, 24] },
  ];

  sortOptions = [
    { value: 'price',     label: 'Cheapest' },
    { value: 'duration',  label: 'Fastest' },
    { value: 'departure', label: 'Departure' },
  ];

  cabinOptions = [
    { value: 'ECONOMY',          label: 'Economy' },
    { value: 'PREMIUM_ECONOMY',  label: 'Prem. Economy' },
    { value: 'BUSINESS',         label: 'Business' },
    { value: 'FIRST',            label: 'First Class' },
  ];

  airlines = computed(() =>
    [...new Set(this.allFlights().map(f => f.airline))]
  );

  ngOnInit() {
    const params = this.searchParams();
    if (!params) { this.router.navigate(['/']); return; }

    this.flight.searchFlights(params).subscribe({
      next: (result: FlightSearchResult) => {
        this.allFlights.set(result.outbound);
        this.currency = result.currency;
        this.calcPriceRange(result.outbound);
        this.applyFilters();
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  calcPriceRange(flights: Flight[]) {
    const prices = flights.flatMap(f =>
      f.cabinClasses.map(c => c.basePrice)
    );
    if (prices.length) {
      this.minFare  = Math.floor(Math.min(...prices));
      this.maxFare  = Math.ceil(Math.max(...prices));
      this.maxPrice = this.maxFare;
    }
  }

  applyFilters() {
    let results = [...this.allFlights()];

    if (this.selectedStops.length > 0) {
      results = results.filter(f => this.selectedStops.includes(f.stops));
    }
    if (this.selectedAirlines.length > 0) {
      results = results.filter(f => this.selectedAirlines.includes(f.airline));
    }
    results = results.filter(f => {
      const cabin = f.cabinClasses.find(c => c.type === this.selectedCabin);
      return cabin && cabin.basePrice <= this.maxPrice;
    });

    // Sort
    results.sort((a, b) => {
      if (this.sortBy === 'price') {
        const pa = a.cabinClasses.find(c => c.type === this.selectedCabin)?.basePrice ?? 0;
        const pb = b.cabinClasses.find(c => c.type === this.selectedCabin)?.basePrice ?? 0;
        return pa - pb;
      }
      if (this.sortBy === 'duration')  return a.durationMinutes - b.durationMinutes;
      if (this.sortBy === 'departure') return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
      return 0;
    });

    this.filteredFlights.set(results);
  }

  toggleStop(val: number, checked: boolean) {
    this.selectedStops = checked
      ? [...this.selectedStops, val]
      : this.selectedStops.filter(s => s !== val);
    this.applyFilters();
  }

  toggleAirline(airline: string, checked: boolean) {
    this.selectedAirlines = checked
      ? [...this.selectedAirlines, airline]
      : this.selectedAirlines.filter(a => a !== airline);
    this.applyFilters();
  }

  toggleTimeSlot(_: any, __: boolean) { this.applyFilters(); }

  setSortBy(val: string) { this.sortBy = val; this.applyFilters(); }

  resetFilters() {
    this.selectedStops    = [];
    this.selectedAirlines = [];
    this.maxPrice = this.maxFare;
    this.applyFilters();
  }

  getAvailableCabins(flight: Flight): CabinClass[] {
    return flight.cabinClasses.filter(c => c.availableSeats > 0);
  }

  getSelectedCabin(flight: Flight): CabinClass | undefined {
    return flight.cabinClasses.find(c => c.type === this.selectedCabin)
        ?? flight.cabinClasses[0];
  }

  formatCabinLabel(type: string): string {
    const map: Record<string, string> = {
      ECONOMY: 'Economy', PREMIUM_ECONOMY: 'Prem. Eco',
      BUSINESS: 'Business', FIRST: 'First',
    };
    return map[type] ?? type;
  }

  formatDuration(mins: number): string {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  }

  selectFlight(flight: Flight) {
    this.store.dispatch(BookingActions.selectOutboundFlight({
      flight,
      cabinClass: this.selectedCabin,
    }));
    this.router.navigate(['/seats']);
  }
}
