import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { PaymentService } from '../../services/payment.service';
import { BookingSelectors, BookingActions } from '../../../../store/booking.store';
import { ToastService } from '../../../../core/services/toast.service';
import { StepProgressComponent } from '../../../../shared/components/step-progress/step-progress.component';

type PayTab = 'CREDIT_CARD' | 'UPI' | 'NET_BANKING';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StepProgressComponent],
  template: `
    <app-step-progress [currentStep]="'PAYMENT'" />

    <div class="pay-page">
      <div class="container-app pay-layout">

        <!-- Payment Form -->
        <div class="pay-main">
          <h2 class="pay-title">Secure Payment</h2>
          <p class="pay-sub">Your payment is encrypted with 256-bit SSL.</p>

          <!-- Method Tabs -->
          <div class="pay-tabs">
            @for (tab of tabs; track tab.id) {
              <button class="pay-tab" [class.active]="activeTab() === tab.id"
                (click)="activeTab.set(tab.id)">
                <span class="tab-icon">{{ tab.icon }}</span>
                {{ tab.label }}
              </button>
            }
          </div>

          <div class="pay-form card">

            <!-- Card form -->
            @if (activeTab() === 'CREDIT_CARD') {
              <form [formGroup]="cardForm" (ngSubmit)="pay()">
                <div class="card-preview">
                  <div class="cp-chip"></div>
                  <div class="cp-number">{{ formatCardDisplay() }}</div>
                  <div class="cp-bottom">
                    <div>
                      <div class="cp-label">Card Holder</div>
                      <div class="cp-val">{{ cardForm.get('cardHolder')?.value || 'YOUR NAME' }}</div>
                    </div>
                    <div>
                      <div class="cp-label">Expires</div>
                      <div class="cp-val">{{ cardForm.get('expiryMonth')?.value || 'MM' }}/{{ cardForm.get('expiryYear')?.value || 'YY' }}</div>
                    </div>
                  </div>
                </div>

                <div class="form-grid">
                  <div class="form-group full">
                    <label class="form-label">Card Number</label>
                    <input type="text" formControlName="cardNumber" class="form-input"
                      placeholder="0000 0000 0000 0000" maxlength="19"
                      style="font-family:var(--font-mono);letter-spacing:.1em"
                      (input)="formatCard($event)" />
                  </div>
                  <div class="form-group full">
                    <label class="form-label">Card Holder Name</label>
                    <input type="text" formControlName="cardHolder" class="form-input"
                      placeholder="Name as on card" style="text-transform:uppercase" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Month</label>
                    <select formControlName="expiryMonth" class="form-input">
                      @for (m of months; track m) {
                        <option [value]="m">{{ m }}</option>
                      }
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Year</label>
                    <select formControlName="expiryYear" class="form-input">
                      @for (y of years; track y) {
                        <option [value]="y">{{ y }}</option>
                      }
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">CVV</label>
                    <input type="password" formControlName="cvv" class="form-input"
                      placeholder="•••" maxlength="4"
                      style="font-family:var(--font-mono);letter-spacing:.2em;width:80px" />
                  </div>
                </div>

                <div class="pay-security">
                  <span>🔒 Secured by Stripe · PCI DSS Compliant</span>
                </div>

                <button type="submit" class="btn btn-gold btn-lg pay-btn" [disabled]="loading()">
                  @if (loading()) { <span class="pay-spin"></span> Processing... }
                  @else { Pay USD {{ totalAmount() | number:'1.2-2' }} }
                </button>
              </form>
            }

            <!-- UPI -->
            @if (activeTab() === 'UPI') {
              <div class="upi-form">
                <label class="form-label">UPI ID</label>
                <input type="text" [(ngModel)]="upiId" class="form-input"
                  placeholder="yourname@upi" style="margin-bottom:20px" />
                <button class="btn btn-gold btn-lg pay-btn" (click)="pay()" [disabled]="loading()">
                  @if (loading()) { <span class="pay-spin"></span> Requesting... }
                  @else { Pay via UPI }
                </button>
              </div>
            }

            <!-- Net Banking -->
            @if (activeTab() === 'NET_BANKING') {
              <div class="nb-form">
                <label class="form-label">Select Bank</label>
                <div class="bank-grid">
                  @for (bank of banks; track bank.code) {
                    <button class="bank-btn" [class.active]="selectedBank === bank.code"
                      (click)="selectedBank = bank.code">
                      {{ bank.name }}
                    </button>
                  }
                </div>
                <button class="btn btn-gold btn-lg pay-btn" style="margin-top:20px"
                  (click)="pay()" [disabled]="loading() || !selectedBank">
                  @if (loading()) { <span class="pay-spin"></span> Redirecting... }
                  @else { Continue to Bank }
                </button>
              </div>
            }
          </div>
        </div>

        <!-- Order Summary -->
        <div class="pay-summary">
          <div class="card" style="padding:20px;position:sticky;top:90px">
            <h4 style="margin:0 0 16px;font-size:15px">Order Summary</h4>

            @if (flight()) {
              <div class="os-route">
                <span class="os-code">{{ flight()!.origin.code }}</span>
                <span class="os-arrow">✈</span>
                <span class="os-code">{{ flight()!.destination.code }}</span>
              </div>
              <div class="os-date">{{ flight()!.departureTime | date:'EEE, d MMM · HH:mm' }}</div>
            }

            <div class="os-divider"></div>

            <div class="os-row"><span>Base fare</span><span>USD 450.00</span></div>
            <div class="os-row"><span>Taxes</span><span>USD 68.00</span></div>
            <div class="os-row"><span>Service fee</span><span>USD 21.00</span></div>

            @if (seats().length > 0) {
              <div class="os-row"><span>Seat charges</span><span>USD 0.00</span></div>
            }

            <div class="os-divider"></div>
            <div class="os-row total"><span>Total</span><span>USD {{ totalAmount() | number:'1.2-2' }}</span></div>

            <div style="margin-top:16px">
              <div class="trust-row">✅ Best price guarantee</div>
              <div class="trust-row">🔒 Secure checkout</div>
              <div class="trust-row">🎧 24/7 support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pay-page { background:var(--neutral-100);min-height:calc(100vh - 72px);padding:32px 0 64px; }
    .pay-layout { display:grid;grid-template-columns:1fr 300px;gap:24px;align-items:start; }
    .pay-title { font-family:var(--font-display);font-size:26px;font-weight:500;margin:0 0 4px; }
    .pay-sub { font-size:14px;color:var(--neutral-400);margin:0 0 24px; }

    .pay-tabs { display:flex;gap:8px;margin-bottom:16px; }
    .pay-tab {
      flex:1;padding:12px;border-radius:10px;border:1.5px solid var(--neutral-200);
      background:#fff;font-size:14px;font-weight:500;color:var(--neutral-600);cursor:pointer;
      display:flex;align-items:center;justify-content:center;gap:8px;transition:all .2s;
    }
    .pay-tab.active { border-color:var(--sky-500);background:var(--sky-50);color:var(--sky-600); }
    .tab-icon { font-size:18px; }

    .pay-form { padding:24px; }

    /* Card preview */
    .card-preview {
      background:linear-gradient(135deg,var(--sky-800) 0%,var(--sky-600) 100%);
      border-radius:16px;padding:24px;margin-bottom:24px;
      min-height:160px;display:flex;flex-direction:column;justify-content:space-between;
      position:relative;overflow:hidden;
    }
    .card-preview::before {
      content:'';position:absolute;top:-40px;right:-40px;
      width:180px;height:180px;border-radius:50%;
      background:rgba(255,255,255,.06);
    }

    .cp-chip { width:44px;height:34px;border-radius:6px;background:linear-gradient(135deg,#d4af37,#f0cc6a);opacity:.9; }
    .cp-number { font-family:var(--font-mono);font-size:18px;color:#fff;letter-spacing:.18em;font-weight:500; }
    .cp-bottom { display:flex;gap:32px; }
    .cp-label { font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:rgba(255,255,255,.5);margin-bottom:4px; }
    .cp-val { font-family:var(--font-mono);font-size:14px;color:#fff;font-weight:500; }

    .form-grid { display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:20px; }
    .form-group { display:flex;flex-direction:column;gap:6px; }
    .form-group.full { grid-column:1/-1; }

    .pay-security { font-size:13px;color:var(--neutral-400);margin-bottom:20px;text-align:center; }

    .pay-btn { width:100%;height:52px;font-size:16px; }
    .pay-spin {
      display:inline-block;width:16px;height:16px;
      border:2px solid rgba(0,0,0,.2);border-top-color:var(--neutral-800);
      border-radius:50%;animation:spin .7s linear infinite;margin-right:6px;
    }
    @keyframes spin{to{transform:rotate(360deg)}}

    /* UPI */
    .upi-form { display:flex;flex-direction:column;gap:8px; }

    /* Net banking */
    .bank-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px; }
    .bank-btn {
      padding:12px;border-radius:8px;border:1.5px solid var(--neutral-200);
      background:#fff;font-size:13px;font-weight:500;color:var(--neutral-700);cursor:pointer;transition:all .2s;
    }
    .bank-btn.active { border-color:var(--sky-500);background:var(--sky-50);color:var(--sky-600); }
    .bank-btn:hover { border-color:var(--neutral-300); }

    /* Summary */
    .os-route { display:flex;align-items:center;gap:10px;margin-bottom:6px; }
    .os-code { font-family:var(--font-mono);font-size:18px;font-weight:700;color:var(--neutral-900); }
    .os-arrow { color:var(--sky-400); }
    .os-date { font-size:13px;color:var(--neutral-400); }
    .os-divider { height:1px;background:var(--neutral-200);margin:14px 0; }
    .os-row { display:flex;justify-content:space-between;font-size:14px;color:var(--neutral-600);margin-bottom:8px; }
    .os-row.total { font-weight:700;font-size:16px;color:var(--neutral-900); }
    .trust-row { font-size:13px;color:var(--neutral-600);margin-bottom:6px; }

    @media(max-width:900px){.pay-layout{grid-template-columns:1fr}.pay-summary{display:none}}
  `]
})
export class PaymentComponent implements OnInit {
  private fb      = inject(FormBuilder);
  private store   = inject(Store);
  private router  = inject(Router);
  private svc     = inject(PaymentService);
  private toast   = inject(ToastService);

