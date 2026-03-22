import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

export { TrackBaggageComponent };

@Component({
  selector: 'app-track-baggage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bag-page">
      <div class="bag-hero page-hero">
        <div class="hero-overlay"></div>
        <div class="container-app" style="position:relative;z-index:1;color:#fff;padding-top:60px;padding-bottom:40px">
          <span style="font-size:13px;font-weight:600;color:var(--gold-400);text-transform:uppercase;letter-spacing:.1em;display:block;margin-bottom:12px">🧳 Baggage Services</span>
          <h1 style="font-family:var(--font-display);font-size:40px;margin:0 0 8px;color:#fff">Track Your Baggage</h1>
          <p style="color:rgba(255,255,255,.6);margin:0">Enter your PNR or baggage tag to see real-time status.</p>
        </div>
      </div>

      <div class="container-app" style="padding-top:32px;padding-bottom:64px;max-width:700px">
        <div class="card" style="padding:28px;margin-bottom:24px">
          <div style="display:flex;gap:12px">
            <input [(ngModel)]="tagInput" class="form-input" placeholder="Baggage tag or PNR (e.g. SKY7X2)" style="flex:1" />
            <button class="btn btn-primary" (click)="track()" [disabled]="loading() || !tagInput">
              @if (loading()) { Tracking... } @else { Track }
            </button>
          </div>
          <div style="margin-top:10px;font-size:13px;color:var(--neutral-400)">
            Demo: <button class="pnr-pill" style="margin-left:6px" (click)="tagInput='SKY7X2'">SKY7X2</button>
          </div>
        </div>

        @if (baggage()) {
          <div class="card" style="padding:24px;animation:fadeInUp .4s ease">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px">
              <div>
                <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--neutral-400);margin-bottom:4px">Tag Number</div>
                <div style="font-family:var(--font-mono);font-size:18px;font-weight:700;color:var(--neutral-900)">{{ baggage().tagNumber }}</div>
              </div>
              <div>
                <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--neutral-400);margin-bottom:4px">Weight</div>
                <div style="font-size:18px;font-weight:600;color:var(--neutral-900)">{{ baggage().weight }}kg</div>
              </div>
              <span class="badge badge-blue">{{ baggage().status.replace('_',' ') }}</span>
            </div>

            <div class="timeline">
              @for (ev of baggage().timeline; track ev.event; let last = $last) {
                <div class="tl-step" [class.done]="ev.completed" [class.current]="isCurrentStep(ev)">
                  <div class="tl-dot-wrap">
                    <div class="tl-dot">{{ ev.completed ? '✓' : '' }}</div>
                    @if (!last) { <div class="tl-line" [class.done]="ev.completed"></div> }
                  </div>
                  <div class="tl-content">
                    <div class="tl-event">{{ ev.event.replace('_',' ') }}</div>
                    <div class="tl-location">{{ ev.location }}</div>
                    @if (ev.completed) {
                      <div class="tl-time">{{ ev.timestamp | date:'d MMM · HH:mm' }}</div>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .bag-page { background:var(--neutral-100);min-height:100vh; }
    .pnr-pill { padding:3px 10px;border-radius:20px;border:1px solid var(--neutral-200);background:#fff;font-family:var(--font-mono);font-size:12px;font-weight:600;color:var(--sky-500);cursor:pointer; }
    .timeline { display:flex;flex-direction:column;gap:0; }
    .tl-step { display:flex;gap:16px;opacity:.4;transition:opacity .3s; }
    .tl-step.done, .tl-step.current { opacity:1; }
    .tl-dot-wrap { display:flex;flex-direction:column;align-items:center; }
    .tl-dot { width:32px;height:32px;border-radius:50%;border:2px solid var(--neutral-300);background:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;transition:all .3s; }
    .tl-step.done .tl-dot  { background:#10b981;border-color:#10b981;color:#fff; }
    .tl-step.current .tl-dot { border-color:var(--sky-500);color:var(--sky-500);animation:pulse 1.5s infinite; }
    @keyframes pulse { 0%,100%{transform:scale(1)}50%{transform:scale(1.1)} }
    .tl-line { width:2px;flex:1;background:var(--neutral-200);min-height:24px;margin:4px 0; }
    .tl-line.done { background:#10b981; }
    .tl-content { padding-bottom:20px; }
    .tl-event    { font-size:14px;font-weight:600;color:var(--neutral-900);text-transform:capitalize; }
    .tl-location { font-size:13px;color:var(--neutral-500);margin-top:2px; }
    .tl-time     { font-size:12px;color:var(--neutral-400);margin-top:2px; }
  `]
})
class TrackBaggageComponent {
  private http = inject(HttpClient);
  loading  = signal(false);
  baggage  = signal<any>(null);
  tagInput = '';

  track() {
    this.loading.set(true);
    this.http.get<any>(`${environment.apiUrl}/baggage/track?pnr=${this.tagInput}`).subscribe({
      next: d => { this.baggage.set(d); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  isCurrentStep(ev: any): boolean {
    if (ev.completed) return false;
    const idx = this.baggage().timeline.indexOf(ev);
    return idx > 0 && this.baggage().timeline[idx - 1].completed;
  }
}
