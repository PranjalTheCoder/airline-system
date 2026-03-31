import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
  key:       string;
  label:     string;
  type?:     'text' | 'badge' | 'date' | 'number' | 'mono' | 'actions';
  sortable?: boolean;
  width?:    string;
  badgeMap?: Record<string, string>; // status → badge CSS class
}

export interface TableAction {
  icon:    string;
  label:   string;
  color?:  'default' | 'danger' | 'primary';
  action:  string;
}

@Component({
  selector:   'app-data-table',
  standalone: true,
  imports:    [CommonModule, FormsModule],
  template: `
    <div class="dt-wrapper">
      <!-- Toolbar -->
      <div class="dt-toolbar">
        @if (searchable) {
          <div class="dt-search">
            <span class="search-icon">🔍</span>
            <input [(ngModel)]="searchTerm" [placeholder]="searchPlaceholder"
              class="dt-search-input" (ngModelChange)="onSearch()" />
            @if (searchTerm) {
              <button class="search-clear" (click)="searchTerm=''; onSearch()">✕</button>
            }
          </div>
        }

        <div class="dt-toolbar-right">
          <span class="dt-count">
            {{ filteredData().length }} of {{ data.length }} records
          </span>
          @if (exportable) {
            <button class="dt-btn" (click)="exportCsv()">↓ CSV</button>
          }
        </div>
      </div>

      <!-- Table -->
      <div class="dt-scroll">
        <table class="dt-table">
          <thead>
            <tr>
              @for (col of columns; track col.key) {
                <th [style.width]="col.width ?? 'auto'"
                  [class.sortable]="col.sortable"
                  (click)="col.sortable && toggleSort(col.key)">
                  {{ col.label }}
                  @if (col.sortable) {
                    <span class="sort-indicator">
                      {{ sortKey() === col.key ? (sortDir() === 'asc' ? ' ↑' : ' ↓') : ' ↕' }}
                    </span>
                  }
                </th>
              }
            </tr>
          </thead>
          <tbody>
            @if (loading) {
              @for (_ of skeletonRows; track $index) {
                <tr class="dt-skeleton-row">
                  @for (col of columns; track col.key) {
                    <td><div class="skeleton" style="height:16px;border-radius:4px;width:80%"></div></td>
                  }
                </tr>
              }
            }

            @if (!loading && pagedData().length === 0) {
              <tr>
                <td [attr.colspan]="columns.length" class="dt-empty">
                  <span class="empty-icon">📭</span>
                  <span>{{ emptyMessage }}</span>
                </td>
              </tr>
            }

            @for (row of pagedData(); track row[rowKey]; let i = $index) {
              <tr [class.selected]="selectedRows().includes(row[rowKey])"
                [class.clickable]="rowClickable"
                (click)="rowClickable && rowClick.emit(row)">

                @if (selectable) {
                  <td style="width:40px">
                    <input type="checkbox"
                      [checked]="selectedRows().includes(row[rowKey])"
                      (change)="toggleRow(row[rowKey])"
                      (click)="$event.stopPropagation()" />
                  </td>
                }

                @for (col of columns; track col.key) {
                  <td [class]="'col-' + col.type">
                    @switch (col.type) {
                      @case ('badge') {
                        <span class="badge" [class]="getBadgeClass(col, row[col.key])">
                          {{ row[col.key] }}
                        </span>
                      }
                      @case ('date') {
                        {{ row[col.key] | date:'d MMM yyyy' }}
                      }
                      @case ('number') {
                        {{ row[col.key] | number }}
                      }
                      @case ('mono') {
                        <span class="mono-cell">{{ row[col.key] }}</span>
                      }
                      @case ('actions') {
                        <div class="dt-actions">
                          @for (action of actions; track action.action) {
                            <button
                              class="dt-action-btn"
                              [class]="'dt-action-' + (action.color ?? 'default')"
                              [title]="action.label"
                              (click)="$event.stopPropagation(); actionClick.emit({ action: action.action, row })">
                              {{ action.icon }}
                            </button>
                          }
                        </div>
                      }
                      @default {
                        {{ row[col.key] ?? '—' }}
                      }
                    }
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      @if (paginated && totalPages() > 1) {
        <div class="dt-pagination">
          <span class="page-info">
            Page {{ currentPage() }} of {{ totalPages() }}
          </span>
          <div class="page-btns">
            <button class="page-btn" [disabled]="currentPage() === 1" (click)="goToPage(currentPage() - 1)">←</button>
            @for (p of pageNumbers(); track p) {
              <button class="page-btn" [class.active]="p === currentPage()" (click)="goToPage(p)">{{ p }}</button>
            }
            <button class="page-btn" [disabled]="currentPage() === totalPages()" (click)="goToPage(currentPage() + 1)">→</button>
          </div>
          <select class="page-size-select" [(ngModel)]="pageSize" (ngModelChange)="currentPage.set(1)">
            <option [value]="10">10 / page</option>
            <option [value]="25">25 / page</option>
            <option [value]="50">50 / page</option>
          </select>
        </div>
      }
    </div>
  `,
  styles: [`
    .dt-wrapper { background: #fff; border-radius: 16px; border: 1px solid var(--neutral-200); overflow: hidden; }

    /* Toolbar */
    .dt-toolbar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 20px; border-bottom: 1px solid var(--neutral-200);
      gap: 12px; flex-wrap: wrap;
    }
    .dt-search { display: flex; align-items: center; gap: 8px; flex: 1; max-width: 320px; background: var(--neutral-50); border: 1.5px solid var(--neutral-200); border-radius: 8px; padding: 0 12px; }
    .search-icon { font-size: 13px; color: var(--neutral-400); }
    .dt-search-input { border: none; background: transparent; outline: none; font-size: 14px; padding: 8px 0; flex: 1; color: var(--neutral-900); }
    .search-clear { background: none; border: none; color: var(--neutral-400); cursor: pointer; font-size: 12px; padding: 2px; }
    .search-clear:hover { color: var(--neutral-700); }
    .dt-toolbar-right { display: flex; align-items: center; gap: 10px; }
    .dt-count { font-size: 13px; color: var(--neutral-400); }
    .dt-btn { padding: 6px 14px; border-radius: 8px; border: 1px solid var(--neutral-200); background: #fff; font-size: 13px; font-weight: 500; cursor: pointer; color: var(--neutral-600); transition: all .2s; }
    .dt-btn:hover { background: var(--neutral-50); border-color: var(--neutral-300); }

    /* Table */
    .dt-scroll { overflow-x: auto; }
    .dt-table { width: 100%; border-collapse: collapse; font-size: 14px; }

    thead tr { background: var(--neutral-50); }
    th {
      text-align: left; padding: 11px 16px;
      font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em;
      color: var(--neutral-400); white-space: nowrap; border-bottom: 1px solid var(--neutral-200);
    }
    th.sortable { cursor: pointer; user-select: none; }
    th.sortable:hover { color: var(--neutral-700); }
    .sort-indicator { color: var(--neutral-300); }

    td {
      padding: 13px 16px; border-bottom: 1px solid var(--neutral-100);
      color: var(--neutral-700); white-space: nowrap;
    }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: var(--neutral-50); }
    tr.selected td { background: var(--sky-50); }
    tr.clickable { cursor: pointer; }

    .mono-cell { font-family: var(--font-mono); font-size: 13px; color: var(--sky-600); font-weight: 600; }

    .dt-empty { text-align: center; padding: 48px; color: var(--neutral-400); }
    .dt-empty .empty-icon { font-size: 32px; display: block; margin-bottom: 8px; }

    .dt-skeleton-row td { padding: 16px; }

    /* Actions */
    .dt-actions { display: flex; gap: 4px; }
    .dt-action-btn {
      width: 30px; height: 30px; border-radius: 8px;
      border: 1px solid var(--neutral-200); background: #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; cursor: pointer; transition: all .2s;
    }
    .dt-action-btn:hover { background: var(--neutral-50); }
    .dt-action-danger:hover { border-color: #fca5a5; background: #fef2f2; }
    .dt-action-primary:hover { border-color: var(--sky-300); background: var(--sky-50); }

    /* Pagination */
    .dt-pagination {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 20px; border-top: 1px solid var(--neutral-200);
      flex-wrap: wrap; gap: 10px;
    }
    .page-info { font-size: 13px; color: var(--neutral-400); }
    .page-btns { display: flex; gap: 4px; }
    .page-btn {
      width: 32px; height: 32px; border-radius: 8px;
      border: 1px solid var(--neutral-200); background: #fff;
      font-size: 13px; font-weight: 500; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all .2s; color: var(--neutral-600);
    }
    .page-btn:hover:not(:disabled) { background: var(--neutral-50); border-color: var(--neutral-300); }
    .page-btn.active { background: var(--sky-500); border-color: var(--sky-500); color: #fff; }
    .page-btn:disabled { opacity: .4; cursor: not-allowed; }
    .page-size-select { padding: 6px 10px; border: 1px solid var(--neutral-200); border-radius: 8px; font-size: 13px; color: var(--neutral-600); outline: none; cursor: pointer; }
  `]
})
export class DataTableComponent {
  @Input() columns:          TableColumn[]  = [];
  @Input() data:             any[]          = [];
  @Input() actions:          TableAction[]  = [];
  @Input() loading         = false;
  @Input() searchable      = true;
  @Input() exportable      = false;
  @Input() selectable      = false;
  @Input() paginated       = true;
  @Input() rowClickable    = false;
  @Input() rowKey          = 'id';
  @Input() searchPlaceholder = 'Search...';
  @Input() emptyMessage    = 'No records found.';

