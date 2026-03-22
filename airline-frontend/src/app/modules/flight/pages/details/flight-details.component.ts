import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { BookingSelectors, BookingActions } from '../../../../store/booking.store';
import { DurationPipe, FarePipe, CabinLabelPipe } from '../../../../shared/pipes/index';

@Component({
  selector:   'app-flight-details',
  standalone: true,
  imports:    [CommonModule, RouterLink, DurationPipe, FarePipe, CabinLabelPipe],
  template: `
    <div class="details-page">
      <div class="container-app" style="padding: 32px 0 64px">

        <a routerLink="/results" class="back-link">← Back to results</a>

        @if (flight()) {
          <!-- Flight header -->
          <div class="card fd-hero">
            <div class="fd-airline">
              <div class="fd-logo">{{ flight()!.airlineCode }}</div>
              <div>
                <div class="fd-airline-name">{{ flight()!.airline }}</div>
                <div class="fd-meta">
                  {{ flight()!.flightNumber }} ·
                  {{ flight()!.aircraftType }} ·
                  <span [class]="'badge badge-' + statusColor()">{{ flight()!.status }}</span>
                </div>
              </div>
            </div>

            <div class="fd-route">
              <div class="fd-city">
                <div class="fd-time">{{ flight()!.departureTime | date:'HH:mm' }}</div>
                <div class="fd-iata">{{ flight()!.origin.code }}</div>
                <div class="fd-cityname">{{ flight()!.origin.city }}</div>
                <div class="fd-date">{{ flight()!.departureTime | date:'EEEE, d MMMM yyyy' }}</div>
              </div>

              <div class="fd-mid">
                <div class="fd-dur">{{ flight()!.durationMinutes | duration }}</div>
                <div class="fd-line">
                  <div class="fd-dot"></div>
                  <div class="fd-track"></div>
                  <div class="fd-dot"></div>
                </div>
                <div class="fd-stops">{{ flight()!.stops === 0 ? 'Nonstop' : flight()!.stops + ' stop(s)' }}</div>
              </div>

              <div class="fd-city right">
                <div class="fd-time">{{ flight()!.arrivalTime | date:'HH:mm' }}</div>
                <div class="fd-iata">{{ flight()!.destination.code }}</div>
                <div class="fd-cityname">{{ flight()!.destination.city }}</div>
                <div class="fd-date">{{ flight()!.arrivalTime | date:'EEEE, d MMMM yyyy' }}</div>
              </div>
            </div>

            <!-- Amenities -->
            <div class="fd-amenities">
              @for (a of flight()!.amenities; track a) {
                <span class="amenity-chip">✓ {{ a }}</span>
              }
            </div>
          </div>

          <!-- Cabin class cards -->
          <h2 class="section-title">Choose Your Class</h2>
          <div class="cabin-grid">
            @for (cabin of flight()!.cabinClasses; track cabin.type) {
              <div class="cabin-card card"
                [class.selected]="selectedCabin() === cabin.type"
                [class.sold-out]="cabin.availableSeats === 0"
                (click)="cabin.availableSeats > 0 && selectCabin(cabin.type)">

                <div class="cc-header">
                  <div class="cc-type">{{ cabin.type | cabinLabel }}</div>
                  @if (cabin.availableSeats < 10 && cabin.availableSeats > 0) {
                    <span class="cc-urgency">Only {{ cabin.availableSeats }} left!</span>
                  }
                  @if (cabin.availableSeats === 0) {
                    <span class="badge badge-red">Sold Out</span>
                  }
                </div>

                <div class="cc-price">
                  <span class="cp-curr">{{ cabin.currency }}</span>
                  <span class="cp-amount">{{ cabin.basePrice | number:'1.0-0' }}</span>
                  <span class="cp-per">/ person</span>
                </div>

                <div class="cc-baggage">
                  <div class="bag-row">
                    <span>🧳 Cabin</span>
                    <span>{{ cabin.baggage.cabin }}</span>
                  </div>
                  <div class="bag-row">
                    <span>✈ Checked</span>
                    <span>{{ cabin.baggage.checked }}</span>
                  </div>
                </div>

                @if (selectedCabin() === cabin.type) {
                  <div class="cc-selected-indicator">✓ Selected</div>
                }
              </div>
            }
          </div>

          <!-- Gate / Terminal info -->
          @if (flight()!.status !== 'SCHEDULED') {
            <div class="card fd-gate">
              <div class="gate-item">
                <span class="gate-label">Terminal</span>
                <span class="gate-val">{{ 'T4' }}</span>
              </div>
              <div class="gate-item">
                <span class="gate-label">Gate</span>
                <span class="gate-val">{{ 'B12' }}</span>
              </div>
              <div class="gate-item">
                <span class="gate-label">Status</span>
                <span class="badge" [class]="'badge-' + statusColor()">{{ flight()!.status }}</span>
              </div>
            </div>
          }

          <!-- CTA -->
          <div class="fd-cta">
            <a routerLink="/results" class="btn btn-outline">← Change Flight</a>
            <button class="btn btn-primary btn-lg"
              [disabled]="!selectedCabin()"
              (click)="proceedToSeats()">
              Continue to Seat Selection →
            </button>
          </div>
        } @else {
          <div class="empty-state">
            <span style="font-size:48px">✈</span>
            <h3>No flight selected</h3>
            <p>Please go back and select a flight from the results.</p>
            <a routerLink="/results" class="btn btn-primary">Back to Results</a>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .details-page { background: var(--neutral-100); min-height: calc(100vh - 72px); }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: var(--sky-500);
      text-decoration: none;
      margin-bottom: 24px;
    }
    .back-link:hover { text-decoration: underline; }

    /* Hero card */
    .fd-hero { padding: 28px; margin-bottom: 28px; }

    .fd-airline { display: flex; align-items: center; gap: 14px; margin-bottom: 28px; }
    .fd-logo {
      width: 52px; height: 52px;
      background: var(--sky-900); color: #fff;
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-family: var(--font-mono); font-size: 13px; font-weight: 700;
    }
    .fd-airline-name { font-size: 18px; font-weight: 600; color: var(--neutral-900); }
    .fd-meta { font-size: 13px; color: var(--neutral-400); margin-top: 4px;
      display: flex; align-items: center; gap: 6px; }

    .fd-route { display: flex; align-items: center; gap: 24px; margin-bottom: 24px; }

    .fd-city { min-width: 120px; }
    .fd-city.right { text-align: right; }
    .fd-time { font-family: var(--font-display); font-size: 40px; font-weight: 500; color: var(--neutral-900); }
    .fd-iata { font-family: var(--font-mono); font-size: 16px; font-weight: 700; color: var(--sky-500); }
    .fd-cityname { font-size: 14px; color: var(--neutral-700); margin-top: 2px; }
    .fd-date { font-size: 12px; color: var(--neutral-400); margin-top: 4px; }

    .fd-mid { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; }
    .fd-dur { font-size: 15px; font-weight: 600; color: var(--neutral-700); }
    .fd-line { width: 100%; display: flex; align-items: center; gap: 4px; }
    .fd-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--sky-400); flex-shrink: 0; }
    .fd-track { flex: 1; height: 2px; background: var(--sky-300); }
    .fd-stops { font-size: 12px; color: var(--neutral-400); }

    .fd-amenities { display: flex; gap: 8px; flex-wrap: wrap; }
    .amenity-chip {
      font-size: 13px; color: var(--neutral-600);
      background: var(--neutral-100); padding: 4px 12px; border-radius: 20px;
    }

    /* Cabin cards */
    .section-title {
      font-family: var(--font-display); font-size: 22px;
      font-weight: 500; margin: 0 0 16px;
    }

    .cabin-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px; }

    .cabin-card {
      padding: 20px; cursor: pointer;
      border: 2px solid var(--neutral-200);
      transition: all 0.2s ease;
    }
    .cabin-card:hover:not(.sold-out) { border-color: var(--sky-400); transform: translateY(-2px); }
    .cabin-card.selected { border-color: var(--sky-500); background: var(--sky-50); }
    .cabin-card.sold-out { opacity: 0.5; cursor: not-allowed; }

    .cc-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .cc-type { font-size: 15px; font-weight: 700; color: var(--neutral-900); }
    .cc-urgency { font-size: 11px; color: var(--danger); font-weight: 600; }

    .cc-price { margin-bottom: 16px; display: flex; align-items: baseline; gap: 4px; }
    .cp-curr   { font-size: 13px; color: var(--neutral-500); }
    .cp-amount { font-family: var(--font-display); font-size: 32px; font-weight: 500; color: var(--neutral-900); }
    .cp-per    { font-size: 12px; color: var(--neutral-400); }

    .cc-baggage { border-top: 1px solid var(--neutral-200); padding-top: 12px; }
    .bag-row { display: flex; justify-content: space-between; font-size: 13px; color: var(--neutral-600); padding: 4px 0; }

    .cc-selected-indicator {
      margin-top: 12px; text-align: center;
      font-size: 13px; font-weight: 700; color: var(--sky-500);
    }

    /* Gate info */
    .fd-gate {
      padding: 20px; display: flex; gap: 32px;
      margin-bottom: 24px; align-items: center;
    }
    .gate-item { display: flex; flex-direction: column; gap: 4px; }
    .gate-label { font-size: 11px; font-weight: 700; text-transform: uppercase;
      letter-spacing: .07em; color: var(--neutral-400); }
    .gate-val { font-family: var(--font-display); font-size: 24px; font-weight: 500; color: var(--neutral-900); }

    /* CTA */
    .fd-cta { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }

    .empty-state { text-align: center; padding: 80px 0; }
    .empty-state h3 { font-family: var(--font-display); font-size: 22px; margin: 16px 0 8px; }
    .empty-state p  { color: var(--neutral-400); margin: 0 0 24px; }
  `]
})
export class FlightDetailsComponent implements OnInit {
  private store  = inject(Store);
  private router = inject(Router);

  flight       = this.store.selectSignal(BookingSelectors.selectedOutbound);
  selectedCabin = signal<string | null>(null);

  ngOnInit() {
    if (!this.flight()) this.router.navigate(['/results']);
    // Pre-select first available cabin
    const first = this.flight()?.cabinClasses.find(c => c.availableSeats > 0);
    if (first) this.selectedCabin.set(first.type);
  }

  statusColor(): string {
    const map: Record<string, string> = {
      SCHEDULED: 'blue', ON_TIME: 'green', DELAYED: 'amber', CANCELLED: 'red'
    };
    return map[this.flight()?.status ?? ''] ?? 'neutral';
  }

  selectCabin(type: string) { this.selectedCabin.set(type); }

  proceedToSeats() {
    if (!this.selectedCabin()) return;
    this.store.dispatch(BookingActions.selectOutboundFlight({
      flight:     this.flight()!,
      cabinClass: this.selectedCabin()!
    }));
    this.router.navigate(['/seats']);
  }
}
