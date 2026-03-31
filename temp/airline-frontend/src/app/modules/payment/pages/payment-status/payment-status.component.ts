import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { BookingSelectors, BookingActions } from '../../../../store/booking.store';
import { environment } from '../../../../../environments/environment';

type PayStatus = 'LOADING' | 'SUCCESS' | 'FAILED' | 'PENDING';

@Component({
  selector:   'app-payment-status',
  standalone: true,
  imports:    [CommonModule, RouterLink],
  template: `
    <div class="ps-page">
      <div class="container-app" style="max-width:600px;padding-top:80px;padding-bottom:80px">

        <!-- Loading -->
        @if (status() === 'LOADING') {
          <div class="ps-card card">
            <div class="ps-spinner-wrap">
              <div class="ps-spinner"></div>
            </div>
            <h2>Verifying Payment...</h2>
            <p>Please wait while we confirm your payment. Do not close this page.</p>
          </div>
        }

        <!-- Success -->
        @if (status() === 'SUCCESS') {
          <div class="ps-card card success">
            <div class="ps-icon success-icon">✓</div>
            <h2>Payment Successful!</h2>
            <p>Your booking is confirmed. We've sent a confirmation to your email.</p>

            @if (paymentInfo()) {
              <div class="ps-details">
                <div class="ps-row"><span>Transaction ID</span><strong>{{ paymentInfo().transactionRef }}</strong></div>
                <div class="ps-row"><span>Amount Paid</span><strong>{{ paymentInfo().currency }} {{ paymentInfo().amount | number:'1.2-2' }}</strong></div>
                <div class="ps-row"><span>PNR</span><strong style="font-family:var(--font-mono);color:var(--sky-600);font-size:16px">{{ pnr() }}</strong></div>
                <div class="ps-row"><span>Paid at</span><strong>{{ paymentInfo().paidAt | date:'d MMM yyyy · HH:mm' }}</strong></div>
              </div>
            }

            <div class="ps-actions">
              <a routerLink="/ticket"      class="btn btn-primary btn-lg">View Boarding Pass →</a>
              <a routerLink="/my-bookings" class="btn btn-outline">My Bookings</a>
            </div>
          </div>
        }

        <!-- Failed -->
        @if (status() === 'FAILED') {
          <div class="ps-card card failed">
            <div class="ps-icon failed-icon">✕</div>
            <h2>Payment Failed</h2>
            <p>{{ errorMessage() }}</p>

            <div class="ps-reasons">
              <h4>Common reasons:</h4>
              <ul>
                <li>Insufficient funds on card</li>
                <li>Card details entered incorrectly</li>
                <li>Transaction declined by your bank</li>
                <li>Network timeout during processing</li>
              </ul>
            </div>

            <div class="ps-actions">
              <button class="btn btn-primary btn-lg" (click)="retryPayment()">
                @if (retrying()) { <span class="spin-sm"></span> Retrying... }
                @else { Try Again }
              </button>
              <a routerLink="/payment" class="btn btn-outline">Change Payment Method</a>
            </div>
          </div>
        }

        <!-- Pending -->
        @if (status() === 'PENDING') {
          <div class="ps-card card pending">
            <div class="ps-icon pending-icon">⌛</div>
            <h2>Payment Pending</h2>
            <p>Your payment is being processed. This may take a few minutes.</p>

            <div class="ps-details">
              <div class="ps-row"><span>Status</span><span class="badge badge-amber">Processing</span></div>
              @if (paymentInfo()) {
                <div class="ps-row"><span>Amount</span><strong>{{ paymentInfo().currency }} {{ paymentInfo().amount | number:'1.2-2' }}</strong></div>
              }
            </div>

            <p class="ps-note">
              We'll send you an email once the payment is confirmed. Your booking will be held for 30 minutes.
            </p>

            <div class="ps-actions">
              <button class="btn btn-primary" (click)="checkStatus()">
                @if (checking()) { Checking... } @else { ↺ Check Status }
              </button>
              <a routerLink="/" class="btn btn-outline">Return to Home</a>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .ps-page { background: var(--neutral-100); min-height: 100vh; }

    .ps-card {
      padding: 40px 36px;
      text-align: center;
    }

    .ps-spinner-wrap { display: flex; justify-content: center; margin-bottom: 28px; }
    .ps-spinner {
      width: 56px; height: 56px;
      border: 4px solid var(--neutral-200);
      border-top-color: var(--sky-500);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .ps-card h2 { font-family: var(--font-display); font-size: 28px; font-weight: 500; margin: 0 0 12px; }
    .ps-card p  { color: var(--neutral-500); font-size: 15px; margin: 0 0 28px; line-height: 1.6; }

    .ps-icon {
      width: 72px; height: 72px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 28px; font-weight: 700; margin: 0 auto 24px;
    }
    .success-icon { background: #d1fae5; color: #065f46; }
    .failed-icon  { background: #fee2e2; color: #991b1b; }
    .pending-icon { background: #fef3c7; color: #92400e; }

    .ps-details {
      background: var(--neutral-50); border-radius: 12px;
      padding: 16px; margin-bottom: 28px; text-align: left;
    }
    .ps-row {
      display: flex; justify-content: space-between;
      font-size: 14px; color: var(--neutral-600);
      padding: 8px 0; border-bottom: 1px solid var(--neutral-200);
    }
    .ps-row:last-child { border-bottom: none; }
    .ps-row strong { color: var(--neutral-900); font-weight: 600; }

    .ps-reasons {
      background: #fef2f2; border-radius: 12px; padding: 16px;
      text-align: left; margin-bottom: 24px;
    }
    .ps-reasons h4 { font-size: 14px; font-weight: 600; color: var(--neutral-800); margin: 0 0 10px; }
    .ps-reasons ul { margin: 0; padding-left: 18px; }
    .ps-reasons li { font-size: 13px; color: var(--neutral-600); margin-bottom: 6px; }

    .ps-note { font-size: 13px; color: var(--neutral-400); background: var(--neutral-50); border-radius: 10px; padding: 14px; margin-bottom: 24px; }

    .ps-actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }

    .spin-sm {
      display: inline-block; width: 14px; height: 14px;
      border: 2px solid rgba(255,255,255,.3); border-top-color: #fff;
      border-radius: 50%; animation: spin .7s linear infinite; margin-right: 6px;
    }
  `]
})
export class PaymentStatusComponent implements OnInit {
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private http   = inject(HttpClient);
  private store  = inject(Store);