  loading     = signal(false);
  activeTab   = signal<PayTab>('CREDIT_CARD');

  upiId       = '';
  selectedBank = '';

  flight         = this.store.selectSignal(BookingSelectors.selectedOutbound);
  seats          = this.store.selectSignal(BookingSelectors.selectedSeats);
  reservationId  = this.store.selectSignal(BookingSelectors.reservationId);
  pricing        = this.store.selectSignal(BookingSelectors.pricing);

  totalAmount = () => this.pricing()?.totalAmount ?? 539;

  tabs = [
    { id: 'CREDIT_CARD' as PayTab, icon: '💳', label: 'Card' },
    { id: 'UPI'         as PayTab, icon: '📱', label: 'UPI' },
    { id: 'NET_BANKING' as PayTab, icon: '🏦', label: 'Net Banking' },
  ];

  banks = [
    { code: 'SBI', name: 'SBI' },
    { code: 'HDFC', name: 'HDFC' },
    { code: 'ICICI', name: 'ICICI' },
    { code: 'AXIS', name: 'Axis' },
    { code: 'BOA', name: 'Bank of America' },
    { code: 'CHASE', name: 'Chase' },
  ];

  months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  years  = Array.from({length:10},(_,i) => String(new Date().getFullYear() + i));

  cardForm = this.fb.group({
    cardNumber:  ['', [Validators.required, Validators.minLength(16)]],
    cardHolder:  ['', Validators.required],
    expiryMonth: ['01'],
    expiryYear:  [String(new Date().getFullYear())],
    cvv:         ['', [Validators.required, Validators.minLength(3)]],
  });

