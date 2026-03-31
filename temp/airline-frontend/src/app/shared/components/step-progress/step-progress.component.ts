import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingStep } from '../../../core/models';

interface Step { id: BookingStep; label: string; icon: string; }

@Component({
  selector: 'app-step-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="step-bar">
      <div class="container-app">
        <div class="step-progress">
          @for (step of steps; track step.id; let i = $index) {
            <!-- Line before (except first) -->
            @if (i > 0) {
              <div class="step-line" [class.done]="isCompleted(step.id)"></div>
            }

            <div class="step-item">
              <div class="step-circle"
                   [class.active]="isCurrent(step.id)"
                   [class.done]="isCompleted(step.id)">
                @if (isCompleted(step.id)) {
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7l3 3 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                } @else {
                  {{ step.icon }}
                }
              </div>
              <span class="step-label"
                    [class.active]="isCurrent(step.id)"
                    [class.done]="isCompleted(step.id)">
                {{ step.label }}
              </span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .step-bar {
      background: #fff;
      border-bottom: 1px solid var(--neutral-200);
      padding: 16px 0;
    }

    .step-progress {
      display: flex;
      align-items: center;
    }

    .step-item {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }

    .step-line {
      flex: 1;
      height: 2px;
      background: var(--neutral-200);
      min-width: 24px;
      transition: background 0.4s ease;
    }
    .step-line.done { background: #10b981; }

    .step-circle {
      width: 30px; height: 30px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 13px;
      font-weight: 600;
      border: 2px solid var(--neutral-200);
      background: #fff;
      color: var(--neutral-400);
      transition: all 0.3s ease;
      flex-shrink: 0;
    }
    .step-circle.active {
      border-color: var(--sky-500);
      background: var(--sky-500);
      color: #fff;
    }
    .step-circle.done {
      border-color: #10b981;
      background: #10b981;
      color: #fff;
    }

    .step-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--neutral-400);
      white-space: nowrap;
      transition: color 0.3s;
    }
    .step-label.active { color: var(--sky-500); }
    .step-label.done   { color: #10b981; }

    @media (max-width: 640px) {
      .step-label { display: none; }
      .step-line  { min-width: 16px; }
    }
  `]
})
export class StepProgressComponent {
  @Input() currentStep: BookingStep = 'SEARCH';

  steps: Step[] = [
    { id: 'RESULTS',      label: 'Flights',     icon: '✈' },
    { id: 'SEATS',        label: 'Seats',        icon: '🪑' },
    { id: 'PASSENGERS',   label: 'Passengers',   icon: '👤' },
    { id: 'REVIEW',       label: 'Review',       icon: '📋' },
    { id: 'PAYMENT',      label: 'Payment',      icon: '💳' },
    { id: 'CONFIRMATION', label: 'Confirmation', icon: '🎫' },
  ];

  private order: BookingStep[] = ['SEARCH','RESULTS','SEATS','PASSENGERS','REVIEW','PAYMENT','CONFIRMATION'];

  isCurrent(step: BookingStep)   { return step === this.currentStep; }
  isCompleted(step: BookingStep) { return this.order.indexOf(step) < this.order.indexOf(this.currentStep); }
}