  @Output() rowClick    = new EventEmitter<any>();
  @Output() actionClick = new EventEmitter<{ action: string; row: any }>();
  @Output() selectionChange = new EventEmitter<any[]>();

  searchTerm   = '';
  pageSize     = 10;
  currentPage  = signal(1);
  sortKey      = signal('');
  sortDir      = signal<'asc'|'desc'>('asc');
  selectedRows = signal<any[]>([]);
  skeletonRows = Array(5).fill(0);

  filteredData = computed(() => {
    let result = [...this.data];
    const q = this.searchTerm.toLowerCase();
    if (q) {
      result = result.filter(row =>
        Object.values(row).some(v => String(v).toLowerCase().includes(q))
      );
    }
    const key = this.sortKey();
    if (key) {
      result.sort((a, b) => {
        const av = a[key]; const bv = b[key];
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        return this.sortDir() === 'asc' ? cmp : -cmp;
      });
    }
    return result;
  });

  pagedData = computed(() => {
    if (!this.paginated) return this.filteredData();
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredData().slice(start, start + this.pageSize);
  });

  totalPages = computed(() => Math.ceil(this.filteredData().length / this.pageSize) || 1);

  pageNumbers = computed(() => {
    const total = this.totalPages();
    const cur   = this.currentPage();
    const pages: number[] = [];
    const range = 2;
    for (let i = Math.max(1, cur - range); i <= Math.min(total, cur + range); i++) {
      pages.push(i);
    }
    return pages;
  });

