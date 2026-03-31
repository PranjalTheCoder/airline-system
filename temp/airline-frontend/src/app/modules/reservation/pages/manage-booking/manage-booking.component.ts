// ══ manage-booking.component.ts ══════════════════════════════
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

export { ManageBookingComponent };

@Component({
  selector: 'app-manage-booking',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="mb-page">
      <div class="container-app" style="padding-top:40px;padding-bottom:64px">
        <h1 class="page-title">My Bookings</h1>
        <p class="page-sub">View and manage all your flight reservations.</p>

        @if (loading()) {
          <div style="display:grid;gap:12px">
            @for (_ of [1,2]; track $index) {
              <div class="skeleton" style="height:140px;border-radius:16px"></div>
            }
          </div>
        }

        @if (!loading() && bookings().length === 0) {
          <div class="empty-state">
            <span class="empty-icon">✈</span>
            <h3>No bookings yet</h3>
            <p>Start exploring flights to create your first booking.</p>
            <a routerLink="/" class="btn btn-primary" style="display:inline-flex">Search Flights</a>
          </div>
        }

        <div style="display:grid;gap:16px">
          @for (bk of bookings(); track bk.id) {
            <div class="booking-card card">
              <div class="bk-header">
                <div>
                  <div class="bk-pnr">PNR: <span>{{ bk.pnr }}</span></div>
                  <div class="bk-date">Booked {{ bk.createdAt | date:'d MMM yyyy' }}</div>
                </div>
                <span class="badge" [class]="statusBadge(bk.status)">{{ bk.status }}</span>
              </div>
              <div class="bk-route">
                <span class="iata-lg">JFK</span>
                <span class="rt-arrow">✈</span>
                <span class="iata-lg">LHR</span>
              </div>
              <div class="bk-footer">
                <div class="bk-total">Total: <strong>USD {{ bk.pricing.totalAmount | number:'1.2-2' }}</strong></div>
                <div class="bk-actions">
                  @if (bk.status === 'CONFIRMED') {
                    <a routerLink="/checkin" class="btn btn-primary btn-sm">Check-in</a>
                    <button class="btn btn-outline btn-sm danger" (click)="cancelBooking(bk.id)">Cancel</button>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mb-page { background:var(--neutral-100);min-height:calc(100vh - 72px); }
    .page-title { font-family:var(--font-display);font-size:28px;font-weight:500;margin:0 0 6px; }
    .page-sub   { color:var(--neutral-400);margin:0 0 28px; }
    .booking-card { padding:20px;transition:box-shadow .2s; }
    .booking-card:hover { box-shadow:var(--shadow-float); }
    .bk-header { display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px; }
    .bk-pnr    { font-family:var(--font-mono);font-size:15px;font-weight:700;color:var(--sky-600); }
    .bk-date   { font-size:12px;color:var(--neutral-400);margin-top:2px; }
    .bk-route  { display:flex;align-items:center;gap:12px;margin-bottom:16px; }
    .iata-lg   { font-family:var(--font-display);font-size:28px;font-weight:500;color:var(--neutral-900); }
    .rt-arrow  { font-size:16px;color:var(--sky-400); }
    .bk-footer { display:flex;justify-content:space-between;align-items:center; }
    .bk-total  { font-size:14px;color:var(--neutral-600); }
    .bk-total strong { color:var(--neutral-900); }
    .bk-actions { display:flex;gap:8px; }
    .btn.danger { color:var(--danger);border-color:#fca5a5; }
    .btn.danger:hover { background:#fef2f2; }
    .empty-state { text-align:center;padding:80px 20px; }
    .empty-icon { font-size:48px;display:block;margin-bottom:16px; }
    .empty-state h3 { font-family:var(--font-display);font-size:22px;margin:0 0 8px; }
    .empty-state p  { color:var(--neutral-400);margin:0 0 20px; }
  `]
})
class ManageBookingComponent implements OnInit {
  private http = inject(HttpClient);
  loading  = signal(true);
  bookings = signal<any[]>([]);

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/reservations/my-bookings`).subscribe({
      next: d => { this.bookings.set(d); this.loading.set(false); },
      error: ()  => this.loading.set(false),
    });
  }

  statusBadge(s: string) {
    const m: Record<string,string> = { CONFIRMED:'badge-green', TICKETED:'badge-blue', CANCELLED:'badge-red', PENDING:'badge-neutral' };
    return 'badge ' + (m[s] ?? 'badge-neutral');
  }

  cancelBooking(id: string) {
    if (confirm('Cancel this booking?')) {
      this.http.post(`${environment.apiUrl}/reservations/${id}/cancel`, {}).subscribe(() => {
        this.bookings.update(b => b.map(x => x.id === id ? {...x, status:'CANCELLED'} : x));
      });
    }
  }
}
