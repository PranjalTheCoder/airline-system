// ════════════════════════════════════════════════════════════
// BOOKING REVIEW
// ════════════════════════════════════════════════════════════
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BookingSelectors, BookingActions } from '../../../../store/booking.store';
import { ReservationService } from '../../services/reservation.service';
import { StepProgressComponent } from '../../../../shared/components/step-progress/step-progress.component';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-booking-review',
  standalone: true,
  imports: [CommonModule, StepProgressComponent],
  template: `
    <app-step-progress [currentStep]="'REVIEW'" />
    <div class="review-page">
      <div class="container-app review-layout">
        <div class="review-main">
          <h2 class="section-title">Review Your Booking</h2>

          <!-- Flight Details -->
          <div class="card review-card">
            <div class="review-section-label">Flight</div>
            @if (flight()) {
              <div class="flight-review">
                <div class="fr-route">
                  <div class="fr-time">
                    <div class="time">{{ flight()!.departureTime | date:'HH:mm' }}</div>
                    <div class="iata">{{ flight()!.origin.code }}</div>
                    <div class="city">{{ flight()!.origin.city }}</div>
                  </div>
                  <div class="fr-mid">
                    <div class="fr-line">
                      <div class="fr-dot"></div>
                      <div class="fr-track"></div>
                      <div class="fr-dot"></div>
                    </div>
                    <div class="fr-dur">{{ formatDur(flight()!.durationMinutes) }}</div>
                    <div class="fr-stops">{{ flight()!.stops === 0 ? 'Nonstop' : flight()!.stops + ' stop(s)' }}</div>
                  </div>
                  <div class="fr-time right">
                    <div class="time">{{ flight()!.arrivalTime | date:'HH:mm' }}</div>
                    <div class="iata">{{ flight()!.destination.code }}</div>
                    <div class="city">{{ flight()!.destination.city }}</div>
                  </div>
                </div>
                <div class="fr-meta">
                  <span class="badge badge-neutral">{{ flight()!.flightNumber }}</span>
                  <span class="badge badge-blue">{{ cabinClass() | titlecase }}</span>
                  <span class="badge badge-neutral">{{ flight()!.aircraftType }}</span>
                </div>
              </div>
            }
          </div>

          <!-- Passengers -->
          <div class="card review-card">
            <div class="review-section-label">Passengers</div>
            @for (pax of passengers(); track $index) {
              <div class="pax-review-row">
                <div class="prr-left">
                  <span class="prr-name">{{ pax.title }} {{ pax.firstName }} {{ pax.lastName }}</span>
                  <span class="prr-meta">{{ pax.nationality }} · PP: {{ pax.passportNumber }}</span>
                </div>
                @if (seats()[$index]) {
                  <span class="prr-seat">Seat {{ seats()[$index]?.seatId }}</span>
                }
              </div>
            }
          </div>

          <!-- Contact -->
          <div class="card review-card">
            <div class="review-section-label">Contact</div>
            <div class="contact-review">
              <div>📧 {{ contactEmail() }}</div>
              <div>📞 {{ contactPhone() }}</div>
            </div>
          </div>

          <div class="review-actions">
            <button class="btn btn-outline" (click)="goBack()">← Edit Passengers</button>
            <button class="btn btn-primary btn-lg" (click)="confirmBooking()" [disabled]="loading()">
              @if (loading()) { <span class="spin"></span> Creating Booking... }
              @else { Confirm & Pay → }
            </button>
          </div>
        </div>

        <!-- Price Breakdown -->
        <div class="price-panel">
          <div class="card" style="padding:20px;position:sticky;top:90px">
            <h4 style="margin:0 0 16px;font-size:15px">Fare Summary</h4>
            <div class="price-row"><span>Base fare × {{ passengers().length }}</span><span>USD 450</span></div>
            <div class="price-row"><span>Taxes &amp; fees</span><span>USD 89</span></div>
            @if (seats().length > 0) {
              <div class="price-row"><span>Seat charges</span><span>USD 0</span></div>
            }
            <div class="price-divider"></div>
            <div class="price-row total"><span>Total</span><span>USD 539</span></div>
            <div class="price-note">All prices in USD. Inclusive of taxes.</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .review-page { background:var(--neutral-100);min-height:calc(100vh - 72px);padding:32px 0 64px; }
    .review-layout { display:grid;grid-template-columns:1fr 280px;gap:24px;align-items:start; }
    .section-title { font-family:var(--font-display);font-size:24px;font-weight:500;margin:0 0 20px; }
    .review-card { padding:20px;margin-bottom:16px; }
    .review-section-label { font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--neutral-400);margin-bottom:14px; }
    .flight-review {}
    .fr-route { display:flex;align-items:center;gap:16px;margin-bottom:14px; }
    .fr-time { min-width:70px; }
    .fr-time.right { text-align:right; }
    .time { font-family:var(--font-display);font-size:26px;font-weight:500;color:var(--neutral-900); }
    .iata { font-family:var(--font-mono);font-size:14px;font-weight:700;color:var(--sky-500); }
    .city { font-size:12px;color:var(--neutral-400);margin-top:2px; }
    .fr-mid { flex:1;display:flex;flex-direction:column;align-items:center;gap:4px; }
    .fr-line { width:100%;display:flex;align-items:center;gap:4px; }
    .fr-dot { width:8px;height:8px;border-radius:50%;background:var(--sky-400);flex-shrink:0; }
    .fr-track { flex:1;height:2px;background:var(--sky-300); }
    .fr-dur { font-size:13px;font-weight:600;color:var(--neutral-700); }
    .fr-stops { font-size:12px;color:var(--neutral-400); }
    .fr-meta { display:flex;gap:8px;flex-wrap:wrap; }
    .pax-review-row { display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--neutral-100); }
    .pax-review-row:last-child { border-bottom:none; }
    .prr-name { font-weight:600;color:var(--neutral-900);display:block; }
    .prr-meta { font-size:12px;color:var(--neutral-400); }
    .prr-seat { font-family:var(--font-mono);font-size:13px;background:var(--sky-50);color:var(--sky-600);padding:4px 10px;border-radius:20px; }
    .contact-review { font-size:14px;color:var(--neutral-600);display:flex;flex-direction:column;gap:8px; }
    .review-actions { display:flex;justify-content:space-between;align-items:center;margin-top:8px; }
    .spin { display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;margin-right:6px; }
    @keyframes spin { to{transform:rotate(360deg)} }
    .price-row { display:flex;justify-content:space-between;font-size:14px;color:var(--neutral-700);margin-bottom:10px; }
    .price-row.total { font-weight:700;font-size:16px;color:var(--neutral-900);margin-bottom:8px; }
    .price-divider { height:1px;background:var(--neutral-200);margin:14px 0; }
    .price-note { font-size:12px;color:var(--neutral-400);margin-top:8px; }
    @media(max-width:900px){.review-layout{grid-template-columns:1fr}.price-panel{display:none}}
  `]
})
export class BookingReviewComponent {
  private store       = inject(Store);
  private router      = inject(Router);
  private reservation = inject(ReservationService);
  private toast       = inject(ToastService);

