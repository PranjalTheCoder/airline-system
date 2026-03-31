import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of (toastService.toasts$ | async); track toast.id) {
        <div class="toast toast-{{ toast.type }} animate-slide-down">
          <span class="toast-icon">{{ icons[toast.type] }}</span>
          <span class="toast-msg">{{ toast.message }}</span>
          <button class="toast-close" (click)="toastService.remove(toast.id)">✕</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 88px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 16px;
      border-radius: 12px;
      min-width: 280px;
      max-width: 400px;
      box-shadow: var(--shadow-float);
      font-size: 14px;
      pointer-events: all;
    }
    .toast-icon  { font-size: 16px; flex-shrink: 0; }
    .toast-msg   { flex: 1; line-height: 1.4; }
    .toast-close {
      background: none; border: none; cursor: pointer;
      font-size: 12px; color: currentColor; opacity: 0.5;
      padding: 2px; transition: opacity 0.2s;
    }
    .toast-close:hover { opacity: 1; }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
  icons: Record<Toast['type'], string> = {
    success: '✓',
    error:   '✕',
    info:    'ℹ',
    warning: '⚠',
  };
}
