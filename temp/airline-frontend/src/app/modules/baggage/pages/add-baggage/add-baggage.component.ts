import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../../environments/environment';

export { AddBaggageComponent };

@Component({
  selector:   'app-add-baggage',
  standalone: true,
  imports:    [CommonModule, FormsModule, RouterLink],
  template: `
    <div style="background:var(--neutral-100);min-height:calc(100vh - 72px);padding:40px 0 64px">
      <div class="container-app" style="max-width:640px">
        <a routerLink="/my-bookings" class="back-link" style="display:inline-flex;align-items:center;gap:6px;font-size:14px;color:var(--sky-500);text-decoration:none;margin-bottom:24px">← Back to bookings</a>

        <h1 style="font-family:var(--font-display);font-size:28px;font-weight:500;margin:0 0 6px">Add Extra Baggage</h1>
        <p style="color:var(--neutral-400);margin:0 0 28px">Select your booking and add additional checked bags.</p>

        <div class="card" style="padding:24px;margin-bottom:20px">
          <div class="form-group" style="margin-bottom:20px">
            <label class="form-label">Booking Reference (PNR)</label>
            <input [(ngModel)]="pnr" class="form-input" placeholder="e.g. SKY7X2"
              style="font-family:var(--font-mono);text-transform:uppercase" />
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">
            @for (opt of baggageOptions; track opt.id) {
              <div class="bag-opt" [class.selected]="selected === opt.id" (click)="selected = opt.id">
                <span style="font-size:24px">{{ opt.icon }}</span>
                <div>
                  <div style="font-weight:600;font-size:14px">{{ opt.label }}</div>
                  <div style="font-size:12px;color:var(--neutral-400)">{{ opt.weight }}</div>
                </div>
                <div style="margin-left:auto;font-weight:700;color:var(--sky-500)">USD {{ opt.price }}</div>
              </div>
            }
          </div>

          <button class="btn btn-primary" style="width:100%" (click)="submit()" [disabled]="!pnr || !selected || loading()">
            @if (loading()) { Adding... } @else { Add Baggage }
          </button>

          @if (success()) {
            <div style="background:#ecfdf5;border:1px solid #6ee7b7;border-radius:10px;padding:14px;margin-top:16px;color:#065f46;font-size:14px">
              ✓ Extra baggage added successfully to booking {{ pnr.toUpperCase() }}.
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bag-opt {
      display:flex;align-items:center;gap:12px;
      padding:14px;border:2px solid var(--neutral-200);border-radius:10px;cursor:pointer;transition:all .2s;
    }
    .bag-opt:hover { border-color:var(--sky-300); }
    .bag-opt.selected { border-color:var(--sky-500);background:var(--sky-50); }
  `]
})
class AddBaggageComponent {
  private http = inject(HttpClient);
  pnr      = '';
  selected = '';
  loading  = signal(false);
  success  = signal(false);

  baggageOptions = [
    { id: 'BAG23', label: '23kg bag',  weight: '1 × 23kg checked', price: 45, icon: '🧳' },
    { id: 'BAG32', label: '32kg bag',  weight: '1 × 32kg checked', price: 65, icon: '🧳' },
    { id: 'BAG2X', label: '2 × 23kg', weight: '2 × 23kg checked', price: 80, icon: '🗄' },
    { id: 'SPT',   label: 'Sports',   weight: 'Oversized equipment',price: 55, icon: '🏄' },
  ];

  submit() {
    this.loading.set(true);
    this.http.post(`${environment.apiUrl}/baggage`, { pnr: this.pnr.toUpperCase(), type: this.selected }).subscribe({
      next: () => { this.success.set(true); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
