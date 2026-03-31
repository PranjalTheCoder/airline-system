import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { BookingSelectors, BookingActions } from '../../../../store/booking.store';
import { TicketingService } from '../../services/ticketing.service';
import { ToastService } from '../../../../core/services/toast.service';
import { StepProgressComponent } from '../../../../shared/components/step-progress/step-progress.component';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink, StepProgressComponent],
  template: `
    <app-step-progress [currentStep]="'CONFIRMATION'" />

    <div class="confirm-page">
      <div class="container-app">

        <!-- Success Banner -->
        <div class="success-banner animate-fade-in-up">
          <div class="success-icon">✓</div>
          <div>
            <h1>Booking Confirmed!</h1>
            <p>Your tickets have been issued. Check your email for the itinerary.</p>
          </div>
        </div>

        <!-- PNR Card -->
        <div class="pnr-card card animate-fade-in-up" style="animation-delay:80ms">
          <div class="pnr-left">
            <div class="pnr-label">Booking Reference (PNR)</div>
            <div class="pnr-code">{{ pnr() }}</div>
            <div class="pnr-hint">Use this code to manage your booking</div>
          </div>
          <div class="pnr-actions">
            <button class="btn btn-outline btn-sm" (click)="copyPnr()">📋 Copy</button>
            <button class="btn btn-primary btn-sm" (click)="downloadTicket()">⬇ Download PDF</button>
          </div>
        </div>

        <!-- Ticket card(s) -->
        @if (flight()) {
          <div class="ticket-card animate-fade-in-up" style="animation-delay:160ms">

            <!-- Ticket header -->
            <div class="tc-header">
              <div class="tc-airline">
                <div class="tc-logo">{{ flight()!.airlineCode }}</div>
                <div>
                  <div class="tc-airline-name">{{ flight()!.airline }}</div>
                  <div class="tc-flight-num">{{ flight()!.flightNumber }}</div>
                </div>
              </div>
              <div class="tc-cabin">{{ cabinClass() | titlecase }}</div>
            </div>

            <!-- Boarding pass body -->
            <div class="tc-body">
              <div class="tc-route">
                <div class="tc-city">
                  <div class="tc-time">{{ flight()!.departureTime | date:'HH:mm' }}</div>
                  <div class="tc-iata">{{ flight()!.origin.code }}</div>
                  <div class="tc-cityname">{{ flight()!.origin.city }}</div>
                  <div class="tc-date">{{ flight()!.departureTime | date:'EEE, d MMM yyyy' }}</div>
                </div>

                <div class="tc-mid">
                  <div class="tc-plane">✈</div>
                  <div class="tc-dur">{{ formatDur(flight()!.durationMinutes) }}</div>
                  <div class="tc-direct">{{ flight()!.stops === 0 ? 'Nonstop' : flight()!.stops + ' stop(s)' }}</div>
                </div>

                <div class="tc-city right">
                  <div class="tc-time">{{ flight()!.arrivalTime | date:'HH:mm' }}</div>
                  <div class="tc-iata">{{ flight()!.destination.code }}</div>
                  <div class="tc-cityname">{{ flight()!.destination.city }}</div>
                  <div class="tc-date">{{ flight()!.arrivalTime | date:'EEE, d MMM yyyy' }}</div>
                </div>
              </div>

              <!-- Tear line -->
              <div class="tear-line">
                <div class="tear-circle left"></div>
                <div class="tear-dashes"></div>
                <div class="tear-circle right"></div>
              </div>

              <!-- Passenger list -->
              <div class="tc-passengers">
                @for (pax of passengers(); track $index) {
                  <div class="tc-pax">
                    <div class="pax-name">{{ pax.title }} {{ pax.firstName }} {{ pax.lastName }}</div>
                    <div class="pax-meta">
                      {{ pax.nationality }} · Passport: {{ pax.passportNumber }}
                      @if (seats()[$index]) {
                        · Seat {{ seats()[$index]?.seatId }}
                      }
                    </div>
                  </div>
                }
              </div>

              <!-- Barcode placeholder -->
              <div class="tc-barcode">
                <div class="barcode-bars">
                  @for (_ of barcodeWidths; track $index) {
                    <div class="bar" [style.width.px]="barcodeWidths[$index]"></div>
                  }
                </div>
                <div class="barcode-text">{{ pnr() }}</div>
              </div>
            </div>
          </div>
        }

        <!-- Important Info -->
        <div class="info-cards animate-fade-in-up" style="animation-delay:240ms">
          @for (info of importantInfo; track info.title) {
            <div class="info-card card">
              <span class="info-icon">{{ info.icon }}</span>
              <div>
                <div class="info-title">{{ info.title }}</div>
                <div class="info-desc">{{ info.desc }}</div>
              </div>
            </div>
          }
        </div>

        <!-- CTA row -->
        <div class="confirm-cta animate-fade-in-up" style="animation-delay:300ms">
          <a routerLink="/my-bookings" class="btn btn-outline">View All Bookings</a>
          <a routerLink="/" class="btn btn-primary" (click)="newSearch()">Book Another Flight</a>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .confirm-page { background:var(--neutral-100);min-height:calc(100vh - 72px);padding:40px 0 80px; }

    /* ── Success banner ── */
    .success-banner {
      background:linear-gradient(135deg,#064e3b,#065f46);
      border-radius:16px;
      padding:28px 32px;
      display:flex;
      align-items:center;
      gap:20px;
      margin-bottom:24px;
    }
    .success-icon {
      width:56px;height:56px;
      background:rgba(255,255,255,.15);
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-size:24px;color:#fff;
      flex-shrink:0;
    }
    .success-banner h1 { font-family:var(--font-display);font-size:26px;font-weight:500;color:#fff;margin:0 0 4px; }
    .success-banner p  { color:rgba(255,255,255,.7);font-size:14px;margin:0; }

    /* ── PNR card ── */
    .pnr-card {
      padding:24px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      margin-bottom:24px;
    }
    .pnr-label { font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:var(--neutral-400);margin-bottom:6px; }
    .pnr-code  { font-family:var(--font-mono);font-size:36px;font-weight:700;color:var(--sky-600);letter-spacing:.12em; }
    .pnr-hint  { font-size:13px;color:var(--neutral-400);margin-top:4px; }
    .pnr-actions { display:flex;gap:10px; }

    /* ── Ticket card ── */
    .ticket-card {
      background:#fff;
      border-radius:20px;
      border:1px solid var(--neutral-200);
      overflow:hidden;
      margin-bottom:24px;
      box-shadow:var(--shadow-card);
    }

    .tc-header {
      background:var(--sky-900);
      padding:20px 28px;
      display:flex;
      align-items:center;
      justify-content:space-between;
    }

    .tc-airline { display:flex;align-items:center;gap:14px; }
    .tc-logo {
      width:44px;height:44px;
      background:rgba(255,255,255,.1);
      border-radius:10px;
      display:flex;align-items:center;justify-content:center;
      font-family:var(--font-mono);font-size:12px;font-weight:700;color:#fff;
    }
    .tc-airline-name { font-size:16px;font-weight:600;color:#fff; }
    .tc-flight-num   { font-size:13px;color:rgba(255,255,255,.5); }
    .tc-cabin { font-size:13px;color:var(--gold-400);font-weight:600;background:rgba(212,175,55,.1);padding:6px 14px;border-radius:20px; }

    .tc-body { padding:32px 28px; }

    .tc-route { display:flex;align-items:center;gap:16px;margin-bottom:28px; }

    .tc-city { min-width:100px; }
    .tc-city.right { text-align:right; }

    .tc-time { font-family:var(--font-display);font-size:36px;font-weight:500;color:var(--neutral-900); }
    .tc-iata { font-family:var(--font-mono);font-size:16px;font-weight:700;color:var(--sky-500); }
    .tc-cityname { font-size:14px;color:var(--neutral-700);margin-top:2px; }
    .tc-date { font-size:12px;color:var(--neutral-400);margin-top:4px; }

    .tc-mid {
      flex:1;
      display:flex;
      flex-direction:column;
      align-items:center;
      gap:4px;
    }
    .tc-plane { font-size:22px;color:var(--sky-400); }
    .tc-dur   { font-size:14px;font-weight:600;color:var(--neutral-700); }
    .tc-direct { font-size:12px;color:var(--neutral-400); }

    /* Tear line */
    .tear-line {
      display:flex;
      align-items:center;
      margin:0 -28px 24px;
    }
    .tear-circle {
      width:24px;height:24px;
      border-radius:50%;
      background:var(--neutral-100);
      border:1px solid var(--neutral-200);
      flex-shrink:0;
    }
    .tear-circle.left  { margin-left:-12px; }
    .tear-circle.right { margin-right:-12px; }
    .tear-dashes {
      flex:1;
      border-top:2px dashed var(--neutral-200);
    }

    /* Passengers */
    .tc-passengers { margin-bottom:24px; }
    .tc-pax { margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid var(--neutral-100); }
    .tc-pax:last-child { border-bottom:none; }
    .pax-name { font-size:15px;font-weight:600;color:var(--neutral-900); }
    .pax-meta { font-size:13px;color:var(--neutral-400);margin-top:2px; }

    /* Barcode */
    .tc-barcode { display:flex;flex-direction:column;align-items:center;gap:8px; }
    .barcode-bars { display:flex;align-items:flex-end;gap:2px;height:48px; }
    .bar { background:var(--neutral-800);height:100%; }
    .barcode-text { font-family:var(--font-mono);font-size:13px;color:var(--neutral-500);letter-spacing:.1em; }

    /* Info cards */
    .info-cards { display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:24px; }
    .info-card { padding:16px;display:flex;align-items:flex-start;gap:12px; }
    .info-icon { font-size:22px;flex-shrink:0; }
    .info-title { font-size:14px;font-weight:600;color:var(--neutral-900);margin-bottom:4px; }
    .info-desc  { font-size:13px;color:var(--neutral-400);line-height:1.4; }

    .confirm-cta { display:flex;gap:12px;justify-content:center; }
  `]
})
export class ConfirmationComponent implements OnInit {
  private store    = inject(Store);
  private router   = inject(Router);
  private ticketing = inject(TicketingService);
  private toast    = inject(ToastService);

