import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="auth-layout">
      <!-- Left: branding panel -->
      <div class="auth-brand">
        <div class="brand-content">
          <a routerLink="/" class="logo">
            <span class="logo-icon">✈</span>
            <span class="logo-text">Sky<span class="logo-accent">Way</span></span>
          </a>
          <div class="brand-tagline">
            <h1>Travel the world<br/>in comfort.</h1>
            <p>Book flights to 200+ destinations. Fast, secure, seamless.</p>
          </div>
          <div class="brand-stats">
            <div class="stat">
              <span class="stat-num">200+</span>
              <span class="stat-label">Destinations</span>
            </div>
            <div class="stat">
              <span class="stat-num">50M+</span>
              <span class="stat-label">Passengers</span>
            </div>
            <div class="stat">
              <span class="stat-num">4.9★</span>
              <span class="stat-label">Rating</span>
            </div>
          </div>
        </div>
        <!-- Decorative circles -->
        <div class="deco-circle large"></div>
        <div class="deco-circle small"></div>
      </div>

      <!-- Right: form panel -->
      <div class="auth-form-panel">
        <router-outlet />
      </div>
    </div>
  `,
  styles: [`
    .auth-layout {
      display: flex;
      min-height: 100vh;
    }

    /* ── Brand Panel ── */
    .auth-brand {
      flex: 0 0 480px;
      background: linear-gradient(145deg, var(--sky-900) 0%, var(--sky-700) 70%, var(--sky-600) 100%);
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      padding: 48px;
    }

    .brand-content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 48px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
    }
    .logo-icon  { font-size: 24px; color: var(--gold-400); }
    .logo-text  { font-family: var(--font-display); font-size: 26px; font-weight: 600; color: #fff; }
    .logo-accent { color: var(--gold-400); }

    .brand-tagline h1 {
      font-family: var(--font-display);
      font-size: 42px;
      font-weight: 500;
      color: #fff;
      line-height: 1.15;
      margin: 0 0 16px;
    }

    .brand-tagline p {
      font-size: 16px;
      color: rgba(255,255,255,0.6);
      line-height: 1.7;
      margin: 0;
    }

    .brand-stats {
      display: flex;
      gap: 32px;
    }

    .stat {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .stat-num {
      font-family: var(--font-display);
      font-size: 28px;
      font-weight: 500;
      color: var(--gold-400);
    }

    .stat-label {
      font-size: 13px;
      color: rgba(255,255,255,0.5);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    /* Decorative */
    .deco-circle {
      position: absolute;
      border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.06);
      pointer-events: none;
    }
    .deco-circle.large {
      width: 500px; height: 500px;
      bottom: -200px; right: -200px;
    }
    .deco-circle.small {
      width: 300px; height: 300px;
      top: -100px; right: -50px;
      border-color: rgba(201,162,39,0.1);
    }

    /* ── Form Panel ── */
    .auth-form-panel {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--neutral-50);
      padding: 48px 24px;
    }

    @media (max-width: 900px) {
      .auth-brand { display: none; }
    }
  `]
})
export class AuthLayoutComponent {}
