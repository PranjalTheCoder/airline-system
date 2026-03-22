import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BookingSelectors, BookingActions } from '../../../../store/booking.store';
import { Passenger } from '../../../../core/models';
import { StepProgressComponent } from '../../../../shared/components/step-progress/step-progress.component';

@Component({
  selector: 'app-passenger-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, StepProgressComponent],
  template: `
    <app-step-progress [currentStep]="'PASSENGERS'" />

    <div class="pax-page">
      <div class="container-app pax-layout">

        <div class="pax-main">
          <div class="pax-header">
            <h2>Passenger Details</h2>
            <p>Please enter details exactly as they appear on the passport.</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div formArrayName="passengers">
              @for (paxGroup of passengers.controls; track i; let i = $index) {
                <div class="pax-card card" [formGroupName]="i">
                  <div class="pax-card-header">
                    <div class="pax-number">
                      <span class="pax-badge">{{ i + 1 }}</span>
                      <h3>{{ paxTypeLabel(i) }}</h3>
                    </div>
                    @if (selectedSeats()[i]) {
                      <div class="pax-seat-badge">
                        Seat {{ selectedSeats()[i]?.seatId }}
                      </div>
                    }
                  </div>

                  <div class="form-grid">
                    <!-- Title + First name -->
                    <div class="form-row">
                      <div class="form-group" style="flex:0 0 100px">
                        <label class="form-label">Title</label>
                        <select formControlName="title" class="form-input">
                          <option value="Mr">Mr</option>
                          <option value="Mrs">Mrs</option>
                          <option value="Ms">Ms</option>
                          <option value="Dr">Dr</option>
                        </select>
                      </div>
                      <div class="form-group" style="flex:1">
                        <label class="form-label">First Name</label>
                        <input type="text" formControlName="firstName" class="form-input"
                          [class.error]="isInvalid(i, 'firstName')" placeholder="As on passport" />
                        @if (isInvalid(i, 'firstName')) {
                          <span class="form-error">Required</span>
                        }
                      </div>
                      <div class="form-group" style="flex:1">
                        <label class="form-label">Last Name</label>
                        <input type="text" formControlName="lastName" class="form-input"
                          [class.error]="isInvalid(i, 'lastName')" placeholder="As on passport" />
                        @if (isInvalid(i, 'lastName')) {
                          <span class="form-error">Required</span>
                        }
                      </div>
                    </div>

                    <!-- DOB + Gender + Nationality -->
                    <div class="form-row">
                      <div class="form-group" style="flex:1">
                        <label class="form-label">Date of Birth</label>
                        <input type="date" formControlName="dateOfBirth" class="form-input"
                          [class.error]="isInvalid(i, 'dateOfBirth')" [max]="today" />
                        @if (isInvalid(i, 'dateOfBirth')) {
                          <span class="form-error">Required</span>
                        }
                      </div>
                      <div class="form-group" style="flex:1">
                        <label class="form-label">Gender</label>
                        <select formControlName="gender" class="form-input">
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                      <div class="form-group" style="flex:1">
                        <label class="form-label">Nationality</label>
                        <input type="text" formControlName="nationality" class="form-input"
                          [class.error]="isInvalid(i, 'nationality')" placeholder="e.g. American" />
                        @if (isInvalid(i, 'nationality')) {
                          <span class="form-error">Required</span>
                        }
                      </div>
                    </div>

                    <!-- Passport -->
                    <div class="form-row">
                      <div class="form-group" style="flex:1">
                        <label class="form-label">Passport Number</label>
                        <input type="text" formControlName="passportNumber" class="form-input"
                          [class.error]="isInvalid(i, 'passportNumber')" placeholder="A12345678"
                          style="font-family: var(--font-mono); text-transform: uppercase;" />
                        @if (isInvalid(i, 'passportNumber')) {
                          <span class="form-error">Required</span>
                        }
                      </div>
                      <div class="form-group" style="flex:1">
                        <label class="form-label">Passport Expiry</label>
                        <input type="date" formControlName="passportExpiry" class="form-input"
                          [class.error]="isInvalid(i, 'passportExpiry')" [min]="today" />
                        @if (isInvalid(i, 'passportExpiry')) {
                          <span class="form-error">Must be valid</span>
                        }
                      </div>
                      <div class="form-group" style="flex:1">
                        <label class="form-label">Meal Preference</label>
                        <select formControlName="mealPreference" class="form-input">
                          <option value="STANDARD">Standard</option>
                          <option value="VEGETARIAN">Vegetarian</option>
                          <option value="VEGAN">Vegan</option>
                          <option value="HALAL">Halal</option>
                          <option value="KOSHER">Kosher</option>
                          <option value="GLUTEN_FREE">Gluten Free</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Contact Info -->
            <div class="contact-card card" formGroupName="contact">
              <h3 class="contact-title">Contact Information</h3>
              <p class="contact-sub">We'll send your itinerary and updates here.</p>
              <div class="form-row">
                <div class="form-group" style="flex:1">
                  <label class="form-label">Email Address</label>
                  <input type="email" formControlName="email" class="form-input"
                    [class.error]="form.get('contact.email')?.invalid && form.get('contact.email')?.touched"
                    placeholder="your@email.com" />
                </div>
                <div class="form-group" style="flex:1">
                  <label class="form-label">Phone Number</label>
                  <input type="tel" formControlName="phone" class="form-input"
                    placeholder="+1 234 567 8900" />
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-outline" (click)="goBack()">← Back to Seats</button>
              <button type="submit" class="btn btn-primary btn-lg" [disabled]="loading()">
                @if (loading()) { <span class="spinner-sm"></span> Saving... }
                @else { Continue to Review → }
              </button>
            </div>
          </form>
        </div>

        <!-- Mini booking summary -->
        <div class="booking-mini-summary">
          <div class="card" style="padding:20px;position:sticky;top:90px">
            <h4 style="margin:0 0 16px;font-size:15px">Booking Summary</h4>
            @if (flight()) {
              <div class="bms-route">
                <span class="bms-code">{{ flight()!.origin.code }}</span>
                <span style="color:var(--neutral-400)">✈</span>
                <span class="bms-code">{{ flight()!.destination.code }}</span>
              </div>
              <div class="bms-detail">{{ flight()!.departureTime | date:'EEE d MMM · HH:mm' }}</div>
              <div class="bms-detail">{{ flight()!.flightNumber }}</div>
            }
            <div class="bms-divider"></div>
            <div class="bms-row">
              <span>Passengers</span>
              <span>{{ searchParams()?.adults ?? 1 }} Adult(s)</span>
            </div>
            <div class="bms-row">
              <span>Cabin</span>
              <span>{{ cabinClass() | titlecase }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .pax-page {
      background: var(--neutral-100);
      min-height: calc(100vh - 72px);
      padding: 32px 0 64px;
    }

    .pax-layout {
      display: grid;
      grid-template-columns: 1fr 280px;
      gap: 24px;
      align-items: start;
    }

    .pax-header { margin-bottom: 24px; }
    .pax-header h2 {
      font-family: var(--font-display);
      font-size: 26px;
      font-weight: 500;
      margin: 0 0 6px;
    }
    .pax-header p { color: var(--neutral-400); margin: 0; font-size: 14px; }

    .pax-card {
      padding: 24px;
      margin-bottom: 20px;
    }

    .pax-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .pax-number {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .pax-badge {
      width: 28px; height: 28px;
      border-radius: 50%;
      background: var(--sky-500);
      color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: 13px;
      font-weight: 700;
    }

    .pax-number h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
      color: var(--neutral-900);
    }

    .pax-seat-badge {
      font-family: var(--font-mono);
      font-size: 13px;
      font-weight: 600;
      background: var(--sky-50);
      color: var(--sky-600);
      padding: 4px 12px;
      border-radius: 20px;
    }

    .form-grid { display: flex; flex-direction: column; gap: 16px; }

    .form-row {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .contact-card {
      padding: 24px;
      margin-bottom: 24px;
    }
    .contact-title { font-family: var(--font-display); font-size: 18px; font-weight: 500; margin: 0 0 4px; }
    .contact-sub   { font-size: 14px; color: var(--neutral-400); margin: 0 0 20px; }

    .form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .spinner-sm {
      display: inline-block;
      width: 14px; height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      margin-right: 6px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Mini summary */
    .bms-route { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
    .bms-code  { font-family: var(--font-mono); font-size: 20px; font-weight: 700; color: var(--neutral-900); }
    .bms-detail { font-size: 13px; color: var(--neutral-400); margin-bottom: 4px; }
    .bms-divider { height: 1px; background: var(--neutral-200); margin: 14px 0; }
    .bms-row {
      display: flex; justify-content: space-between;
      font-size: 13px; color: var(--neutral-600);
      margin-bottom: 8px;
    }
    .bms-row span:last-child { font-weight: 600; color: var(--neutral-900); }

    @media (max-width: 900px) {
      .pax-layout { grid-template-columns: 1fr; }
      .booking-mini-summary { display: none; }
    }
  `]
})
export class PassengerDetailsComponent implements OnInit {
  private fb     = inject(FormBuilder);
  private store  = inject(Store);
  private router = inject(Router);

