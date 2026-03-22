import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

export { CrewScheduleComponent };

interface ScheduleEntry {
  crewId:    string;
  crewName:  string;
  role:      string;
  day:       number; // 0–6 Sun–Sat
  flightNum: string;
  origin:    string;
  dest:      string;
  depTime:   string;
  status:    'ASSIGNED' | 'STANDBY' | 'OFF' | 'LEAVE';
}

@Component({
  selector:   'app-crew-schedule',
  standalone: true,
  imports:    [CommonModule, RouterLink],
  template: `
    <div class="schedule-page">
      <div class="container-app" style="padding: 32px 0 64px">

        <div class="sch-header">
          <div>
            <h1>Crew Schedule</h1>
            <p>Week of {{ weekStart() | date:'d MMM' }} – {{ weekEnd() | date:'d MMM yyyy' }}</p>
          </div>
          <div class="sch-nav">
            <button class="nav-btn" (click)="prevWeek()">← Prev</button>
            <button class="nav-btn today" (click)="resetWeek()">Today</button>
            <button class="nav-btn" (click)="nextWeek()">Next →</button>
          </div>
        </div>

        <!-- Legend -->
        <div class="legend">
          @for (l of legend; track l.status) {
            <div class="leg-item">
              <div class="leg-dot" [class]="'leg-' + l.status.toLowerCase()"></div>
              <span>{{ l.label }}</span>
            </div>
          }
        </div>

        <!-- Schedule grid -->
        <div class="card sch-card">
          <!-- Header row: days -->
          <div class="sch-grid">
            <div class="sch-crew-col">Crew Member</div>
            @for (day of weekDays(); track day.label) {
              <div class="sch-day-col" [class.today]="day.isToday">
                <div class="day-name">{{ day.label }}</div>
                <div class="day-date">{{ day.date | date:'d' }}</div>
              </div>
            }
          </div>

          <!-- Rows: one per crew member -->
          @for (crew of crews(); track crew.id) {
            <div class="sch-grid sch-row">
              <div class="crew-cell">
                <div class="crew-av">{{ crew.firstName[0] }}{{ crew.lastName[0] }}</div>
                <div>
                  <div class="crew-n">{{ crew.firstName }} {{ crew.lastName }}</div>
                  <div class="crew-r">{{ crew.role.replace('_',' ') }}</div>
                </div>
              </div>

              @for (day of weekDays(); track day.label; let d = $index) {
                <div class="sch-cell">
                  @if (getEntry(crew.id, d)) {
                    <div class="sch-entry" [class]="'entry-' + getEntry(crew.id, d)!.status.toLowerCase()">
                      @if (getEntry(crew.id, d)!.status === 'ASSIGNED') {
                        <div class="entry-fn">{{ getEntry(crew.id, d)!.flightNum }}</div>
                        <div class="entry-rt">{{ getEntry(crew.id, d)!.origin }}→{{ getEntry(crew.id, d)!.dest }}</div>
                        <div class="entry-time">{{ getEntry(crew.id, d)!.depTime }}</div>
                      } @else if (getEntry(crew.id, d)!.status === 'STANDBY') {
                        <div class="entry-fn">STANDBY</div>
                      } @else if (getEntry(crew.id, d)!.status === 'LEAVE') {
                        <div class="entry-fn">LEAVE</div>
                      } @else {
                        <div class="entry-fn">OFF</div>
                      }
                    </div>
                  } @else {
                    <div class="sch-empty-cell"></div>
                  }
                </div>
              }
            </div>
          }
        </div>

        <div style="margin-top:16px;text-align:center">
          <a routerLink="/crew" class="btn btn-outline">← Back to Crew List</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .schedule-page { background: var(--neutral-100); min-height: calc(100vh - 72px); }

    .sch-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
    .sch-header h1 { font-family: var(--font-display); font-size: 26px; font-weight: 500; margin: 0 0 4px; }
    .sch-header p  { color: var(--neutral-400); margin: 0; font-size: 14px; }

    .sch-nav { display: flex; gap: 6px; }
    .nav-btn { padding: 8px 16px; border-radius: 8px; border: 1px solid var(--neutral-200); background: #fff; font-size: 13px; font-weight: 500; color: var(--neutral-600); cursor: pointer; transition: all .2s; }
    .nav-btn:hover { background: var(--neutral-50); }
    .nav-btn.today { border-color: var(--sky-400); color: var(--sky-500); }

    .legend { display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
    .leg-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--neutral-600); }
    .leg-dot { width: 10px; height: 10px; border-radius: 2px; }
    .leg-assigned { background: #3b82f6; }
    .leg-standby  { background: #f59e0b; }
    .leg-leave    { background: #a78bfa; }
    .leg-off      { background: var(--neutral-200); }

    .sch-card { padding: 0; overflow-x: auto; }

    .sch-grid {
      display: grid;
      grid-template-columns: 200px repeat(7, 1fr);
      border-bottom: 1px solid var(--neutral-200);
    }
    .sch-grid:last-child { border-bottom: none; }

    .sch-crew-col, .sch-day-col {
      padding: 12px 10px; font-size: 12px; font-weight: 700;
      text-transform: uppercase; letter-spacing: .05em;
      color: var(--neutral-400); background: var(--neutral-50);
      text-align: center;
    }
    .sch-crew-col { text-align: left; padding-left: 16px; }
    .sch-day-col.today { background: var(--sky-50); }
    .day-name { font-size: 11px; }
    .day-date { font-size: 16px; font-weight: 700; color: var(--neutral-700); margin-top: 2px; }
    .sch-day-col.today .day-date { color: var(--sky-500); }

    .sch-row .sch-crew-col,
    .sch-row .sch-day-col {
      background: #fff; font-size: 14px; font-weight: normal;
      letter-spacing: normal; text-transform: none; color: var(--neutral-700);
    }

    .crew-cell { display: flex; align-items: center; gap: 10px; padding: 12px 16px; }
    .crew-av { width: 32px; height: 32px; border-radius: 50%; background: var(--sky-500); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
    .crew-n { font-size: 13px; font-weight: 600; color: var(--neutral-900); }
    .crew-r { font-size: 11px; color: var(--neutral-400); text-transform: capitalize; }

    .sch-cell { padding: 6px; }
    .sch-entry { border-radius: 8px; padding: 6px 8px; font-size: 11px; }
    .entry-assigned { background: #dbeafe; color: #1e40af; }
    .entry-standby  { background: #fef3c7; color: #92400e; }
    .entry-leave    { background: #ede9fe; color: #5b21b6; }
    .entry-off      { background: var(--neutral-100); color: var(--neutral-400); text-align: center; }

    .entry-fn   { font-weight: 700; font-size: 11px; }
    .entry-rt   { font-size: 10px; opacity: .8; margin-top: 2px; }
    .entry-time { font-size: 10px; opacity: .7; }

    .sch-empty-cell { height: 44px; }
  `]
})
class CrewScheduleComponent implements OnInit {
  private http = inject(HttpClient);

