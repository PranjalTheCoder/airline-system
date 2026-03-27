import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="admin-layout">
      <!-- Sidebar -->
      <nav class="admin-sidebar">
        <div class="sidebar-brand">
          <span>✈</span>
          <span>SkyWay Admin</span>
        </div>

        @for (item of navItems; track item.id) {
          <button
            class="nav-item"
            [class.active]="activeTab() === item.id"
            (click)="activeTab.set(item.id)"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </button>
        }

        <div class="sidebar-footer">
          <a routerLink="/" class="nav-item">
            <span class="nav-icon">←</span>
            <span>Back to Portal</span>
          </a>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="admin-content">
        <!-- Header -->
        <div class="admin-header">
          <h1>{{ currentNav().label }}</h1>
          <div class="admin-header-actions">
            <span class="admin-date">{{
              today | date: 'EEEE, d MMMM yyyy'
            }}</span>
            @if (activeTab() === 'flights') {
              <button class="btn btn-primary btn-sm" (click)="openFlightForm()">
                + New Flight
              </button>
            }
            @if (activeTab() === 'aircraft') {
              <button
                class="btn btn-primary btn-sm"
                (click)="openAircraftForm()"
              >
                + New Aircraft
              </button>
            }
          </div>
        </div>

        <!-- ── DASHBOARD ── -->
        @if (activeTab() === 'dashboard') {
          <div class="stats-grid stagger">
            @for (stat of dashboardStats(); track stat.label) {
              <div class="stat-card animate-fade-in-up">
                <div class="stat-icon">{{ stat.icon }}</div>
                <div class="stat-value">{{ stat.value }}</div>
                <div class="stat-label">{{ stat.label }}</div>
                @if (stat.growth !== undefined) {
                  <div
                    class="stat-growth"
                    [class.up]="stat.growth >= 0"
                    [class.down]="stat.growth < 0"
                  >
                    {{ stat.growth >= 0 ? '↑' : '↓' }}
                    {{ stat.growth | number: '1.1-1' }}%
                  </div>
                }
              </div>
            }
          </div>

          <!-- Quick links -->
          <div class="quick-actions">
            <h3>Quick Actions</h3>
            <div class="qa-grid">
              @for (qa of quickActions; track qa.label) {
                <button class="qa-btn" (click)="activeTab.set(qa.tab)">
                  <span>{{ qa.icon }}</span>
                  <span>{{ qa.label }}</span>
                </button>
              }
            </div>
          </div>
        }

        <!-- ── FLIGHTS MANAGEMENT ── -->
        @if (activeTab() === 'flights') {
          <div class="table-section">
            <div class="table-toolbar">
              <input
                [(ngModel)]="flightSearch"
                placeholder="Search flights..."
                class="search-input"
              />
              <span class="record-count"
                >{{ filteredFlights().length }} flights</span
              >
            </div>

            <div class="admin-table">
              <div class="table-head">
                <span>Flight #</span><span>Route</span><span>Aircraft</span>
                <span>Departure</span><span>Status</span><span>Actions</span>
              </div>
              @if (loading()) {
                @for (_ of [1, 2, 3]; track $index) {
                  <div class="table-row">
                    <div
                      class="skeleton"
                      style="height:20px;width:90%;border-radius:4px"
                    ></div>
                  </div>
                }
              }
              @for (flight of filteredFlights(); track flight.id) {
                <div class="table-row">
                  <span class="mono-cell">{{ flight.flightNumber }}</span>
                  <span
                    >{{ flight.origin.code }} →
                    {{ flight.destination.code }}</span
                  >
                  <span>{{ flight.aircraftType }}</span>
                  <span>{{
                    flight.departureTime | date: 'd MMM · HH:mm'
                  }}</span>
                  <span>
                    <span
                      class="status-chip"
                      [class]="'sc-' + flight.status.toLowerCase()"
                      >{{ flight.status }}</span
                    >
                  </span>
                  <span class="row-actions">
                    <button
                      class="icon-btn"
                      title="Edit"
                      (click)="editFlight(flight)"
                    >
                      ✎
                    </button>
                    <button
                      class="icon-btn danger"
                      title="Delete"
                      (click)="deleteFlight(flight.id)"
                    >
                      🗑
                    </button>
                  </span>
                </div>
              }
            </div>
          </div>
        }

        <!-- ── AIRCRAFT MANAGEMENT ── -->
        @if (activeTab() === 'aircraft') {
          <div class="aircraft-grid">
            @if (loading()) {
              @for (_ of [1, 2, 3]; track $index) {
                <div
                  class="skeleton"
                  style="height:180px;border-radius:12px"
                ></div>
              }
            }
            @for (ac of aircraft(); track ac.id) {
              <div class="aircraft-card card">
                <div class="ac-header">
                  <div class="ac-reg">{{ ac.registration }}</div>
                  <span
                    class="status-chip"
                    [class]="'sc-' + ac.status.toLowerCase()"
                    >{{ ac.status }}</span
                  >
                </div>
                <div class="ac-model">{{ ac.model }}</div>
                <div class="ac-stats">
                  <div class="ac-stat">
                    <span>Capacity</span><strong>{{ ac.capacity }}</strong>
                  </div>
                  <div class="ac-stat">
                    <span>Built</span><strong>{{ ac.yearBuilt }}</strong>
                  </div>
                </div>
                <div class="ac-cabin">
                  @if (ac.cabinConfig.first > 0) {
                    <span class="cabin-chip first"
                      >F{{ ac.cabinConfig.first }}</span
                    >
                  }
                  @if (ac.cabinConfig.business > 0) {
                    <span class="cabin-chip biz"
                      >J{{ ac.cabinConfig.business }}</span
                    >
                  }
                  @if (ac.cabinConfig.premiumEconomy > 0) {
                    <span class="cabin-chip pe"
                      >W{{ ac.cabinConfig.premiumEconomy }}</span
                    >
                  }
                  <span class="cabin-chip eco"
                    >Y{{ ac.cabinConfig.economy }}</span
                  >
                </div>
                <div class="ac-maintenance">
                  Next check: {{ ac.nextMaintenance | date: 'd MMM yyyy' }}
                </div>
                <div class="ac-actions">
                  <button class="btn btn-outline btn-sm">View Config</button>
                  <button
                    class="btn btn-ghost btn-sm"
                    (click)="editAircraft(ac)"
                  >
                    Edit
                  </button>
                </div>
              </div>
            }
          </div>
        }

        <!-- ── AIRPORTS ── -->
        @if (activeTab() === 'airports') {
          <div class="table-section">
            <div class="admin-table">
              <div class="table-head">
                <span>IATA Code</span><span>Name</span><span>City</span
                ><span>Country</span><span>Terminals</span><span>Status</span>
              </div>
              @for (ap of airports(); track ap.code) {
                <div class="table-row">
                  <span class="mono-cell bold">{{ ap.code }}</span>
                  <span>{{ ap.name }}</span>
                  <span>{{ ap.city }}</span>
                  <span>{{ ap.country }}</span>
                  <span class="terminals">
                    @for (t of ap.terminals; track t) {
                      <span class="term-badge">{{ t }}</span>
                    }
                  </span>
                  <span
                    ><span class="status-chip sc-active">{{
                      ap.status
                    }}</span></span
                  >
                </div>
              }
            </div>
          </div>
        }

        <!-- ── CREW ── -->
        @if (activeTab() === 'crew') {
          <div class="table-section">
            <div class="admin-table">
              <div class="table-head">
                <span>Employee ID</span><span>Name</span><span>Role</span>
                <span>Base</span><span>Hours (month)</span><span>Ratings</span
                ><span>Status</span>
              </div>
              @for (cr of crews(); track cr.id) {
                <div class="table-row">
                  <span class="mono-cell">{{ cr.employeeId }}</span>
                  <span
                    ><strong>{{ cr.firstName }} {{ cr.lastName }}</strong></span
                  >
                  <span>{{ cr.role | titlecase }}</span>
                  <span>{{ cr.base }}</span>
                  <span>
                    <div class="hours-bar-wrap">
                      <div
                        class="hours-bar"
                        [style.width.%]="
                          (cr.flightHoursMonth / cr.flightHoursMax) * 100
                        "
                        [class.near-limit]="
                          cr.flightHoursMonth / cr.flightHoursMax > 0.85
                        "
                      ></div>
                    </div>
                    {{ cr.flightHoursMonth }}/{{ cr.flightHoursMax }}h
                  </span>
                  <span class="ratings">
                    @for (r of cr.rating; track r) {
                      <span class="rating-badge">{{ r }}</span>
                    }
                  </span>
                  <span>
                    <span
                      class="status-chip"
                      [class]="
                        'sc-' + cr.status.toLowerCase().replace('_', '-')
                      "
                      >{{ cr.status.replace('_', ' ') }}</span
                    >
                  </span>
                </div>
              }
            </div>
          </div>
        }
      </main>
    </div>
  `,
  styles: [
    `
      .admin-layout {
        display: flex;
        min-height: 100vh;
        background: var(--neutral-50);
      }

      /* Sidebar */
      .admin-sidebar {
        width: 220px;
        background: var(--sky-900);
        display: flex;
        flex-direction: column;
        padding: 20px 0;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        z-index: 10;
      }

      .sidebar-brand {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0 20px 24px;
        font-family: var(--font-display);
        font-size: 17px;
        font-weight: 500;
        color: #fff;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        margin-bottom: 12px;
      }
      .sidebar-brand span:first-child {
        color: var(--gold-400);
        font-size: 20px;
      }

      .nav-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 11px 20px;
        color: rgba(255, 255, 255, 0.6);
        font-size: 14px;
        font-weight: 500;
        background: none;
        border: none;
        width: 100%;
        text-align: left;
        cursor: pointer;
        transition: all 0.2s;
        text-decoration: none;
      }
      .nav-item:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.06);
      }
      .nav-item.active {
        color: #fff;
        background: rgba(59, 130, 246, 0.2);
        border-left: 3px solid #60a5fa;
      }
      .nav-icon {
        font-size: 16px;
        width: 20px;
        text-align: center;
      }

      .sidebar-footer {
        margin-top: auto;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        padding-top: 12px;
      }

      /* Main */
      .admin-content {
        margin-left: 220px;
        flex: 1;
        padding: 28px;
      }

      .admin-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 24px;
      }
      .admin-header h1 {
        font-family: var(--font-display);
        font-size: 24px;
        font-weight: 500;
        margin: 0;
      }
      .admin-header-actions {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .admin-date {
        font-size: 14px;
        color: var(--neutral-400);
      }

      /* Stats grid */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px;
        margin-bottom: 28px;
      }

      .stat-card {
        background: #fff;
        border-radius: 16px;
        border: 1px solid var(--neutral-200);
        padding: 20px;
        text-align: center;
      }
      .stat-icon {
        font-size: 28px;
        margin-bottom: 8px;
      }
      .stat-value {
        font-family: var(--font-display);
        font-size: 28px;
        font-weight: 500;
        color: var(--neutral-900);
      }
      .stat-label {
        font-size: 13px;
        color: var(--neutral-400);
        margin-top: 4px;
      }
      .stat-growth {
        font-size: 13px;
        font-weight: 600;
        margin-top: 6px;
      }
      .stat-growth.up {
        color: #10b981;
      }
      .stat-growth.down {
        color: #ef4444;
      }

      /* Quick actions */
      .quick-actions {
        background: #fff;
        border-radius: 16px;
        border: 1px solid var(--neutral-200);
        padding: 20px;
      }
      .quick-actions h3 {
        font-size: 15px;
        font-weight: 600;
        margin: 0 0 16px;
      }
      .qa-grid {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }
      .qa-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 18px;
        border-radius: 10px;
        border: 1.5px solid var(--neutral-200);
        background: #fff;
        font-size: 14px;
        font-weight: 500;
        color: var(--neutral-700);
        cursor: pointer;
        transition: all 0.2s;
      }
      .qa-btn:hover {
        border-color: var(--sky-400);
        color: var(--sky-500);
        background: var(--sky-50);
      }

      /* Tables */
      .table-section {
        background: #fff;
        border-radius: 16px;
        border: 1px solid var(--neutral-200);
        overflow: hidden;
      }

      .table-toolbar {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 20px;
        border-bottom: 1px solid var(--neutral-200);
      }
      .search-input {
        flex: 1;
        padding: 8px 14px;
        border: 1.5px solid var(--neutral-200);
        border-radius: 8px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
      }
      .search-input:focus {
        border-color: var(--sky-400);
      }
      .record-count {
        font-size: 13px;
        color: var(--neutral-400);
        flex-shrink: 0;
      }

      .admin-table {
        overflow-x: auto;
      }

      .table-head {
        display: grid;
        grid-template-columns: 120px 1fr 1fr 1fr 120px 100px;
        padding: 10px 20px;
        background: var(--neutral-50);
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--neutral-400);
        border-bottom: 1px solid var(--neutral-200);
      }

      .table-row {
        display: grid;
        grid-template-columns: 120px 1fr 1fr 1fr 120px 100px;
        padding: 14px 20px;
        border-bottom: 1px solid var(--neutral-100);
        align-items: center;
        font-size: 14px;
        transition: background 0.15s;
      }
      .table-row:hover {
        background: var(--neutral-50);
      }
      .table-row:last-child {
        border-bottom: none;
      }

      .mono-cell {
        font-family: var(--font-mono);
        font-size: 13px;
        color: var(--sky-600);
        font-weight: 600;
      }
      .mono-cell.bold {
        font-weight: 700;
        font-size: 14px;
      }

      .row-actions {
        display: flex;
        gap: 6px;
      }
      .icon-btn {
        width: 28px;
        height: 28px;
        border-radius: 6px;
        border: 1px solid var(--neutral-200);
        background: #fff;
        font-size: 13px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }
      .icon-btn:hover {
        background: var(--neutral-50);
      }
      .icon-btn.danger:hover {
        border-color: #fca5a5;
        background: #fef2f2;
        color: #ef4444;
      }

      /* Status chips */
      .status-chip {
        font-size: 11px;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 20px;
        text-transform: uppercase;
      }
      .sc-scheduled {
        background: #dbeafe;
        color: #1e3a6e;
      }
      .sc-active {
        background: #d1fae5;
        color: #065f46;
      }
      .sc-delayed {
        background: #fef3c7;
        color: #92400e;
      }
      .sc-cancelled {
        background: #fee2e2;
        color: #991b1b;
      }
      .sc-maintenance {
        background: #f3e8ff;
        color: #5b21b6;
      }
      .sc-on_duty {
        background: #d1fae5;
        color: #065f46;
      }
      .sc-standby {
        background: #dbeafe;
        color: #1e3a6e;
      }
      .sc-off-duty {
        background: var(--neutral-100);
        color: var(--neutral-600);
      }

      /* Aircraft grid */
      .aircraft-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }
      .aircraft-card {
        padding: 20px;
      }
      .ac-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }
      .ac-reg {
        font-family: var(--font-mono);
        font-size: 15px;
        font-weight: 700;
        color: var(--neutral-900);
      }
      .ac-model {
        font-size: 18px;
        font-weight: 600;
        color: var(--sky-600);
        margin-bottom: 12px;
      }
      .ac-stats {
        display: flex;
        gap: 16px;
        margin-bottom: 12px;
      }
      .ac-stat {
        font-size: 13px;
        color: var(--neutral-400);
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .ac-stat strong {
        color: var(--neutral-900);
      }
      .ac-cabin {
        display: flex;
        gap: 6px;
        margin-bottom: 10px;
      }
      .cabin-chip {
        font-size: 11px;
        font-weight: 700;
        padding: 2px 8px;
        border-radius: 20px;
      }
      .cabin-chip.first {
        background: #fef9e7;
        color: var(--gold-500);
      }
      .cabin-chip.biz {
        background: #ede9fe;
        color: #5b21b6;
      }
      .cabin-chip.pe {
        background: #dbeafe;
        color: #1e3a6e;
      }
      .cabin-chip.eco {
        background: var(--neutral-100);
        color: var(--neutral-600);
      }
      .ac-maintenance {
        font-size: 12px;
        color: var(--neutral-400);
        margin-bottom: 14px;
      }
      .ac-actions {
        display: flex;
        gap: 8px;
      }

      /* Crew */
      .admin-table:has(.table-head span:nth-child(6)) .table-head,
      .admin-table:has(.table-head span:nth-child(6)) .table-row {
        grid-template-columns: 110px 180px 160px 60px 160px 120px 100px;
      }
      .hours-bar-wrap {
        width: 80px;
        height: 6px;
        background: var(--neutral-200);
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 4px;
      }
      .hours-bar {
        height: 100%;
        background: var(--sky-400);
        border-radius: 3px;
        transition: width 0.3s;
      }
      .hours-bar.near-limit {
        background: #ef4444;
      }
      .ratings {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
      }
      .rating-badge {
        font-size: 10px;
        font-weight: 700;
        padding: 2px 6px;
        border-radius: 4px;
        background: var(--sky-50);
        color: var(--sky-600);
      }

      /* Airports */
      .terminals {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
      }
      .term-badge {
        font-size: 11px;
        padding: 2px 6px;
        border-radius: 4px;
        background: var(--neutral-100);
        color: var(--neutral-600);
      }
    `,
  ],
})
export class AdminDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  loading = signal(true);
  flights = signal<any[]>([]);
  aircraft = signal<any[]>([]);
  airports = signal<any[]>([]);
  crews = signal<any[]>([]);
  adminStats = signal<any>(null);
  activeTab = signal('dashboard');
  flightSearch = '';
  today = new Date();

  navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'flights', icon: '✈', label: 'Flights' },
    { id: 'aircraft', icon: '🛩', label: 'Aircraft' },
    { id: 'airports', icon: '🏢', label: 'Airports' },
    { id: 'crew', icon: '👨‍✈️', label: 'Crew' },
  ];

  quickActions = [
    { icon: '✈', label: 'Manage Flights', tab: 'flights' },
    { icon: '🛩', label: 'Aircraft Fleet', tab: 'aircraft' },
    { icon: '🏢', label: 'Airports', tab: 'airports' },
    { icon: '👨‍✈️', label: 'Crew Roster', tab: 'crew' },
  ];

  currentNav = () =>
    this.navItems.find((n) => n.id === this.activeTab()) ?? this.navItems[0];

  dashboardStats = () => {
    const s = this.adminStats();
    if (!s) return [];
    return [
      {
        icon: '✈',
        label: 'Total Flights',
        value: s.totalFlights || 0,
        growth: undefined,
      },
      {
        icon: '🛩',
        label: 'Active Aircraft',
        value: s.totalAircraft || 0,
        growth: undefined,
      },
      {
        icon: '👥',
        label: 'Passengers Today',
        value: (s.totalPassengersToday || 0).toLocaleString(),
        growth: undefined,
      },
      {
        icon: '💰',
        label: 'Revenue',
        value: '$' + ((s.revenue || 0) / 1000000).toFixed(1) + 'M',
        growth: s.revenueGrowth,
      },
      {
        icon: '📈',
        label: 'Load Factor',
        value: (s.loadFactor || 0) + '%',
        growth: undefined,
      },
      {
        icon: '⏱',
        label: 'On-Time Performance',
        value: (s.onTimePerformance || 0) + '%',
        growth: undefined,
      },
      {
        icon: '🛫',
        label: 'Active Routes',
        value: s.activeRoutes || 0,
        growth: undefined,
      },
      { icon: '⚡', label: 'IROPS Events', value: 2, growth: undefined },
    ];
  };

  filteredFlights = () => {
    const q = this.flightSearch.toLowerCase();
    if (!q) return this.flights();
    return this.flights().filter(
      (f) =>
        f.flightNumber.toLowerCase().includes(q) ||
        f.origin.code.toLowerCase().includes(q) ||
        f.destination.code.toLowerCase().includes(q),
    );
  };

  // ngOnInit() {
  //   this.http.get<any>(`${this.base}/admin/stats`).subscribe({ next: d => { this.adminStats.set(d); this.loading.set(false); }, error: err => console.error('Backend Error:', err) });
  //   this.http.get<any[]>(`${this.base}/admin/flights`).subscribe({ next: d => this.flights.set(d) });
  //   this.http.get<any[]>(`${this.base}/admin/aircraft`).subscribe({ next: d => this.aircraft.set(d) });
  //   this.http.get<any[]>(`${this.base}/admin/airports`).subscribe({ next: d => this.airports.set(d) });
  //   this.http.get<any[]>(`${this.base}/admin/crew`).subscribe({ next: d => this.crews.set(d) });
  // }

  // private adminBase = environment.adminUrl; // Use the specific admin URL
  ngOnInit() {
    // ── 1. LIVE BACKEND CALLS (Goes to Spring Boot on port 8080) ──
    this.http.get<any>(`${this.base}/admin/dashboard`).subscribe({
      next: (d) => {
        this.adminStats.set(d.adminStats);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Dashboard Error:', err);
        this.loading.set(false);
      },
    });
    // ── 2. LIVE FLIGHT CALL (Calls your flight-service via environment.flightUrl) ──
    this.http.get<any>(environment.flightUrl).subscribe({
      next: (d) => {
        // Bulletproof array extraction
        const flightList = Array.isArray(d) ? d : d.flights || [];
        this.flights.set(flightList);
      },
      error: (err) => console.error('Flights Data Error:', err),
    });
  }

  openFlightForm() {
    alert('Flight creation form — wire to modal component');
  }
  openAircraftForm() {
    alert('Aircraft creation form — wire to modal component');
  }
  editFlight(f: any) {
    alert(`Edit flight ${f.flightNumber}`);
  }
  editAircraft(a: any) {
    alert(`Edit aircraft ${a.registration}`);
  }
  deleteFlight(id: string) {
    if (confirm('Delete this flight?')) {
      this.http.delete(`${this.base}/admin/flights/${id}`).subscribe(() => {
        this.flights.update((f) => f.filter((x) => x.id !== id));
      });
    }
  }
}