  loading = signal(false);
  today   = new Date().toISOString().split('T')[0];

  flight        = this.store.selectSignal(BookingSelectors.selectedOutbound);
  cabinClass    = this.store.selectSignal(BookingSelectors.cabinClass);
  searchParams  = this.store.selectSignal(BookingSelectors.searchParams);
  selectedSeats = this.store.selectSignal(BookingSelectors.selectedSeats);

  form = this.fb.group({
    passengers: this.fb.array([]),
    contact: this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
    }),
  });

  get passengers(): FormArray { return this.form.get('passengers') as FormArray; }

  ngOnInit() {
    if (!this.flight()) { this.router.navigate(['/']); return; }
    const count = (this.searchParams()?.adults ?? 1) + (this.searchParams()?.children ?? 0);
    for (let i = 0; i < count; i++) { this.passengers.push(this.buildPassengerGroup(i)); }
  }

  buildPassengerGroup(index: number): FormGroup {
    return this.fb.group({
      type:           [index === 0 ? 'ADULT' : 'ADULT'],
      title:          ['Mr'],
      firstName:      ['', Validators.required],
      lastName:       ['', Validators.required],
      dateOfBirth:    ['', Validators.required],
      gender:         ['MALE'],
      nationality:    ['', Validators.required],
      passportNumber: ['', Validators.required],
      passportExpiry: ['', Validators.required],
      mealPreference: ['STANDARD'],
    });
  }

  isInvalid(i: number, field: string): boolean {
    const c = (this.passengers.at(i) as FormGroup).get(field);
    return !!(c?.invalid && c.touched);
  }

  paxTypeLabel(i: number): string {
    return i === 0 ? 'Lead Passenger (Adult)' : `Passenger ${i + 1}`;
  }

  goBack() { this.router.navigate(['/seats']); }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);

    const paxValues = this.passengers.value as Passenger[];
    const contact   = this.form.get('contact')!.value;

    this.store.dispatch(BookingActions.setPassengers({ passengers: paxValues }));
    this.store.dispatch(BookingActions.setContactInfo({ email: contact.email ?? '', phone: contact.phone ?? '' }));

    this.loading.set(false);
    this.router.navigate(['/review']);
  }
}