  pnr          = this.store.selectSignal(BookingSelectors.pnr);
  flight       = this.store.selectSignal(BookingSelectors.selectedOutbound);
  passengers   = this.store.selectSignal(BookingSelectors.passengers);
  seats        = this.store.selectSignal(BookingSelectors.selectedSeats);
  cabinClass   = this.store.selectSignal(BookingSelectors.cabinClass);
  reservationId = this.store.selectSignal(BookingSelectors.reservationId);

  // Fake barcode widths for visual
  barcodeWidths = [2,4,2,1,3,2,4,1,2,3,1,4,2,1,3,2,1,4,3,2,1,2,4,1,3,2,4,1,2,3,4,1,2,1,3,2,4,1,2,3];

  importantInfo = [
    { icon: '🛂', title: 'Check-in opens',   desc: '48 hours before departure. Online or at the airport.' },
    { icon: '🧳', title: 'Baggage allowance', desc: '1 cabin bag (7kg) + 1 checked bag (23kg) included.' },
    { icon: '🕐', title: 'Arrive early',      desc: 'Be at the gate at least 45 minutes before departure.' },
    { icon: '📱', title: 'Mobile boarding',   desc: 'Save this page or download your PDF for mobile boarding.' },
  ];

  ngOnInit() {
    if (!this.pnr()) { this.router.navigate(['/']); }
  }

  formatDur(m: number) { return `${Math.floor(m/60)}h ${m%60}m`; }

  copyPnr() {
    navigator.clipboard.writeText(this.pnr() ?? '');
    this.toast.success('PNR copied to clipboard!');
  }

  downloadTicket() {
    const rId = this.reservationId();
    if (!rId) return;
    this.ticketing.getTicketsByReservation(rId).subscribe({
      next: tickets => {
        if (tickets[0]) {
          this.ticketing.downloadPdf(tickets[0].id).subscribe({
            next: blob => {
              const url = URL.createObjectURL(blob);
              const a   = document.createElement('a');
              a.href = url; a.download = `ticket-${this.pnr()}.pdf`; a.click();
              URL.revokeObjectURL(url);
            }
          });
        }
      },
    });
  }

  newSearch() {
    this.store.dispatch(BookingActions.resetBooking());
  }
}