  toggleSort(key: string) {
    if (this.sortKey() === key) {
      this.sortDir.update(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKey.set(key);
      this.sortDir.set('asc');
    }
    this.currentPage.set(1);
  }

  onSearch() { this.currentPage.set(1); }

  goToPage(p: number) {
    if (p >= 1 && p <= this.totalPages()) this.currentPage.set(p);
  }

  toggleRow(id: any) {
    this.selectedRows.update(rows =>
      rows.includes(id) ? rows.filter(r => r !== id) : [...rows, id]
    );
    this.selectionChange.emit(this.selectedRows().map(id => this.data.find(r => r[this.rowKey] === id)));
  }

  getBadgeClass(col: TableColumn, value: string): string {
    if (col.badgeMap?.[value]) return col.badgeMap[value];
    const defaults: Record<string,string> = {
      ACTIVE: 'badge-green', INACTIVE: 'badge-red',
      SCHEDULED: 'badge-blue', DELAYED: 'badge-amber', CANCELLED: 'badge-red',
      CONFIRMED: 'badge-green', PENDING: 'badge-amber', SUCCESS: 'badge-green', FAILED: 'badge-red',
    };
    return defaults[value] ?? 'badge-neutral';
  }

  exportCsv() {
    const headers = this.columns.filter(c => c.type !== 'actions').map(c => c.label).join(',');
    const rows = this.filteredData().map(row =>
      this.columns.filter(c => c.type !== 'actions').map(c => `"${row[c.key] ?? ''}"`).join(',')
    );
    const csv  = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'export.csv'; a.click();
    URL.revokeObjectURL(url);
  }
}
