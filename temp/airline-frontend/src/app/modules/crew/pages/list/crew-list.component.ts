import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

export { CrewListComponent };

@Component({
  selector:   'app-crew-list',
  standalone: true,
  imports:    [CommonModule, FormsModule],
  template: `
    <div class="crew-page">
      <div class="container-app" style="padding: 32px 0 64px">

        <div class="crew-header">
          <div>
            <h1>Crew Management</h1>
            <p>{{ crews().length }} crew members registered</p>
          </div>
          <div class="crew-actions">
            <input [(ngModel)]="search" placeholder="Search crew..." class="search-input" />
            <button class="btn btn-primary">+ Add Crew</button>
          </div>
        </div>

        <!-- Stat cards -->
        <div class="crew-stats">
          @for (stat of crewStats(); track stat.label) {
            <div class="cs-card">
              <div class="cs-num" [style.color]="stat.color">{{ stat.value }}</div>
              <div class="cs-label">{{ stat.label }}</div>
            </div>
          }
        </div>

        <!-- Crew table -->
        <div class="card crew-table-card">
          <div class="ct-head">
            <span>Employee</span><span>Role</span><span>Ratings</span>
            <span>Base</span><span>Hours (month)</span><span>Status</span><span>Actions</span>
          </div>

          @if (loading()) {
            @for (_ of [1,2,3]; track $index) {
              <div class="ct-row">
                <div class="skeleton" style="height:20px;width:90%;border-radius:4px"></div>
              </div>
            }
          }

          @for (crew of filteredCrew(); track crew.id) {
            <div class="ct-row">
              <span class="crew-name-cell">
                <div class="crew-avatar">{{ crew.firstName[0] }}{{ crew.lastName[0] }}</div>
                <div>
                  <div class="crew-name">{{ crew.firstName }} {{ crew.lastName }}</div>
                  <div class="crew-emp">{{ crew.employeeId }}</div>
                </div>
              </span>
              <span>
                <span class="role-badge" [class]="'role-' + crew.role.toLowerCase()">
                  {{ crew.role.replace('_', ' ') }}
                </span>
              </span>
              <span class="ratings-cell">
                @for (r of crew.rating; track r) {
                  <span class="rating-pill">{{ r }}</span>
                }
              </span>
              <span class="mono-sm">{{ crew.base }}</span>
              <span>
                <div class="hours-wrap">
                  <div class="hours-track">
                    <div class="hours-fill"
                      [style.width.%]="(crew.flightHoursMonth / crew.flightHoursMax) * 100"
                      [class.near-limit]="crew.flightHoursMonth / crew.flightHoursMax > 0.85">
                    </div>
                  </div>
                  <span class="hours-text">{{ crew.flightHoursMonth }}/{{ crew.flightHoursMax }}h</span>
                </div>
              </span>
              <span>
                <span class="status-dot" [class]="'dot-' + crew.status.toLowerCase()"></span>
                <span class="status-text">{{ crew.status.replace('_', ' ') }}</span>
              </span>
              <span class="row-acts">
                <button class="icon-btn" title="View profile">👤</button>
                <button class="icon-btn" title="Edit">✎</button>
                <button class="icon-btn" title="Schedule">📅</button>
              </span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .crew-page { background: var(--neutral-100); min-height: calc(100vh - 72px); }

    .crew-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    .crew-header h1 { font-family: var(--font-display); font-size: 28px; font-weight: 500; margin: 0 0 4px; }
    .crew-header p  { color: var(--neutral-400); margin: 0; font-size: 14px; }
    .crew-actions { display: flex; gap: 10px; }

    .search-input { padding: 9px 14px; border: 1.5px solid var(--neutral-200); border-radius: 8px; font-size: 14px; outline: none; width: 220px; }
    .search-input:focus { border-color: var(--sky-400); }

    .crew-stats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 24px; }
    .cs-card { background: #fff; border-radius: 12px; border: 1px solid var(--neutral-200); padding: 16px; text-align: center; }
    .cs-num  { font-family: var(--font-display); font-size: 26px; font-weight: 500; }
    .cs-label { font-size: 12px; color: var(--neutral-400); margin-top: 4px; }

    .crew-table-card { overflow: hidden; }
    .ct-head {
      display: grid; grid-template-columns: 220px 140px 140px 60px 160px 120px 100px;
      padding: 10px 20px; background: var(--neutral-50);
      font-size: 11px; font-weight: 700; text-transform: uppercase;
      letter-spacing: .06em; color: var(--neutral-400); border-bottom: 1px solid var(--neutral-200);
    }
    .ct-row {
      display: grid; grid-template-columns: 220px 140px 140px 60px 160px 120px 100px;
      padding: 14px 20px; border-bottom: 1px solid var(--neutral-100);
      align-items: center; font-size: 14px; transition: background .15s;
    }
    .ct-row:hover { background: var(--neutral-50); }
    .ct-row:last-child { border-bottom: none; }

    .crew-name-cell { display: flex; align-items: center; gap: 12px; }
    .crew-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--sky-500); color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 700; flex-shrink: 0;
    }
    .crew-name { font-weight: 600; color: var(--neutral-900); font-size: 14px; }
    .crew-emp  { font-size: 12px; color: var(--neutral-400); font-family: var(--font-mono); }

    .role-badge { font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 6px; text-transform: uppercase; }
    .role-captain      { background: #dbeafe; color: #1e3a6e; }
    .role-first_officer { background: #ede9fe; color: #5b21b6; }
    .role-cabin_crew_lead { background: #d1fae5; color: #065f46; }
    .role-cabin_crew   { background: var(--neutral-100); color: var(--neutral-600); }

    .ratings-cell { display: flex; gap: 4px; flex-wrap: wrap; }
    .rating-pill { font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 4px; background: var(--sky-50); color: var(--sky-600); }
    .mono-sm { font-family: var(--font-mono); font-size: 13px; font-weight: 600; color: var(--sky-600); }

    .hours-wrap { display: flex; flex-direction: column; gap: 4px; }
    .hours-track { height: 6px; background: var(--neutral-200); border-radius: 3px; overflow: hidden; }
    .hours-fill  { height: 100%; background: var(--sky-400); border-radius: 3px; transition: width .3s; }
    .hours-fill.near-limit { background: #ef4444; }
    .hours-text { font-size: 12px; color: var(--neutral-500); }

    .status-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 6px; }
    .dot-on_duty  { background: #10b981; }
    .dot-standby  { background: #f59e0b; }
    .dot-off_duty { background: var(--neutral-300); }
    .status-text { font-size: 13px; color: var(--neutral-600); text-transform: capitalize; }

    .row-acts { display: flex; gap: 4px; }
    .icon-btn { width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--neutral-200); background: #fff; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .2s; }
    .icon-btn:hover { background: var(--neutral-50); border-color: var(--neutral-300); }
  `]
})
class CrewListComponent implements OnInit {
  private http = inject(HttpClient);
  loading = signal(true);
  crews   = signal<any[]>([]);
  search  = '';

  filteredCrew = () => {
    const q = this.search.toLowerCase();
    if (!q) return this.crews();
    return this.crews().filter(c =>
      `${c.firstName} ${c.lastName} ${c.employeeId} ${c.role}`.toLowerCase().includes(q)
    );
  };

  crewStats = () => [
    { label: 'Total Crew',  value: this.crews().length,                                          color: 'var(--neutral-900)' },
    { label: 'On Duty',     value: this.crews().filter(c => c.status === 'ON_DUTY').length,      color: '#10b981' },
    { label: 'Standby',     value: this.crews().filter(c => c.status === 'STANDBY').length,      color: '#f59e0b' },
    { label: 'Off Duty',    value: this.crews().filter(c => c.status === 'OFF_DUTY').length,     color: 'var(--neutral-400)' },
    { label: 'Near Limit',  value: this.crews().filter(c => c.flightHoursMonth / c.flightHoursMax > 0.85).length, color: '#ef4444' },
  ];

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/admin/crew`).subscribe({
      next: d => { this.crews.set(d); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
