import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

type CheckinStep = 'PNR' | 'DETAILS' | 'BOARDING_PASS';

@Component({
  selector: 'app-checkin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="checkin-page">

      <!-- Header -->
      <div class="checkin-header page-hero">
        <div class="hero-overlay"></div>
        <div class="container-app header-content">
          <span class="eyebrow">🛂 Web Check-in</span>
          <h1>Online Check-in</h1>
          <p>Available 24 hours to 1 hour before departure</p>
        </div>
      </div>

      <div class="container-app checkin-content">

        <!-- Step: Enter PNR -->
        @if (step() === 'PNR') {
          <div class="checkin-card card animate-fade-in-up">
            <h2>Enter Booking Reference</h2>
            <p>Enter your PNR (Passenger Name Record) to start check-in.</p>

            <div class="pnr-form">
              <div class="pnr-input-wrap">
                <input type="text" [(ngModel)]="pnrInput"
                  class="pnr-input"
                  placeholder="e.g. SKY7X2"
                  (keyup.enter)="lookupPnr()"
                  maxlength="8"
                  style="text-transform:uppercase;font-family:var(--font-mono);letter-spacing:.15em;font-size:24px" />
              </div>

              <div class="demo-hint">
                <span>Try demo PNR:</span>
                @for (pnr of demoPnrs; track pnr) {
                  <button class="pnr-pill" (click)="pnrInput = pnr">{{ pnr }}</button>
                }
              </div>

              <button class="btn btn-primary btn-lg" (click)="lookupPnr()" [disabled]="loading() || !pnrInput">
                @if (loading()) { <span class="spinner-sm"></span> Looking up... }
                @else { Find My Booking → }
              </button>

              @if (error()) {
                <div class="error-banner">❌ {{ error() }}</div>
              }
            </div>
          </div>
        }

        <!-- Step: Booking Details + Seat Confirm -->
        @if (step() === 'DETAILS' && reservation()) {
          <div class="animate-fade-in-up">
            <div class="booking-found-banner">
              <span class="check">✓</span>
              <div>
                <h3>Booking found — PNR <span class="pnr-display">{{ reservation().pnr }}</span></h3>
                <p>Please verify your details and confirm check-in.</p>
              </div>
            </div>

            <!-- Flight info -->
            <div class="card ci-card">
              <div class="ci-label">Flight Details</div>
              <div class="ci-flight-row">
                <div class="ci-time-block">
                  <div class="ci-time">08:30</div>
                  <div class="ci-iata">JFK</div>
                  <div class="ci-city">New York</div>
                </div>
                <div class="ci-mid">
                  <div class="ci-plane">✈</div>
                  <div class="ci-fn">SW101</div>
                  <div class="ci-direct">Nonstop · 7h 15m</div>
                </div>
                <div class="ci-time-block right">
                  <div class="ci-time">20:45</div>
                  <div class="ci-iata">LHR</div>
                  <div class="ci-city">London</div>
                </div>
              </div>
              <div class="ci-meta">
                <span class="badge badge-neutral">Terminal T4</span>
                <span class="badge badge-neutral">Gate B12</span>
                <span class="badge badge-blue">Economy</span>
              </div>
            </div>

            <!-- Passengers -->
            <div class="card ci-card">
              <div class="ci-label">Passengers</div>
              @for (pax of reservation().passengers; track pax.id) {
                <div class="ci-pax-row">
                  <div class="pax-avatar">{{ pax.firstName[0] }}{{ pax.lastName[0] }}</div>
                  <div class="pax-info">
                    <div class="pax-name">{{ pax.title }} {{ pax.firstName }} {{ pax.lastName }}</div>
                    <div class="pax-detail">{{ pax.nationality }} · PP {{ pax.passportNumber }}</div>
                  </div>
                  <div class="pax-seat">
                    <div class="seat-num">{{ pax.selectedSeatNumber }}</div>
                    <div class="seat-label">Seat</div>
                  </div>
                  <label class="ci-checkbox">
                    <input type="checkbox" [checked]="true" /> Check in
                  </label>
                </div>
              }
            </div>

            <!-- Terms -->
            <div class="ci-terms">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="termsAccepted" />
                <span>I confirm all passenger details are correct and all passengers are aware of carry-on restrictions.</span>
              </label>
            </div>

            <div class="ci-actions">
              <button class="btn btn-outline" (click)="step.set('PNR')">← Back</button>
              <button class="btn btn-primary btn-lg" (click)="completeCheckin()" [disabled]="!termsAccepted || loading()">
                @if (loading()) { <span class="spinner-sm"></span> Processing... }
                @else { Complete Check-in → }
              </button>
            </div>
          </div>
        }

        <!-- Step: Boarding Pass -->
        @if (step() === 'BOARDING_PASS' && boardingPass()) {
          <div class="animate-fade-in-up">
            <div class="success-banner-ci">
              <span>✓</span>
              <div>
                <h3>Check-in Complete!</h3>
                <p>Your boarding pass is ready. Please arrive at the gate by {{ boardingPass().boardingPasses[0].boardingTime }}.</p>
              </div>
            </div>

            @for (bp of boardingPass().boardingPasses; track bp.passengerId) {
              <div class="boarding-pass">
                <!-- Left section -->
                <div class="bp-left">
                  <div class="bp-airline">
                    <span class="bp-logo">SW</span>
                    <div>
                      <div class="bp-airline-name">SkyWay Airlines</div>
                      <div class="bp-fn">{{ bp.flightNumber }}</div>
                    </div>
                  </div>

                  <div class="bp-route">
                    <div class="bp-city">
                      <div class="bp-iata">{{ bp.origin }}</div>
                      <div class="bp-cityname">New York</div>
                    </div>
                    <div class="bp-arrow">✈</div>
                    <div class="bp-city right">
                      <div class="bp-iata">{{ bp.destination }}</div>
                      <div class="bp-cityname">London</div>
                    </div>
                  </div>

                  <div class="bp-meta-grid">
                    <div class="bp-meta-item">
                      <span class="bm-label">Passenger</span>
                      <span class="bm-val">{{ bp.passengerName }}</span>
                    </div>
                    <div class="bp-meta-item">
                      <span class="bm-label">Date</span>
                      <span class="bm-val">{{ bp.departureDate }}</span>
                    </div>
                    <div class="bp-meta-item">
                      <span class="bm-label">Departs</span>
                      <span class="bm-val">{{ bp.departureTime }}</span>
                    </div>
                    <div class="bp-meta-item">
                      <span class="bm-label">Boarding</span>
                      <span class="bm-val boarding-time">{{ bp.boardingTime }}</span>
                    </div>
                  </div>

                  <div class="bp-gate-row">
                    <div class="bp-meta-item">
                      <span class="bm-label">Terminal</span>
                      <span class="bm-val big">{{ bp.terminal }}</span>
                    </div>
                    <div class="bp-meta-item">
                      <span class="bm-label">Gate</span>
                      <span class="bm-val big">{{ bp.gate }}</span>
                    </div>
                    <div class="bp-meta-item">
                      <span class="bm-label">Group</span>
                      <span class="bm-val big">{{ bp.boardingGroup }}</span>
                    </div>
                    <div class="bp-meta-item">
                      <span class="bm-label">Seat</span>
                      <span class="bm-val big seat-highlight">{{ bp.seatNumber }}</span>
                    </div>
                  </div>
                </div>

                <!-- Tear -->
                <div class="bp-tear">
                  <div class="tear-c top"></div>
                  <div class="tear-line-v"></div>
                  <div class="tear-c bottom"></div>
                </div>

                <!-- Right stub -->
                <div class="bp-right">
                  <div class="bp-qr">
                    <div class="qr-mock">
                      <!-- SVG QR placeholder -->
                      <svg viewBox="0 0 60 60" width="120" height="120">
                        <rect x="0" y="0" width="20" height="20" rx="2" fill="currentColor" opacity=".9"/>
                        <rect x="22" y="0" width="4" height="4" rx="1" fill="currentColor" opacity=".6"/>
                        <rect x="28" y="0" width="8" height="8" rx="1" fill="currentColor" opacity=".8"/>
                        <rect x="40" y="0" width="20" height="20" rx="2" fill="currentColor" opacity=".9"/>
                        <rect x="2" y="22" width="4" height="4" rx="1" fill="currentColor" opacity=".6"/>
                        <rect x="10" y="22" width="8" height="8" rx="1" fill="currentColor" opacity=".7"/>
                        <rect x="22" y="22" width="16" height="16" rx="2" fill="currentColor" opacity=".8"/>
                        <rect x="42" y="22" width="4" height="4" rx="1" fill="currentColor" opacity=".6"/>
                        <rect x="0" y="40" width="20" height="20" rx="2" fill="currentColor" opacity=".9"/>
                        <rect x="22" y="40" width="8" height="4" rx="1" fill="currentColor" opacity=".6"/>
                        <rect x="34" y="40" width="4" height="8" rx="1" fill="currentColor" opacity=".7"/>
                        <rect x="42" y="40" width="18" height="20" rx="2" fill="currentColor" opacity=".8"/>
                        <rect x="4" y="4" width="12" height="12" rx="1" fill="#fff"/>
                        <rect x="44" y="4" width="12" height="12" rx="1" fill="#fff"/>
                        <rect x="4" y="44" width="12" height="12" rx="1" fill="#fff"/>
                      </svg>
                    </div>
                    <div class="qr-code-text">{{ bp.qrCode }}</div>
                  </div>
                  <div class="bp-pnr">{{ boardingPass().pnr }}</div>
                </div>
              </div>
            }

            <div class="bp-actions">
              <button class="btn btn-primary" (click)="downloadBoardingPass()">⬇ Download PDF</button>
              <button class="btn btn-outline" (click)="printBoardingPass()">🖨 Print</button>
              <button class="btn btn-ghost" (click)="step.set('PNR')">New Check-in</button>
            </div>
          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    .checkin-page { background:var(--neutral-100);min-height:100vh; }

    .checkin-header { padding:60px 0 40px;min-height:220px; }
    .header-content { position:relative;z-index:1;color:#fff; }
    .eyebrow { font-size:13px;font-weight:500;color:var(--gold-400);text-transform:uppercase;letter-spacing:.1em;display:block;margin-bottom:12px; }
    .checkin-header h1 { font-family:var(--font-display);font-size:40px;font-weight:500;color:#fff;margin:0 0 8px; }
    .checkin-header p  { color:rgba(255,255,255,.6);margin:0; }

    .checkin-content { padding:32px 0 64px; }

    /* PNR form */
    .checkin-card { max-width:520px;margin:0 auto;padding:36px; }
    .checkin-card h2 { font-family:var(--font-display);font-size:24px;font-weight:500;margin:0 0 8px; }
    .checkin-card p  { color:var(--neutral-400);margin:0 0 28px; }

    .pnr-form { display:flex;flex-direction:column;gap:20px; }

    .pnr-input-wrap {
      border:2px solid var(--neutral-200);border-radius:14px;
      padding:16px 20px;
      display:flex;align-items:center;
      transition:border-color .2s;
    }
    .pnr-input-wrap:focus-within { border-color:var(--sky-400); }
    .pnr-input {
      border:none;outline:none;
      width:100%;background:transparent;
      font-family:var(--font-mono);font-size:28px;
      color:var(--neutral-900);letter-spacing:.2em;
      text-transform:uppercase;
    }

    .demo-hint { display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:13px;color:var(--neutral-400); }
    .pnr-pill {
      padding:4px 12px;border-radius:20px;border:1px solid var(--neutral-200);
      background:#fff;font-family:var(--font-mono);font-size:13px;font-weight:600;
      color:var(--sky-500);cursor:pointer;transition:all .2s;
    }
    .pnr-pill:hover { border-color:var(--sky-400);background:var(--sky-50); }

    .error-banner { background:#fef2f2;border:1px solid #fca5a5;border-radius:10px;padding:12px 16px;color:#991b1b;font-size:14px; }

    /* Booking found */
    .booking-found-banner {
      display:flex;align-items:center;gap:16px;
      background:#ecfdf5;border:1px solid #6ee7b7;border-radius:14px;
      padding:20px 24px;margin-bottom:20px;
    }
    .check { width:40px;height:40px;border-radius:50%;background:#10b981;color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0; }
    .booking-found-banner h3 { margin:0 0 4px;font-size:16px;font-weight:600;color:var(--neutral-900); }
    .booking-found-banner p  { margin:0;font-size:14px;color:var(--neutral-600); }
    .pnr-display { font-family:var(--font-mono);font-size:16px;font-weight:700;color:var(--sky-600); }

    .ci-card { padding:20px;margin-bottom:16px; }
    .ci-label { font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--neutral-400);margin-bottom:14px; }

    .ci-flight-row { display:flex;align-items:center;gap:16px;margin-bottom:14px; }
    .ci-time-block { min-width:80px; }
    .ci-time-block.right { text-align:right; }
    .ci-time { font-family:var(--font-display);font-size:28px;font-weight:500;color:var(--neutral-900); }
    .ci-iata { font-family:var(--font-mono);font-size:16px;font-weight:700;color:var(--sky-500); }
    .ci-city { font-size:12px;color:var(--neutral-400); }
    .ci-mid  { flex:1;text-align:center; }
    .ci-plane { font-size:18px;color:var(--sky-400); }
    .ci-fn    { font-size:14px;font-weight:600;color:var(--neutral-700); }
    .ci-direct { font-size:12px;color:var(--neutral-400); }
    .ci-meta { display:flex;gap:8px; }

    .ci-pax-row { display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--neutral-100); }
    .ci-pax-row:last-child { border-bottom:none; }
    .pax-avatar { width:40px;height:40px;border-radius:50%;background:var(--sky-500);color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;flex-shrink:0; }
    .pax-info { flex:1; }
    .pax-name   { font-size:15px;font-weight:600;color:var(--neutral-900); }
    .pax-detail { font-size:13px;color:var(--neutral-400); }
    .pax-seat { text-align:center;margin-right:8px; }
    .seat-num   { font-family:var(--font-mono);font-size:18px;font-weight:700;color:var(--sky-600); }
    .seat-label { font-size:11px;color:var(--neutral-400); }
    .ci-checkbox { display:flex;align-items:center;gap:6px;font-size:14px;cursor:pointer; }
    .ci-checkbox input { accent-color:var(--sky-500); }

    .ci-terms { margin:16px 0; }
    .ci-actions { display:flex;justify-content:space-between;margin-top:20px; }

    /* Success */
    .success-banner-ci {
      display:flex;align-items:center;gap:16px;
      background:linear-gradient(135deg,#064e3b,#065f46);
      border-radius:14px;padding:24px;margin-bottom:24px;color:#fff;
    }
    .success-banner-ci span { font-size:28px;flex-shrink:0; }
    .success-banner-ci h3 { margin:0 0 4px;font-size:18px;font-weight:500; }
    .success-banner-ci p  { margin:0;color:rgba(255,255,255,.7);font-size:14px; }

    /* Boarding pass */
    .boarding-pass {
      background:#fff;border-radius:20px;
      border:1px solid var(--neutral-200);
      box-shadow:var(--shadow-card);
      display:flex;overflow:hidden;margin-bottom:20px;
    }

    .bp-left { flex:1;padding:28px; }

    .bp-airline { display:flex;align-items:center;gap:14px;margin-bottom:24px; }
    .bp-logo { width:44px;height:44px;background:var(--sky-900);color:#fff;border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);font-size:14px;font-weight:700; }
    .bp-airline-name { font-size:15px;font-weight:600;color:var(--neutral-900); }
    .bp-fn { font-size:13px;color:var(--neutral-400); }

    .bp-route { display:flex;align-items:center;gap:16px;margin-bottom:20px; }
    .bp-city { }
    .bp-city.right { text-align:right; }
    .bp-iata { font-family:var(--font-display);font-size:36px;font-weight:500;color:var(--neutral-900); }
    .bp-cityname { font-size:12px;color:var(--neutral-400); }
    .bp-arrow { font-size:18px;color:var(--sky-400);flex:1;text-align:center; }

    .bp-meta-grid { display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:16px; }
    .bp-gate-row { display:grid;grid-template-columns:repeat(4,1fr);gap:8px; }
    .bp-meta-item { }
    .bm-label { font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--neutral-400);display:block;margin-bottom:3px; }
    .bm-val { font-size:14px;font-weight:600;color:var(--neutral-900); }
    .bm-val.big { font-family:var(--font-display);font-size:22px;font-weight:500; }
    .bm-val.boarding-time { color:#10b981; }
    .bm-val.seat-highlight { color:var(--sky-500); }

    /* Tear */
    .bp-tear { width:28px;display:flex;flex-direction:column;align-items:center;background:var(--neutral-50);position:relative; }
    .tear-c { width:18px;height:18px;border-radius:50%;background:var(--neutral-100);border:1px solid var(--neutral-200); }
    .tear-c.top { margin-top:-9px; }
    .tear-c.bottom { margin-bottom:-9px; }
    .tear-line-v { flex:1;border-left:2px dashed var(--neutral-300); }

    /* Right stub */
    .bp-right { width:180px;padding:24px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;background:var(--sky-50); }
    .qr-mock { color:var(--sky-900);margin-bottom:8px; }
    .qr-code-text { font-family:var(--font-mono);font-size:9px;color:var(--neutral-400);text-align:center;word-break:break-all; }
    .bp-pnr { font-family:var(--font-mono);font-size:16px;font-weight:700;color:var(--sky-600);margin-top:8px; }

    .bp-actions { display:flex;gap:10px; }

    .spinner-sm {
      display:inline-block;width:14px;height:14px;
      border:2px solid rgba(255,255,255,.3);border-top-color:#fff;
      border-radius:50%;animation:spin .7s linear infinite;margin-right:6px;
    }
    @keyframes spin { to{transform:rotate(360deg)} }
  `]
})
export class CheckinHomeComponent {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  step        = signal<CheckinStep>('PNR');
  loading     = signal(false);
  error       = signal('');
  reservation = signal<any>(null);
  boardingPass = signal<any>(null);
  pnrInput    = '';
  termsAccepted = false;
  demoPnrs    = ['SKY7X2', 'SKY4M8'];

  lookupPnr() {
    if (!this.pnrInput) return;
    this.loading.set(true);
    this.error.set('');
    this.http.get<any>(`${this.base}/checkin/pnr/${this.pnrInput.toUpperCase()}`).subscribe({
      next: res => {
        this.reservation.set(res.reservation);
        this.step.set('DETAILS');
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Booking not found. Please check your PNR and try again.');
        this.loading.set(false);
      }
    });
  }

  completeCheckin() {
    this.loading.set(true);
    this.http.post<any>(`${this.base}/checkin`, { pnr: this.reservation().pnr }).subscribe({
      next: res => {
        this.boardingPass.set(res);
        this.step.set('BOARDING_PASS');
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  downloadBoardingPass() { alert('Downloading boarding pass PDF…'); }
  printBoardingPass()    { window.print(); }
}