  crews    = signal<any[]>([]);
  weekOffset = signal(0);

  // Dummy schedule entries for demo
  entries: ScheduleEntry[] = [
    { crewId:'CR001', crewName:'James Wilson',   role:'CAPTAIN',       day:0, flightNum:'SW101', origin:'JFK', dest:'LHR', depTime:'08:30', status:'ASSIGNED' },
    { crewId:'CR001', crewName:'James Wilson',   role:'CAPTAIN',       day:2, flightNum:'SW204', origin:'LHR', dest:'JFK', depTime:'14:15', status:'ASSIGNED' },
    { crewId:'CR001', crewName:'James Wilson',   role:'CAPTAIN',       day:4, flightNum:'',      origin:'',    dest:'',    depTime:'',      status:'OFF' },
    { crewId:'CR001', crewName:'James Wilson',   role:'CAPTAIN',       day:5, flightNum:'',      origin:'',    dest:'',    depTime:'',      status:'OFF' },
    { crewId:'CR002', crewName:'Sarah Chen',     role:'FIRST_OFFICER', day:0, flightNum:'',      origin:'',    dest:'',    depTime:'',      status:'STANDBY' },
    { crewId:'CR002', crewName:'Sarah Chen',     role:'FIRST_OFFICER', day:1, flightNum:'SW315', origin:'JFK', dest:'LHR', depTime:'22:00', status:'ASSIGNED' },
    { crewId:'CR002', crewName:'Sarah Chen',     role:'FIRST_OFFICER', day:3, flightNum:'',      origin:'',    dest:'',    depTime:'',      status:'LEAVE' },
    { crewId:'CR003', crewName:'Maria Santos',   role:'CABIN_CREW',    day:0, flightNum:'SW101', origin:'JFK', dest:'LHR', depTime:'08:30', status:'ASSIGNED' },
    { crewId:'CR003', crewName:'Maria Santos',   role:'CABIN_CREW',    day:1, flightNum:'SW101', origin:'JFK', dest:'LHR', depTime:'08:30', status:'ASSIGNED' },
    { crewId:'CR003', crewName:'Maria Santos',   role:'CABIN_CREW',    day:5, flightNum:'',      origin:'',    dest:'',    depTime:'',      status:'OFF' },
    { crewId:'CR003', crewName:'Maria Santos',   role:'CABIN_CREW',    day:6, flightNum:'',      origin:'',    dest:'',    depTime:'',      status:'OFF' },
    { crewId:'CR004', crewName:'Ahmed Al-Rashid',role:'CAPTAIN',       day:2, flightNum:'SW442', origin:'DXB', dest:'BOM', depTime:'02:10', status:'ASSIGNED' },
    { crewId:'CR004', crewName:'Ahmed Al-Rashid',role:'CAPTAIN',       day:4, flightNum:'SW558', origin:'SIN', dest:'SYD', depTime:'09:45', status:'ASSIGNED' },
  ];

  legend = [
    { status: 'ASSIGNED', label: 'Flight assigned' },
    { status: 'STANDBY',  label: 'On standby' },
    { status: 'LEAVE',    label: 'Annual leave' },
    { status: 'OFF',      label: 'Rest day' },
  ];

  weekDays = computed(() => {
    const monday = this.getMonday(this.weekOffset());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      const today = new Date();
      return {
        label:   ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()],
        date:    d,
        isToday: d.toDateString() === today.toDateString(),
        dayOfWeek: i,
      };
    });
  });

  weekStart = computed(() => this.getMonday(this.weekOffset()));
  weekEnd   = computed(() => { const d = new Date(this.weekStart()); d.setDate(d.getDate() + 6); return d; });

  getMonday(offset: number): Date {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff + offset * 7);
    d.setHours(0,0,0,0);
    return d;
  }

  getEntry(crewId: string, dayIndex: number): ScheduleEntry | undefined {
    // dayIndex 0=Mon … 6=Sun in our display
    const dayOfWeek = dayIndex === 6 ? 0 : dayIndex + 1; // convert to JS day
    return this.entries.find(e => e.crewId === crewId && e.day === dayOfWeek);
  }

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/admin/crew`).subscribe({
      next: d => this.crews.set(d),
    });
  }

  prevWeek()  { this.weekOffset.update(n => n - 1); }
  nextWeek()  { this.weekOffset.update(n => n + 1); }
  resetWeek() { this.weekOffset.set(0); }
}