  status       = signal<PayStatus>('LOADING');
  paymentInfo  = signal<any>(null);
  errorMessage = signal('Your payment could not be processed. Please try again.');
  retrying     = signal(false);
  checking     = signal(false);

  pnr          = this.store.selectSignal(BookingSelectors.pnr);
  reservationId = this.store.selectSignal(BookingSelectors.reservationId);

  ngOnInit() {
    const payId = this.route.snapshot.queryParamMap.get('paymentId');
    if (payId) {
      this.checkPaymentStatus(payId);
    } else {
      // Direct navigation from payment page — check store
      const rId = this.reservationId();
      if (!rId) { this.router.navigate(['/']); return; }
      this.status.set('SUCCESS');
    }
  }

  checkPaymentStatus(paymentId: string) {
    this.http.get<any>(`${environment.apiUrl}/payments/${paymentId}`).subscribe({
      next: p => {
        this.paymentInfo.set(p);
        if (p.status === 'SUCCESS')  { this.status.set('SUCCESS'); }
        else if (p.status === 'FAILED') { this.status.set('FAILED'); this.errorMessage.set(p.message ?? 'Payment declined.'); }
        else                          { this.status.set('PENDING'); }
      },
      error: () => { this.status.set('FAILED'); }
    });
  }

  checkStatus() {
    this.checking.set(true);
    const payId = this.route.snapshot.queryParamMap.get('paymentId');
    if (payId) {
      this.checkPaymentStatus(payId);
      setTimeout(() => this.checking.set(false), 1500);
    }
  }

  retryPayment() {
    this.retrying.set(true);
    const rId = this.reservationId();
    if (!rId) { this.router.navigate(['/payment']); return; }

    this.http.post<any>(`${environment.apiUrl}/payments/${rId}/retry`, {}).subscribe({
      next: p => {
        this.retrying.set(false);
        if (p.status === 'SUCCESS') {
          this.paymentInfo.set(p);
          this.status.set('SUCCESS');
          this.store.dispatch(BookingActions.setStep({ step: 'CONFIRMATION' }));
        }
      },
      error: () => this.retrying.set(false),
    });
  }
}
