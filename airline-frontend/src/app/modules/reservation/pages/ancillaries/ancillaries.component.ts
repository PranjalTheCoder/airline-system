import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BookingSelectors, BookingActions } from '../../../../store/booking.store';
import { StepProgressComponent } from '../../../../shared/components/step-progress/step-progress.component';

interface BaggageOption { id: string; label: string; weight: string; price: number; icon: string; popular?: boolean; }
interface MealOption    { id: string; label: string; desc: string; icon: string; price: number; tags: string[]; }
interface Extra         { id: string; label: string; desc: string; icon: string; price: number; }

@Component({
  selector:   'app-ancillaries',
  standalone: true,
  imports:    [CommonModule, StepProgressComponent],
  template: `
    <app-step-progress [currentStep]="'PASSENGERS'" />

    <div class="ancil-page">
      <div class="container-app ancil-layout">

        <!-- Main column -->
        <div class="ancil-main">
          <div class="ancil-header">
            <h2>Add Extras</h2>
            <p>Enhance your journey with additional services.</p>
          </div>

          <!-- Baggage section -->
          <div class="ancil-section">
            <div class="section-label">
              <span class="sl-icon">🧳</span>
              <div>
                <h3>Additional Baggage</h3>
                <p>Your fare includes 1 × 23kg checked bag</p>
              </div>
            </div>

            <div class="options-grid">
              @for (bag of baggageOptions; track bag.id) {
                <div class="option-card"
                  [class.selected]="selectedBaggage()?.id === bag.id"
                  (click)="toggleBaggage(bag)">
                  @if (bag.popular) {
                    <div class="popular-tag">Popular</div>
                  }
                  <div class="oc-icon">{{ bag.icon }}</div>
                  <div class="oc-label">{{ bag.label }}</div>
                  <div class="oc-sub">{{ bag.weight }}</div>
                  @if (bag.price > 0) {
                    <div class="oc-price">+ USD {{ bag.price }}</div>
                  } @else {
                    <div class="oc-price free">Included</div>
                  }
                  @if (selectedBaggage()?.id === bag.id) {
                    <div class="oc-check">✓</div>
                  }
                </div>
              }
            </div>
          </div>

          <!-- Meal section -->
          <div class="ancil-section">
            <div class="section-label">
              <span class="sl-icon">🍽</span>
              <div>
                <h3>Meal Preferences</h3>
                <p>Standard meal included · Upgrade to a premium option</p>
              </div>
            </div>

            <div class="meal-grid">
              @for (meal of mealOptions; track meal.id) {
                <div class="meal-card"
                  [class.selected]="selectedMeal()?.id === meal.id"
                  (click)="selectMeal(meal)">
                  <div class="mc-top">
                    <span class="mc-icon">{{ meal.icon }}</span>
                    <div class="mc-tags">
                      @for (tag of meal.tags; track tag) {
                        <span class="mc-tag">{{ tag }}</span>
                      }
                    </div>
                  </div>
                  <div class="mc-label">{{ meal.label }}</div>
                  <div class="mc-desc">{{ meal.desc }}</div>
                  <div class="mc-price">
                    @if (meal.price > 0) { + USD {{ meal.price }} }
                    @else { Included }
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Extras section -->
          <div class="ancil-section">
            <div class="section-label">
              <span class="sl-icon">⭐</span>
              <div>
                <h3>Travel Extras</h3>
                <p>Make your journey even more comfortable</p>
              </div>
            </div>

            <div class="extras-list">
              @for (extra of extras; track extra.id) {
                <div class="extra-row"
                  [class.selected]="selectedExtras().includes(extra.id)"
                  (click)="toggleExtra(extra.id)">
                  <span class="extra-icon">{{ extra.icon }}</span>
                  <div class="extra-info">
                    <div class="extra-label">{{ extra.label }}</div>
                    <div class="extra-desc">{{ extra.desc }}</div>
                  </div>
                  <div class="extra-price">
                    @if (extra.price > 0) { + USD {{ extra.price }} }
                    @else { Free }
                  </div>
                  <div class="extra-toggle" [class.on]="selectedExtras().includes(extra.id)">
                    {{ selectedExtras().includes(extra.id) ? '✓' : '+' }}
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Actions -->
          <div class="ancil-actions">
            <button class="btn btn-outline" (click)="skip()">Skip for now</button>
            <button class="btn btn-primary btn-lg" (click)="proceed()">
              Continue → Review Booking
            </button>
          </div>
        </div>

        <!-- Summary sidebar -->
        <div class="ancil-sidebar">
          <div class="card summary-sticky">
            <h4>Your Extras</h4>

            @if (!selectedBaggage() && !selectedMeal() && selectedExtras().length === 0) {
              <p class="no-extras">No extras selected yet.</p>
            }

            @if (selectedBaggage() && selectedBaggage()!.price > 0) {
              <div class="sum-row">
                <span>{{ selectedBaggage()!.icon }} {{ selectedBaggage()!.label }}</span>
                <span>+ USD {{ selectedBaggage()!.price }}</span>
              </div>
            }

            @if (selectedMeal() && selectedMeal()!.price > 0) {
              <div class="sum-row">
                <span>{{ selectedMeal()!.icon }} {{ selectedMeal()!.label }}</span>
                <span>+ USD {{ selectedMeal()!.price }}</span>
              </div>
            }

            @for (id of selectedExtras(); track id) {
              <div class="sum-row">
                <span>{{ getExtra(id)?.icon }} {{ getExtra(id)?.label }}</span>
                <span>{{ getExtra(id)?.price === 0 ? 'Free' : '+ USD ' + getExtra(id)?.price }}</span>
              </div>
            }

            @if (extrasTotal() > 0) {
              <div class="sum-total">
                <span>Extras subtotal</span>
                <span class="total-val">+ USD {{ extrasTotal() }}</span>
              </div>
            }

            <div class="sum-base">
              <span>Base fare (estimated)</span>
              <span>USD 580</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .ancil-page { background: var(--neutral-100); min-height: calc(100vh - 72px); padding: 32px 0 64px; }

    .ancil-layout { display: grid; grid-template-columns: 1fr 280px; gap: 24px; align-items: start; }

    .ancil-header { margin-bottom: 28px; }
    .ancil-header h2 { font-family: var(--font-display); font-size: 26px; font-weight: 500; margin: 0 0 6px; }
    .ancil-header p  { color: var(--neutral-400); margin: 0; font-size: 14px; }

    /* Section */
    .ancil-section {
      background: #fff; border-radius: 16px; border: 1px solid var(--neutral-200);
      padding: 24px; margin-bottom: 20px;
    }

    .section-label { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 20px; }
    .sl-icon { font-size: 28px; flex-shrink: 0; }
    .section-label h3 { font-size: 17px; font-weight: 600; margin: 0 0 4px; }
    .section-label p  { font-size: 13px; color: var(--neutral-400); margin: 0; }

    /* Baggage options */
    .options-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }

    .option-card {
      border: 2px solid var(--neutral-200); border-radius: 12px;
      padding: 16px 12px; text-align: center; cursor: pointer;
      transition: all 0.2s; position: relative; overflow: hidden;
    }
    .option-card:hover { border-color: var(--sky-300); }
    .option-card.selected { border-color: var(--sky-500); background: var(--sky-50); }

    .popular-tag {
      position: absolute; top: 0; right: 0;
      background: var(--gold-400); color: var(--neutral-900);
      font-size: 10px; font-weight: 700; padding: 3px 8px;
      border-radius: 0 10px 0 8px; text-transform: uppercase;
    }

    .oc-icon  { font-size: 28px; margin-bottom: 8px; }
    .oc-label { font-size: 13px; font-weight: 600; color: var(--neutral-900); margin-bottom: 4px; }
    .oc-sub   { font-size: 11px; color: var(--neutral-400); margin-bottom: 8px; }
    .oc-price { font-size: 13px; font-weight: 700; color: var(--sky-500); }
    .oc-price.free { color: #10b981; }
    .oc-check { position: absolute; top: 8px; left: 8px; width: 18px; height: 18px; border-radius: 50%; background: var(--sky-500); color: #fff; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; }

    /* Meals */
    .meal-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }

    .meal-card {
      border: 2px solid var(--neutral-200); border-radius: 12px;
      padding: 16px; cursor: pointer; transition: all 0.2s;
    }
    .meal-card:hover { border-color: var(--sky-300); }
    .meal-card.selected { border-color: var(--sky-500); background: var(--sky-50); }

    .mc-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
    .mc-icon { font-size: 28px; }
    .mc-tags { display: flex; gap: 4px; flex-wrap: wrap; justify-content: flex-end; }
    .mc-tag { font-size: 10px; padding: 2px 6px; border-radius: 4px; background: var(--neutral-100); color: var(--neutral-600); }
    .mc-label { font-size: 14px; font-weight: 600; color: var(--neutral-900); margin-bottom: 4px; }
    .mc-desc  { font-size: 12px; color: var(--neutral-400); margin-bottom: 8px; line-height: 1.4; }
    .mc-price { font-size: 13px; font-weight: 600; color: var(--sky-500); }

    /* Extras */
    .extras-list { display: flex; flex-direction: column; gap: 10px; }

    .extra-row {
      display: flex; align-items: center; gap: 14px;
      padding: 14px 16px; border: 2px solid var(--neutral-200);
      border-radius: 12px; cursor: pointer; transition: all 0.2s;
    }
    .extra-row:hover { border-color: var(--sky-300); }
    .extra-row.selected { border-color: var(--sky-500); background: var(--sky-50); }

    .extra-icon  { font-size: 24px; flex-shrink: 0; }
    .extra-info  { flex: 1; }
    .extra-label { font-size: 14px; font-weight: 600; color: var(--neutral-900); }
    .extra-desc  { font-size: 12px; color: var(--neutral-400); }
    .extra-price { font-size: 13px; font-weight: 600; color: var(--sky-500); flex-shrink: 0; }

    .extra-toggle {
      width: 28px; height: 28px; border-radius: 50%;
      background: var(--neutral-200); color: var(--neutral-600);
      display: flex; align-items: center; justify-content: center;
      font-size: 14px; font-weight: 700; transition: all 0.2s;
      flex-shrink: 0;
    }
    .extra-toggle.on { background: var(--sky-500); color: #fff; }

    /* Actions */
    .ancil-actions { display: flex; justify-content: space-between; margin-top: 8px; }

    /* Sidebar */
    .summary-sticky { padding: 20px; position: sticky; top: 90px; }
    .summary-sticky h4 { font-size: 15px; font-weight: 600; margin: 0 0 16px; }
    .no-extras { font-size: 13px; color: var(--neutral-400); text-align: center; padding: 16px 0; }
    .sum-row { display: flex; justify-content: space-between; font-size: 13px; color: var(--neutral-700); padding: 6px 0; border-bottom: 1px solid var(--neutral-100); }
    .sum-total { display: flex; justify-content: space-between; font-size: 14px; font-weight: 700; padding: 10px 0; margin-top: 4px; }
    .total-val { color: var(--sky-500); }
    .sum-base { display: flex; justify-content: space-between; font-size: 13px; color: var(--neutral-400); padding: 8px 0; border-top: 1px solid var(--neutral-200); margin-top: 4px; }

    @media (max-width: 900px) {
      .ancil-layout { grid-template-columns: 1fr; }
      .ancil-sidebar { display: none; }
      .options-grid { grid-template-columns: repeat(2, 1fr); }
      .meal-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class AncillariesComponent {
  private store  = inject(Store);
  private router = inject(Router);

  selectedBaggage = signal<BaggageOption | null>(null);
  selectedMeal    = signal<MealOption | null>(null);
  selectedExtras  = signal<string[]>([]);

  baggageOptions: BaggageOption[] = [
    { id: 'BAG0', label: 'No extra bag',     weight: '1 × 23kg included', price: 0,  icon: '✓' },
    { id: 'BAG1', label: 'Extra 23kg bag',   weight: '+ 1 × 23kg',        price: 45, icon: '🧳', popular: true },
    { id: 'BAG2', label: 'Extra 32kg bag',   weight: '+ 1 × 32kg',        price: 65, icon: '🧳' },
    { id: 'BAG3', label: '2 Extra bags',     weight: '+ 2 × 23kg',        price: 80, icon: '🗄' },
  ];

  mealOptions: MealOption[] = [
    { id: 'MEAL_STD',  label: 'Standard',       desc: 'Chef-selected main course with sides', icon: '🍽', price: 0,  tags: ['Included'] },
    { id: 'MEAL_VEG',  label: 'Vegetarian',     desc: 'Fresh seasonal vegetables & grains',  icon: '🥗', price: 0,  tags: ['Veg'] },
    { id: 'MEAL_VEGAN',label: 'Vegan',           desc: 'Plant-based gourmet selection',        icon: '🌱', price: 0,  tags: ['Vegan'] },
    { id: 'MEAL_HLK',  label: 'Halal',           desc: 'Certified halal meal',                icon: '☪', price: 0,  tags: ['Halal'] },
    { id: 'MEAL_PRE',  label: 'Premium Dining',  desc: 'Multi-course meal with wine pairing',  icon: '🍷', price: 28, tags: ['Premium'] },
    { id: 'MEAL_KID',  label: 'Kids Meal',       desc: 'Child-friendly fun meal box',          icon: '🧒', price: 0,  tags: ['Kids'] },
  ];

  extras: Extra[] = [
    { id: 'LOUNGE',   label: 'Airport Lounge Access',    desc: 'Complimentary access to SkyWay Lounge',  icon: '🛋', price: 35  },
    { id: 'FAST',     label: 'Priority Boarding',        desc: 'Board before all other passengers',       icon: '⚡', price: 15  },
    { id: 'WIFI',     label: 'In-flight Wi-Fi',           desc: 'Full-flight internet access',             icon: '📶', price: 18  },
    { id: 'SEAT_CHG', label: 'Flexible Seat Change',     desc: 'Change your seat up to 24h before',      icon: '💺', price: 0   },
    { id: 'REFUND',   label: 'Refundable Ticket',        desc: 'Full refund if plans change',             icon: '🔄', price: 89  },
    { id: 'TRAVEL_INS',label: 'Travel Insurance',        desc: 'Medical & cancellation coverage',         icon: '🛡', price: 24  },
  ];

  extrasTotal = computed(() => {
    let total = 0;
    if (this.selectedBaggage()?.price) total += this.selectedBaggage()!.price;
    if (this.selectedMeal()?.price)    total += this.selectedMeal()!.price;
    this.selectedExtras().forEach(id => {
      total += this.getExtra(id)?.price ?? 0;
    });
    return total;
  });

  toggleBaggage(bag: BaggageOption) {
    this.selectedBaggage.set(
      this.selectedBaggage()?.id === bag.id ? null : bag
    );
  }

  selectMeal(meal: MealOption) {
    this.selectedMeal.set(
      this.selectedMeal()?.id === meal.id ? null : meal
    );
  }

  toggleExtra(id: string) {
    this.selectedExtras.update(arr =>
      arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id]
    );
  }

  getExtra(id: string): Extra | undefined {
    return this.extras.find(e => e.id === id);
  }

  skip()    { this.router.navigate(['/review']); }
  proceed() { this.router.navigate(['/review']); }
}
