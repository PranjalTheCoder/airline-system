import {
  Component,
  inject,
  signal,
  OnInit,
  computed,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { InventoryService } from '../../services/inventory.service';
import {
  BookingSelectors,
  BookingActions,
} from '../../../../store/booking.store';
import { SeatMap, SeatRow, Seat, SeatSelection } from '../../../../core/models';
import { StepProgressComponent } from '../../../../shared/components/step-progress/step-progress.component';

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [CommonModule, StepProgressComponent],
  template: `
    <app-step-progress [currentStep]="'SEATS'" />

    <div class="seat-page">
      <div class="container-app seat-layout">
        <!-- Aircraft Column -->
        <div class="aircraft-panel">
          <div class="aircraft-header">
            <h2>Choose Your Seat</h2>
            @if (flight()) {
              <p>
                {{ flight()!.flightNumber }} · {{ flight()!.origin.code }} →
                {{ flight()!.destination.code }} · {{ cabinClass() }}
              </p>
            }
          </div>

          @if (loading()) {
            <div class="seat-loading">
              @for (_ of [1, 2, 3, 4, 5]; track $index) {
                <div
                  class="skeleton"
                  style="height:48px;border-radius:8px;margin-bottom:8px"
                ></div>
              }
            </div>
          }

          @if (!loading() && seatMap()) {
            <!-- Legend -->
            <div class="seat-legend">
              <div class="legend-item">
                <div class="seat-demo available"></div>
                <span>Available</span>
              </div>
              <div class="legend-item">
                <div class="seat-demo occupied"></div>
                <span>Occupied</span>
              </div>
              <div class="legend-item">
                <div class="seat-demo selected"></div>
                <span>Selected</span>
              </div>
              <div class="legend-item">
                <div class="seat-demo premium"></div>
                <span>Premium</span>
              </div>
            </div>

            <!-- Aircraft body -->
            <div class="aircraft-body">
              <!-- Column headers -->
              <div class="col-headers">
                <div class="row-num-spacer"></div>
                @for (col of columns; track col) {
                  @if (col === 'AISLE') {
                    <div class="aisle-spacer"></div>
                  } @else {
                    <div class="col-label">{{ col }}</div>
                  }
                }
              </div>

              <!-- Rows -->
              @for (row of seatMap()!.rows; track row.rowNumber) {
                <div class="seat-row" [class.exit-row]="row.isExitRow">
                  @if (row.isExitRow) {
                    <div class="exit-label">EXIT</div>
                  }

                  <div class="row-number">{{ row.rowNumber }}</div>

                  @for (seat of row.seats; track seat.id) {
                    @if (seat.column === 'AISLE') {
                      <div class="aisle-gap"></div>
                    } @else {
                      <div
                        class="seat"
                        [class.available]="
                          seat.status === 'AVAILABLE' && seat.type !== 'PREMIUM'
                        "
                        [class.occupied]="
                          seat.status === 'OCCUPIED' ||
                          seat.status === 'BLOCKED'
                        "
                        [class.selected]="isSelected(seat.id)"
                        [class.premium]="
                          seat.type === 'PREMIUM' ||
                          seat.type === 'EXTRA_LEGROOM'
                        "
                        [title]="
                          seat.seatNumber + ' · ' + seat.currency + seat.price
                        "
                        (click)="onSeatClick(seat)"
                        [class.disabled]="seat.status !== 'AVAILABLE'"
                      >
                        {{ seat.seatNumber }}
                      </div>
                    }
                  }
                </div>
              }
            </div>
          }
        </div>

        <!-- Summary Panel -->
        <div class="summary-panel">
          <div class="summary-card card">
            <h3>Seat Summary</h3>

            <div class="passengers-needed">
              <div class="needed-label">
                Seats needed: {{ passengerCount() }}
              </div>
              <div class="needed-progress">
                @for (i of passengerArray(); track i) {
                  <div
                    class="needed-dot"
                    [class.filled]="selectedSeats().length > i"
                  ></div>
                }
              </div>
            </div>

            @if (selectedSeats().length > 0) {
              <div class="selected-list">
                @for (sel of selectedSeats(); track sel.seatId) {
                  <div class="selected-item">
                    <div class="sel-seat">
                      <span class="sel-seat-num">{{
                        getSeatById(sel.seatId)?.seatNumber
                      }}</span>
                      <span class="sel-type">{{
                        getSeatById(sel.seatId)?.type | titlecase
                      }}</span>
                    </div>
                    <div class="sel-price">
                      {{ getSeatById(sel.seatId)?.currency }}
                      {{ getSeatById(sel.seatId)?.price | number: '1.0-0' }}
                    </div>
                    <button class="sel-remove" (click)="removeSeat(sel.seatId)">
                      ✕
                    </button>
                  </div>
                }
              </div>

              <div class="seat-total">
                <span>Seat charges</span>
                <span class="total-amount"
                  >{{ seatCurrency() }}
                  {{ totalSeatCharge() | number: '1.0-0' }}</span
                >
              </div>
            } @else {
              <div class="no-seats">
                <span class="no-seats-icon">🪑</span>
                <p>Click a seat on the map to select it</p>
              </div>
            }

            <!-- Seat features -->
            @if (selectedSeatFeatures().length > 0) {
              <div class="seat-features">
                @for (f of selectedSeatFeatures(); track f) {
                  <div class="feature-row">
                    <span class="feature-check">✓</span>
                    <span>{{ formatFeature(f) }}</span>
                  </div>
                }
              </div>
            }

            <div class="summary-actions">
              <button
                class="btn btn-outline w-full"
                (click)="skipSeats()"
                style="width:100%;margin-bottom:10px"
              >
                Skip seat selection
              </button>
              <button
                class="btn btn-primary"
                [disabled]="selectedSeats().length === 0"
                (click)="confirmSeats()"
                style="width:100%"
              >
                Continue → Passenger Details
              </button>
            </div>
          </div>

          <!-- Flight summary -->
          @if (flight()) {
            <div class="flight-summary card" style="margin-top:16px">
              <div class="fs-route">
                <span class="fs-code">{{ flight()!.origin.code }}</span>
                <span class="fs-arrow">✈</span>
                <span class="fs-code">{{ flight()!.destination.code }}</span>
              </div>
              <div class="fs-detail">
                {{ flight()!.departureTime | date: 'EEE d MMM · HH:mm' }}
              </div>
              <div class="fs-detail">
                {{ formatDuration(flight()!.durationMinutes) }} ·
                {{
                  flight()!.stops === 0
                    ? 'Direct'
                    : flight()!.stops + ' stop(s)'
                }}
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .seat-page {
        background: var(--neutral-100);
        min-height: calc(100vh - 72px);
        padding: 32px 0 64px;
      }

      .seat-layout {
        display: grid;
        grid-template-columns: 1fr 300px;
        gap: 24px;
        align-items: start;
      }

      /* ── Aircraft panel ── */
      .aircraft-panel {
        background: #fff;
        border-radius: 20px;
        border: 1px solid var(--neutral-200);
        padding: 28px;
      }

      .aircraft-header h2 {
        font-family: var(--font-display);
        font-size: 24px;
        font-weight: 500;
        margin: 0 0 4px;
      }
      .aircraft-header p {
        font-size: 14px;
        color: var(--neutral-400);
        margin: 0 0 24px;
      }

      /* Legend */
      .seat-legend {
        display: flex;
        gap: 20px;
        margin-bottom: 24px;
        flex-wrap: wrap;
      }
      .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        color: var(--neutral-600);
      }
      .seat-demo {
        width: 24px;
        height: 24px;
        border-radius: 6px 6px 3px 3px;
        border: 1.5px solid transparent;
      }
      .seat-demo.available {
        background: #d1fae5;
        border-color: #6ee7b7;
      }
      .seat-demo.occupied {
        background: var(--neutral-200);
        border-color: var(--neutral-300);
      }
      .seat-demo.selected {
        background: var(--sky-500);
        border-color: var(--sky-600);
      }
      .seat-demo.premium {
        background: #fef9e7;
        border-color: var(--gold-400);
      }

      /* Aircraft body */
      .aircraft-body {
        background: var(--neutral-50);
        border-radius: 16px;
        padding: 20px;
        border: 1px solid var(--neutral-200);
        overflow-x: auto;
      }

      .col-headers {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 8px;
        padding-left: 36px;
      }
      .col-label {
        width: 36px;
        text-align: center;
        font-size: 12px;
        font-weight: 700;
        color: var(--neutral-400);
        text-transform: uppercase;
      }
      .aisle-spacer {
        width: 24px;
      }

      .seat-row {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 6px;
        position: relative;
      }

      .seat-row.exit-row {
        border-top: 2px dashed #f59e0b;
        padding-top: 8px;
        margin-top: 4px;
      }

      .exit-label {
        position: absolute;
        left: -50px;
        font-size: 10px;
        font-weight: 700;
        color: #f59e0b;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .row-num-spacer {
        width: 30px;
      }
      .row-number {
        width: 30px;
        text-align: center;
        font-size: 12px;
        color: var(--neutral-400);
        font-weight: 500;
        flex-shrink: 0;
      }

      .aisle-gap {
        width: 24px;
      }

      /* Seats */
      .seat {
        width: 36px;
        height: 36px;
        border-radius: 8px 8px 4px 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: 600;
        cursor: pointer;
        border: 1.5px solid transparent;
        transition: all 0.15s ease;
        flex-shrink: 0;
      }

      .seat.available {
        background: #d1fae5;
        border-color: #6ee7b7;
        color: #065f46;
      }
      .seat.available:hover {
        background: #a7f3d0;
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      }

      .seat.occupied,
      .seat.disabled {
        background: var(--neutral-200);
        border-color: var(--neutral-300);
        color: var(--neutral-400);
        cursor: not-allowed;
      }

      .seat.selected {
        background: var(--sky-500);
        border-color: var(--sky-600);
        color: #fff;
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(29, 78, 216, 0.4);
      }

      .seat.premium.available {
        background: #fef9e7;
        border-color: var(--gold-400);
        color: var(--gold-500);
      }
      .seat.premium.available:hover {
        background: #fef3c7;
        transform: scale(1.1);
      }

      .seat-loading {
        padding: 20px 0;
      }

      /* ── Summary panel ── */
      .summary-card {
        padding: 20px;
        position: sticky;
        top: 90px;
      }
      .summary-card h3 {
        font-family: var(--font-display);
        font-size: 18px;
        font-weight: 500;
        margin: 0 0 16px;
      }

      .passengers-needed {
        margin-bottom: 20px;
      }
      .needed-label {
        font-size: 13px;
        color: var(--neutral-600);
        margin-bottom: 8px;
      }
      .needed-progress {
        display: flex;
        gap: 6px;
      }
      .needed-dot {
        width: 28px;
        height: 6px;
        border-radius: 3px;
        background: var(--neutral-200);
        transition: background 0.3s;
      }
      .needed-dot.filled {
        background: var(--sky-500);
      }

      .selected-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 16px;
      }

      .selected-item {
        display: flex;
        align-items: center;
        padding: 10px 12px;
        background: var(--sky-50);
        border-radius: 10px;
        border: 1px solid var(--sky-100);
        gap: 10px;
      }

      .sel-seat {
        flex: 1;
      }
      .sel-seat-num {
        font-size: 15px;
        font-weight: 700;
        color: var(--sky-600);
      }
      .sel-type {
        display: block;
        font-size: 12px;
        color: var(--neutral-400);
      }

      .sel-price {
        font-size: 14px;
        font-weight: 600;
        color: var(--neutral-800);
      }

      .sel-remove {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--neutral-400);
        font-size: 12px;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .sel-remove:hover {
        color: var(--danger);
      }

      .seat-total {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-top: 1px solid var(--neutral-200);
        font-size: 14px;
        margin-bottom: 16px;
      }
      .total-amount {
        font-weight: 700;
        color: var(--sky-500);
        font-size: 16px;
      }

      .no-seats {
        text-align: center;
        padding: 24px 0;
        color: var(--neutral-400);
      }
      .no-seats-icon {
        font-size: 32px;
        display: block;
        margin-bottom: 8px;
      }
      .no-seats p {
        font-size: 14px;
        margin: 0;
      }

      .seat-features {
        margin-bottom: 16px;
      }
      .feature-row {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        color: var(--neutral-600);
        padding: 3px 0;
      }
      .feature-check {
        color: var(--success);
        font-weight: 700;
      }

      .summary-actions {
        display: flex;
        flex-direction: column;
        gap: 0;
      }

      /* Flight summary mini card */
      .flight-summary {
        padding: 16px;
      }
      .fs-route {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 6px;
      }
      .fs-code {
        font-family: var(--font-mono);
        font-size: 18px;
        font-weight: 700;
        color: var(--neutral-900);
      }
      .fs-arrow {
        color: var(--sky-400);
        font-size: 14px;
      }
      .fs-detail {
        font-size: 13px;
        color: var(--neutral-400);
        margin-bottom: 3px;
      }

      @media (max-width: 900px) {
        .seat-layout {
          grid-template-columns: 1fr;
        }
        .summary-card {
          position: static;
        }
      }
    `,
  ],
})
export class SeatSelectionComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private router = inject(Router);
  private inventory = inject(InventoryService);

  loading = signal(true);
  seatMap = signal<SeatMap | null>(null);
  selectedSeats = signal<SeatSelection[]>([]);

  flight = this.store.selectSignal(BookingSelectors.selectedOutbound);
  cabinClass = this.store.selectSignal(BookingSelectors.cabinClass);
  passengerCount = this.store.selectSignal(BookingSelectors.passengerCount);

  columns = ['A', 'B', 'C', 'AISLE', 'D', 'E', 'F'];

  passengerArray = computed(() =>
    Array.from({ length: this.passengerCount() }, (_, i) => i),
  );
  seatCurrency = computed(
    () => this.seatMap()?.rows[0]?.seats[0]?.currency ?? 'USD',
  );
  totalSeatCharge = computed(() =>
    this.selectedSeats().reduce((sum, sel) => {
      const seat = this.getSeatById(sel.seatId);
      return sum + (seat?.price ?? 0);
    }, 0),
  );

  selectedSeatFeatures = computed(() => {
    const features = new Set<string>();
    this.selectedSeats().forEach((sel) => {
      const seat = this.getSeatById(sel.seatId);
      seat?.features.forEach((f) => features.add(f));
    });
    return [...features];
  });

  allSeats = computed(() => this.seatMap()?.rows.flatMap((r) => r.seats) ?? []);

  ngOnInit() {
    const flight = this.flight();
    const cabin = this.cabinClass();
    if (!flight) {
      this.router.navigate(['/']);
      return;
    }

    this.inventory.getSeatMap(flight.flightNumber, cabin).subscribe({
      next: (map) => {
        this.seatMap.set(map);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  // ✅ NEW: Bulletproof helper to find a seat by its column letter
  getSeatForColumn(row: SeatRow, col: string): Seat | undefined {
    return row.seats.find((s) => s.seatNumber && s.seatNumber.endsWith(col));
  }

  isSelected(seatId: string): boolean {
    return this.selectedSeats().some((s) => s.seatId === seatId);
  }

  getSeatById(seatId: string): Seat | undefined {
    return this.allSeats().find((s) => s.id === seatId);
  }

  onSeatClick(seat: Seat) {
    if (seat.status !== 'AVAILABLE') return;

    if (this.isSelected(seat.id)) {
      // this.selectedSeats.update((s) => s.filter((x) => x.seatId !== seat.id));
      this.releaseSeatSelection(seat.id);
      return;
    }
    if (this.selectedSeats().length >= this.passengerCount()) return;

    // 2. Lock the seat in the backend
    const flightId = this.flight()?.flightNumber || this.flight()?.id;

    if (flightId) {
      // Call backend to lock the seat
      this.inventory.lockSeat(flightId, seat.id).subscribe({
        next: (res) => {
          if (res.success) {
            // Update UI only after successful backend lock
            this.selectedSeats.update((s) => [
              ...s,
              {
                passengerId: `pax-${s.length}`,
                seatId: seat.id,
              },
            ]);
          }
        },
        error: (err) => {
          console.error('Failed to lock seat. It may have been taken.', err);
          // Optional: Integrate with your ToastService here to show an error to the user
        },
      });
    }
  }

  //   this.selectedSeats.update((s) => [
  //     ...s,
  //     {
  //       passengerId: `pax-${s.length}`,
  //       seatId: seat.id,
  //     },
  //   ]);
  // }

  removeSeat(seatId: string) {
    // this.selectedSeats.update((s) => s.filter((x) => x.seatId !== seatId));
    this.releaseSeatSelection(seatId);
  }

  // Helper method to release seat in the backend and update UI
  // Helper method to release seat in the backend and update UI
  private releaseSeatSelection(seatId: string) {
    const flightId = this.flight()?.flightNumber || this.flight()?.id;
    if (!flightId) return;

    this.inventory.releaseSeat(flightId, seatId).subscribe({
      next: () => {
        this.selectedSeats.update((s) => s.filter((x) => x.seatId !== seatId));
      },
      error: (err) => {
        console.error('Failed to release seat', err);
        this.selectedSeats.update((s) => s.filter((x) => x.seatId !== seatId));
      },
    });
  }

  // If you added ngOnDestroy in the previous step, update it too:
  ngOnDestroy() {
    const seatsToRelease = this.selectedSeats();
    if (seatsToRelease.length > 0 && !this.router.url.includes('/passengers')) {
      const flightId = this.flight()?.flightNumber || this.flight()?.id;
      if (flightId) {
        seatsToRelease.forEach((sel) => {
          this.inventory.releaseSeat(flightId, sel.seatId).subscribe();
        });
      }
    }
  }
  formatFeature(f: string): string {
    const map: Record<string, string> = {
      WINDOW: 'Window seat',
      EXTRA_LEGROOM: 'Extra legroom',
      RECLINE: 'Full recline',
      BULKHEAD: 'Bulkhead row',
      EXIT_ROW: 'Exit row',
    };
    return map[f] ?? f;
  }

  formatDuration(mins: number): string {
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  }

  skipSeats() {
    this.store.dispatch(BookingActions.setSeats({ seats: [] }));
    this.router.navigate(['/passengers']);
  }

  confirmSeats() {
    this.store.dispatch(
      BookingActions.setSeats({ seats: this.selectedSeats() }),
    );
    this.router.navigate(['/passengers']);
  }
}
