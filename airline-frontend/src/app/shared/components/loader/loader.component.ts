import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// ─── Skeleton Loader ──────────────────────────────────────────
// Usage: <app-skeleton [lines]="3" [height]="20" />
@Component({
  selector:   'app-skeleton',
  standalone: true,
  imports:    [CommonModule],
  template: `
    <div class="skeleton-wrap" [style.gap.px]="gap">
      @for (_ of lines_; track $index; let i = $index) {
        <div
          class="skeleton"
          [style.height.px]="height"
          [style.width]="widths[i % widths.length]"
          [style.border-radius.px]="radius">
        </div>
      }
    </div>
  `,
  styles: [`
    .skeleton-wrap { display:flex; flex-direction:column; }
  `]
})
export class SkeletonComponent {
  @Input() count  = 1;
  @Input() height = 16;
  @Input() radius = 8;
  @Input() gap    = 10;
  @Input() widths: string[] = ['100%', '85%', '70%'];

  get lines_(): number[] { return Array(this.count).fill(0); }
}

// ─── Spinner ──────────────────────────────────────────────────
// Usage: <app-spinner size="sm" color="white" />
@Component({
  selector:   'app-spinner',
  standalone: true,
  template: `
    <div class="spinner-ring"
      [style.width.px]="px"
      [style.height.px]="px"
      [style.border-top-color]="color === 'white' ? '#fff' : 'var(--sky-500)'"
      [style.border-color]="color === 'white' ? 'rgba(255,255,255,.25)' : 'rgba(59,130,246,.25)'">
    </div>
  `,
  styles: [`
    .spinner-ring {
      border-radius: 50%;
      border-style:  solid;
      border-width:  2px;
      animation: spin .7s linear infinite;
      flex-shrink: 0;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class SpinnerComponent {
  @Input() size:  'xs' | 'sm' | 'md' | 'lg' = 'sm';
  @Input() color: 'white' | 'primary'        = 'primary';

  get px(): number {
    return { xs: 12, sm: 16, md: 24, lg: 32 }[this.size];
  }
}

// ─── Empty State ──────────────────────────────────────────────
// Usage: <app-empty-state icon="✈" title="No flights" message="Try different dates" />
@Component({
  selector:   'app-empty-state',
  standalone: true,
  imports:    [CommonModule],
  template: `
    <div class="empty-state">
      <div class="es-icon">{{ icon }}</div>
      <h3 class="es-title">{{ title }}</h3>
      <p  class="es-msg">{{ message }}</p>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 64px 24px;
      text-align: center;
    }
    .es-icon  { font-size: 48px; margin-bottom: 16px; line-height: 1; }
    .es-title {
      font-family: var(--font-display);
      font-size: 22px;
      font-weight: 500;
      color: var(--neutral-900);
      margin: 0 0 8px;
    }
    .es-msg {
      font-size: 15px;
      color: var(--neutral-400);
      margin: 0 0 20px;
      max-width: 320px;
      line-height: 1.6;
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon    = '📭';
  @Input() title   = 'Nothing here';
  @Input() message = '';
}

// ─── Loading Overlay ──────────────────────────────────────────
// Usage: <app-loading-overlay [visible]="isLoading" message="Searching flights..." />
@Component({
  selector:   'app-loading-overlay',
  standalone: true,
  imports:    [CommonModule, SpinnerComponent],
  template: `
    @if (visible) {
      <div class="loading-overlay">
        <div class="loading-box">
          <app-spinner size="lg" color="primary" />
          @if (message) { <p class="loading-msg">{{ message }}</p> }
        </div>
      </div>
    }
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      inset: 0;
      background: rgba(255,255,255,0.85);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9000;
    }
    .loading-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .loading-msg {
      font-size: 15px;
      color: var(--neutral-600);
      margin: 0;
    }
  `]
})
export class LoadingOverlayComponent {
  @Input() visible = false;
  @Input() message = '';
}