  ngOnInit() {
    if (!this.reservationId()) { this.router.navigate(['/']); }
  }

  formatCard(e: Event) {
    const input = e.target as HTMLInputElement;
    const raw   = input.value.replace(/\D/g,'').slice(0,16);
    input.value = raw.match(/.{1,4}/g)?.join(' ') ?? raw;
    this.cardForm.get('cardNumber')?.setValue(raw, {emitEvent: false});
  }

  formatCardDisplay(): string {
    const n = this.cardForm.get('cardNumber')?.value ?? '';
    if (!n) return '•••• •••• •••• ••••';
    const padded = n.padEnd(16,'•');
    return padded.match(/.{1,4}/g)?.join(' ') ?? padded;
  }

  pay() {
    this.loading.set(true);
    const payload: any = {
      reservationId: this.reservationId()!,
      amount:        this.totalAmount(),
      currency:      'USD',
      paymentMethod: this.activeTab(),
    };
    if (this.activeTab() === 'CREDIT_CARD') {
      const c = this.cardForm.value;
      payload.cardDetails = { cardNumber: c.cardNumber, cardHolder: c.cardHolder, expiryMonth: c.expiryMonth, expiryYear: c.expiryYear, cvv: c.cvv };
    }
    this.svc.initiatePayment(payload).subscribe({
      next: () => { this.store.dispatch(BookingActions.setStep({ step: 'CONFIRMATION' })); this.router.navigate(['/ticket']); },
      error: () => { this.loading.set(false); },
    });
  }
}
