import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

interface FlightStatus {
  flightId: string; flightNumber: string; origin: string; destination: string;
  scheduledDep: string; actualDep: string; status: string;
  gate: string; terminal: string; paxBoarded: number; paxTotal: number;
  delayMinutes: number; delayReason?: string;
}

@Component({
  selector: 'app-operations-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ops-page">

      <!-- Top bar -->
      <div class="ops-topbar">
        <div class="ops-brand">
          <span class="ops-icon">📡</span>
          <div>
            <h1>Operations Control</h1>
            <p>Flight Operations Centre · {{ today | date:'EEEE d MMMM yyyy' }}</p>
          </div>
        </div>
        <div class="ops-clock">
          <div class="clock-time">{{ currentTime | date:'HH:mm:ss' }}</div>
          <div class="clock-label">UTC{{ utcOffset }}</div>
        </div>
        <div class="ops-meta">
          <span class="meta-pill" [class.live]="true">● LIVE</span>
          @if (lastRefreshed()) {
            <span class="last-refreshed">Updated {{ lastRefreshed() | date:'HH:mm:ss' }}</span>
          }
          <button class="btn-refresh" (click)="loadAll()">↺ Refresh</button>
        </div>
      </div>

      <!-- KPI Strip -->
      <div class="kpi-strip">
        <div class="kpi-card">
          <div class="kpi-num">{{ totalFlights() }}</div>
          <div class="kpi-label">Total Flights Today</div>
        </div>
        <div class="kpi-card green">
          <div class="kpi-num">{{ onTimeCount() }}</div>
          <div class="kpi-label">On Time</div>
        </div>
        <div class="kpi-card amber">
          <div class="kpi-num">{{ delayCount() }}</div>
          <div class="kpi-label">Delayed</div>
        </div>
        <div class="kpi-card red">
          <div class="kpi-num">{{ cancelledCount() }}</div>
          <div class="kpi-label">Cancelled</div>
        </div>
        <div class="kpi-card blue">
          <div class="kpi-num">{{ boardingCount() }}</div>
          <div class="kpi-label">Boarding Now</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-num">{{ otpPct() }}%</div>
          <div class="kpi-label">OTP</div>
        </div>
        <div class="kpi-card red">
          <div class="kpi-num">{{ iropsCount() }}</div>
          <div class="kpi-label">IROPS Open</div>
        </div>
      </div>

      <div class="ops-main">

        <!-- Flight Status Board -->
        <div class="fids-panel">
          <div class="panel-header">
            <h2>✈ Flight Information Display</h2>
            <div class="fids-filters">
              @for (f of statusFilters; track f.value) {
                <button class="filter-chip"
                  [class.active]="activeFilter() === f.value"
                  (click)="activeFilter.set(f.value)">
                  {{ f.label }}
                </button>
              }
            </div>
          </div>

          <div class="fids-table">
            <div class="fids-head">
              <span>Flight</span><span>Route</span>
              <span>Scheduled</span><span>Actual</span>
              <span>Gate</span><span>PAX</span>
              <span>Status</span><span>Actions</span>
            </div>

            @if (loading()) {
              @for (_ of [1,2,3,4]; track $index) {
                <div class="fids-row skeleton-row">
                  <div class="skeleton" style="height:20px;width:80%;border-radius:4px"></div>
                </div>
              }
            }

            @for (f of filteredFlights(); track f.flightId) {
              <div class="fids-row" [class.delayed]="f.status === 'DELAYED'" [class.boarding]="f.status === 'BOARDING'">
                <span class="fn-cell">
                  <strong>{{ f.flightNumber }}</strong>
                </span>
                <span class="route-cell">
                  <span class="iata">{{ f.origin }}</span>
                  <span class="route-arrow">→</span>
                  <span class="iata">{{ f.destination }}</span>
                </span>
                <span class="time-cell">{{ f.scheduledDep | date:'HH:mm' }}</span>
                <span class="time-cell" [class.delayed-time]="f.delayMinutes > 0">
                  {{ f.actualDep | date:'HH:mm' }}
                  @if (f.delayMinutes > 0) { <span class="delay-badge">+{{ f.delayMinutes }}m</span> }
                </span>
                <span class="gate-cell">{{ f.terminal }}-{{ f.gate }}</span>
                <span class="pax-cell">
                  <div class="pax-bar-wrap">
                    <div class="pax-bar" [style.width.%]="(f.paxBoarded / f.paxTotal) * 100"></div>
                  </div>
                  <span class="pax-num">{{ f.paxBoarded }}/{{ f.paxTotal }}</span>
                </span>
                <span class="status-cell">
                  <span class="status-pill" [class]="'status-' + f.status.toLowerCase()">
                    {{ f.status | titlecase }}
                  </span>
                </span>
                <span class="action-cell">
                  <button class="action-btn" (click)="reportDelay(f)" title="Report delay">⚠</button>
                  <button class="action-btn" (click)="updateStatus(f)" title="Update status">✎</button>
                </span>
              </div>
            }

            @if (!loading() && filteredFlights().length === 0) {
              <div class="fids-empty">No flights match the selected filter.</div>
            }
          </div>
        </div>

        <!-- Right column: Delays + IROPS + Analytics -->
        <div class="ops-right">

          <!-- Active Delays -->
          <div class="ops-panel">
            <div class="panel-header">
              <h3>⚠ Active Delays</h3>
              <span class="count-badge amber">{{ delays().length }}</span>
            </div>
            @for (d of delays(); track d.id) {
              <div class="delay-card">
                <div class="delay-header">
                  <strong>{{ d.flightNumber }}</strong>
                  <span class="delay-mins">+{{ d.delayMinutes }}min</span>
                </div>
                <div class="delay-reason">{{ d.reasonText }}</div>
                <div class="delay-meta">
                  <span class="impact-tag" [class]="'impact-' + d.impact.toLowerCase()">{{ d.impact }}</span>
                  <span class="delay-time">{{ d.reportedAt | date:'HH:mm' }}</span>
                </div>
                <div class="delay-actions">
                  <button class="btn-sm-action">Notify PAX</button>
                  <button class="btn-sm-action">Update FIDS</button>
                </div>
              </div>
            }
            @if (delays().length === 0) {
              <div class="panel-empty">✓ No active delays</div>
            }
          </div>

          <!-- IROPS -->
          <div class="ops-panel">
            <div class="panel-header">
              <h3>🚨 IROPS Events</h3>
              <span class="count-badge red">{{ iropsEvents().length }}</span>
            </div>
            @for (ev of iropsEvents(); track ev.id) {
              <div class="irops-card">
                <div class="irops-header">
                  <span class="irops-type">{{ ev.type }}</span>
                  <span class="severity-badge" [class]="'sev-' + ev.severity.toLowerCase()">{{ ev.severity }}</span>
                </div>
                <div class="irops-flight">{{ ev.flightNumber }} · {{ ev.affectedPax }} pax affected</div>
                <div class="irops-desc">{{ ev.description }}</div>
                <div class="irops-actions">
                  @for (action of ev.actions; track $index) {
                    <div class="action-item">✓ {{ action }}</div>
                  }
                </div>
              </div>
            }
            @if (iropsEvents().length === 0) {
              <div class="panel-empty">✓ No IROPS events</div>
            }
          </div>

          <!-- OTP Chart (mini) -->
          <div class="ops-panel">
            <div class="panel-header"><h3>📊 Weekly OTP</h3></div>
            <div class="otp-chart">
              @if (analytics()) {
                @for (val of analytics().weeklyOTP; track i; let i = $index) {
                  <div class="otp-bar-wrap" [title]="days[i] + ': ' + val + '%'">
                    <div class="otp-bar-fill" [style.height.%]="val" [class.good]="val >= 80" [class.warning]="val >= 70 && val < 80" [class.bad]="val < 70"></div>
                    <div class="otp-bar-label">{{ val }}%</div>
                    <div class="otp-day">{{ days[i] }}</div>
                  </div>
                }
              }
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .ops-page { background:#080c16;min-height:100vh;color:#c2c0b6;font-family:var(--font-body); }

    /* Top bar */
    .ops-topbar { display:flex;align-items:center;gap:24px;padding:20px 28px;background:#0f1117;border-bottom:1px solid rgba(255,255,255,.06); }
    .ops-brand { display:flex;align-items:center;gap:14px;flex:1; }
    .ops-icon  { font-size:28px; }
    .ops-brand h1 { font-family:var(--font-display);font-size:22px;font-weight:500;color:#fff;margin:0; }
    .ops-brand p  { font-size:13px;color:rgba(255,255,255,.4);margin:0; }
    .clock-time  { font-family:var(--font-mono);font-size:28px;font-weight:500;color:#60a5fa; }
    .clock-label { font-size:11px;color:rgba(255,255,255,.3);text-align:center; }
    .ops-meta { display:flex;align-items:center;gap:10px; }
    .meta-pill { font-size:12px;font-weight:600;padding:4px 10px;border-radius:20px;background:rgba(255,255,255,.08);color:rgba(255,255,255,.5); }
    .meta-pill.live { color:#10b981;animation:pulse 2s infinite; }
    @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.5} }
    .last-refreshed { font-size:12px;color:rgba(255,255,255,.3); }
    .btn-refresh { background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.7);padding:6px 14px;border-radius:8px;font-size:13px;cursor:pointer;transition:all .2s; }
    .btn-refresh:hover { background:rgba(255,255,255,.14);color:#fff; }

    /* KPIs */
    .kpi-strip { display:flex;gap:1px;background:#0f1117;border-bottom:1px solid rgba(255,255,255,.06); }
    .kpi-card { flex:1;padding:16px 20px;border-right:1px solid rgba(255,255,255,.05); }
    .kpi-card:last-child { border-right:none; }
    .kpi-num { font-family:var(--font-display);font-size:28px;font-weight:500;color:#fff; }
    .kpi-label { font-size:11px;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:.06em;margin-top:2px; }
    .kpi-card.green .kpi-num { color:#10b981; }
    .kpi-card.amber .kpi-num { color:#f59e0b; }
    .kpi-card.red   .kpi-num { color:#ef4444; }
    .kpi-card.blue  .kpi-num { color:#60a5fa; }

    /* Main layout */
    .ops-main { display:grid;grid-template-columns:1fr 340px;gap:0;height:calc(100vh - 160px);overflow:hidden; }

    /* FIDS panel */
    .fids-panel { padding:20px;overflow-y:auto;border-right:1px solid rgba(255,255,255,.06); }
    .panel-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:16px; }
    .panel-header h2 { font-family:var(--font-display);font-size:18px;font-weight:500;color:#fff;margin:0; }
    .panel-header h3 { font-family:var(--font-display);font-size:15px;font-weight:500;color:#fff;margin:0; }

    .fids-filters { display:flex;gap:6px; }
    .filter-chip { padding:5px 12px;border-radius:20px;border:1px solid rgba(255,255,255,.12);background:transparent;color:rgba(255,255,255,.5);font-size:12px;cursor:pointer;transition:all .2s; }
    .filter-chip.active { background:rgba(59,130,246,.2);border-color:rgba(59,130,246,.5);color:#60a5fa; }
    .filter-chip:hover { border-color:rgba(255,255,255,.25);color:#fff; }

    /* FIDS table */
    .fids-table { background:#0f1117;border-radius:12px;border:1px solid rgba(255,255,255,.06);overflow:hidden; }

    .fids-head {
      display:grid;grid-template-columns:90px 130px 80px 100px 80px 120px 110px 80px;
      padding:10px 16px;background:rgba(255,255,255,.04);
      font-size:11px;font-weight:600;color:rgba(255,255,255,.3);
      text-transform:uppercase;letter-spacing:.06em;
    }

    .fids-row {
      display:grid;grid-template-columns:90px 130px 80px 100px 80px 120px 110px 80px;
      padding:12px 16px;border-bottom:1px solid rgba(255,255,255,.04);align-items:center;
      transition:background .15s;
    }
    .fids-row:hover { background:rgba(255,255,255,.03); }
    .fids-row.delayed  { border-left:3px solid #f59e0b; }
    .fids-row.boarding { border-left:3px solid #10b981;animation:rowGlow 2s infinite; }
    @keyframes rowGlow { 0%,100%{background:transparent}50%{background:rgba(16,185,129,.04)} }
    .fids-row:last-child { border-bottom:none; }

    .fn-cell  { font-family:var(--font-mono);font-size:14px;font-weight:700;color:#fff; }
    .route-cell { display:flex;align-items:center;gap:6px;font-family:var(--font-mono);font-size:13px; }
    .iata { color:#60a5fa;font-weight:700; }
    .route-arrow { color:rgba(255,255,255,.2);font-size:10px; }
    .time-cell { font-family:var(--font-mono);font-size:13px;color:#fff; }
    .time-cell.delayed-time { color:#f59e0b; }
    .delay-badge { font-size:10px;background:rgba(245,158,11,.2);color:#f59e0b;padding:1px 5px;border-radius:4px;margin-left:4px; }
    .gate-cell  { font-size:13px;color:rgba(255,255,255,.7); }
    .pax-cell { display:flex;align-items:center;gap:6px; }
    .pax-bar-wrap { flex:1;height:4px;background:rgba(255,255,255,.1);border-radius:2px;overflow:hidden; }
    .pax-bar { height:100%;background:#60a5fa;border-radius:2px;transition:width .5s; }
    .pax-num { font-size:11px;color:rgba(255,255,255,.4);white-space:nowrap; }

    /* Status pills */
    .status-pill { font-size:11px;font-weight:600;padding:3px 8px;border-radius:20px;text-transform:uppercase;letter-spacing:.04em; }
    .status-on_time   { background:rgba(16,185,129,.15);color:#10b981; }
    .status-delayed   { background:rgba(245,158,11,.15);color:#f59e0b; }
    .status-boarding  { background:rgba(59,130,246,.15);color:#60a5fa; }
    .status-scheduled { background:rgba(255,255,255,.08);color:rgba(255,255,255,.5); }
    .status-departed  { background:rgba(139,92,246,.15);color:#a78bfa; }
    .status-cancelled { background:rgba(239,68,68,.15);color:#ef4444; }

    .action-cell { display:flex;gap:4px; }
    .action-btn { background:rgba(255,255,255,.06);border:none;color:rgba(255,255,255,.5);width:28px;height:28px;border-radius:6px;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;transition:all .2s; }
    .action-btn:hover { background:rgba(255,255,255,.12);color:#fff; }

    .fids-empty,.panel-empty { padding:24px;text-align:center;color:rgba(255,255,255,.2);font-size:14px; }
    .skeleton-row { padding:14px 16px; }

    /* Right column */
    .ops-right { overflow-y:auto;border-left:1px solid rgba(255,255,255,.06); }
    .ops-panel { padding:16px;border-bottom:1px solid rgba(255,255,255,.06); }

    .count-badge { font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px; }
    .count-badge.amber { background:rgba(245,158,11,.2);color:#f59e0b; }
    .count-badge.red   { background:rgba(239,68,68,.2);color:#ef4444; }

    /* Delay cards */
    .delay-card { background:rgba(245,158,11,.06);border:1px solid rgba(245,158,11,.15);border-radius:10px;padding:12px;margin-bottom:10px; }
    .delay-header { display:flex;justify-content:space-between;align-items:center;margin-bottom:6px; }
    .delay-header strong { color:#fff;font-size:14px; }
    .delay-mins { font-family:var(--font-mono);font-size:14px;font-weight:700;color:#f59e0b; }
    .delay-reason { font-size:13px;color:rgba(255,255,255,.6);margin-bottom:8px; }
    .delay-meta { display:flex;align-items:center;justify-content:space-between;margin-bottom:8px; }
    .impact-tag { font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;text-transform:uppercase; }
    .impact-minor { background:rgba(245,158,11,.2);color:#f59e0b; }
    .impact-major { background:rgba(239,68,68,.2);color:#ef4444; }
    .delay-time { font-size:11px;color:rgba(255,255,255,.3); }
    .delay-actions { display:flex;gap:6px; }
    .btn-sm-action { padding:4px 10px;font-size:11px;border-radius:6px;border:1px solid rgba(255,255,255,.12);background:transparent;color:rgba(255,255,255,.6);cursor:pointer;transition:all .2s; }
    .btn-sm-action:hover { background:rgba(255,255,255,.08);color:#fff; }

    /* IROPS */
    .irops-card { background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.15);border-radius:10px;padding:12px;margin-bottom:10px; }
    .irops-header { display:flex;justify-content:space-between;margin-bottom:6px; }
    .irops-type { font-size:11px;font-weight:700;color:#ef4444;text-transform:uppercase;letter-spacing:.06em; }
    .severity-badge { font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;text-transform:uppercase; }
    .sev-low  { background:rgba(245,158,11,.2);color:#f59e0b; }
    .sev-high { background:rgba(239,68,68,.2);color:#ef4444; }
    .irops-flight { font-size:13px;color:#fff;margin-bottom:4px; }
    .irops-desc   { font-size:12px;color:rgba(255,255,255,.5);margin-bottom:8px; }
    .action-item  { font-size:12px;color:rgba(16,185,129,.8);margin-bottom:3px; }

    /* OTP Chart */
    .otp-chart { display:flex;gap:8px;align-items:flex-end;height:100px;padding:8px 0; }
    .otp-bar-wrap { flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%; }
    .otp-bar-fill { width:100%;border-radius:3px 3px 0 0;min-height:4px;transition:height .4s; }
    .otp-bar-fill.good    { background:#10b981; }
    .otp-bar-fill.warning { background:#f59e0b; }
    .otp-bar-fill.bad     { background:#ef4444; }
    .otp-bar-label { font-size:10px;color:rgba(255,255,255,.4);margin-top:4px; }
    .otp-day { font-size:10px;color:rgba(255,255,255,.25); }
  `]
})
export class OperationsDashboardComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private base = environment.apiUrl;
  private refreshSub?: Subscription;
  private clockSub?: Subscription;

  loading       = signal(true);
  flightStatuses = signal<FlightStatus[]>([]);
  delays        = signal<any[]>([]);
  iropsEvents   = signal<any[]>([]);
  analytics     = signal<any>(null);
  lastRefreshed = signal<Date | null>(null);
  activeFilter  = signal('ALL');
  currentTime   = new Date();
  today         = new Date();
  utcOffset     = '+0';

  days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  statusFilters = [
    { value: 'ALL',       label: 'All' },
    { value: 'DELAYED',   label: 'Delayed' },
    { value: 'BOARDING',  label: 'Boarding' },
    { value: 'SCHEDULED', label: 'Scheduled' },
  ];

  totalFlights    = () => this.flightStatuses().length;
  onTimeCount     = () => this.flightStatuses().filter(f => f.status === 'ON_TIME' || f.status === 'SCHEDULED').length;
  delayCount      = () => this.flightStatuses().filter(f => f.status === 'DELAYED').length;
  cancelledCount  = () => this.flightStatuses().filter(f => f.status === 'CANCELLED').length;
  boardingCount   = () => this.flightStatuses().filter(f => f.status === 'BOARDING').length;
  iropsCount      = () => this.iropsEvents().length;
  otpPct          = () => this.totalFlights() > 0 ? Math.round((this.onTimeCount() / this.totalFlights()) * 100) : 0;

  filteredFlights = () => {
    const f = this.activeFilter();
    if (f === 'ALL') return this.flightStatuses();
    return this.flightStatuses().filter(fl => fl.status === f);
  };

  ngOnInit() {
    this.loadAll();

    // Auto-refresh every 30s
    this.refreshSub = interval(30000).subscribe(() => this.loadAll());

    // Clock
    this.clockSub = interval(1000).subscribe(() => this.currentTime = new Date());

    // UTC offset
    const offset = -(new Date().getTimezoneOffset() / 60);
    this.utcOffset = offset >= 0 ? `+${offset}` : String(offset);
  }

  ngOnDestroy() {
    this.refreshSub?.unsubscribe();
    this.clockSub?.unsubscribe();
  }

  loadAll() {
    this.loading.set(true);
    this.http.get<any[]>(`${this.base}/operations/status`).subscribe({ next: d => { this.flightStatuses.set(d); this.loading.set(false); }, error: () => this.loading.set(false) });
    this.http.get<any[]>(`${this.base}/operations/delays`).subscribe({ next: d => this.delays.set(d), error: () => {} });
    this.http.get<any[]>(`${this.base}/operations/irops`).subscribe({ next: d => this.iropsEvents.set(d), error: () => {} });
    this.http.get<any>(`${this.base}/operations/analytics`).subscribe({ next: d => this.analytics.set(d), error: () => {} });
    this.lastRefreshed.set(new Date());
  }

  reportDelay(flight: FlightStatus) {
    alert(`Reporting delay for ${flight.flightNumber}…`);
  }

  updateStatus(flight: FlightStatus) {
    alert(`Updating status for ${flight.flightNumber}…`);
  }
}