  loading      = signal(false);
  flight       = this.store.selectSignal(BookingSelectors.selectedOutbound);
  cabinClass   = this.store.selectSignal(BookingSelectors.cabinClass);
  passengers   = this.store.selectSignal(BookingSelectors.passengers);
  seats        = this.store.selectSignal(BookingSelectors.selectedSeats);
  contactEmail = this.store.selectSignal(BookingSelectors.contactEmail);
  contactPhone = this.store.selectSignal(BookingSelectors.contactPhone);

  formatDur(m: number) { return `${Math.floor(m/60)}h ${m%60}m`; }
  goBack() { this.router.navigate(['/passengers']); }

  confirmBooking() {
    const flight = this.flight();
    if (!flight) return;
    this.loading.set(true);

    const payload = {
      outboundFlightId: flight.id,
      cabinClass:       this.cabinClass(),
      passengers:       this.passengers(),
      contactEmail:     this.contactEmail(),
      contactPhone:     this.contactPhone(),
      seatSelections:   this.seats(),
    };

    this.reservation.create(payload).subscribe({
      next: res => {
        this.store.dispatch(BookingActions.setReservation({
          reservationId: res.id,
          pnr:           res.pnr,
          pricing:       res.pricing,
        }));
        this.loading.set(false);
        this.router.navigate(['/payment']);
      },
      error: () => this.loading.set(false),
    });
  }
}
