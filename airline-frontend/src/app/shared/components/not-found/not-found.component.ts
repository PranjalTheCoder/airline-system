import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector:   'app-not-found',
  standalone: true,
  imports:    [RouterLink],
  template: `
    <div class="nf-page">
      <div class="nf-content">
        <div class="nf-plane">✈</div>
        <div class="nf-code">404</div>
        <h1>Lost in the clouds</h1>
        <p>The page you're looking for took a wrong turn somewhere over the Pacific.</p>
        <div class="nf-actions">
          <a routerLink="/" class="btn btn-primary btn-lg">Back to Home</a>
          <a routerLink="/my-bookings" class="btn btn-outline">My Bookings</a>
        </div>
        <div class="nf-links">
          <a routerLink="/checkin">Check-in</a>
          <span>·</span>
          <a routerLink="/baggage/track">Track Baggage</a>
          <span>·</span>
          <a routerLink="/loyalty">Rewards</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .nf-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--sky-900) 0%, var(--sky-700) 50%, #1a2540 100%);
      text-align: center;
      padding: 40px 24px;
    }

    .nf-content { max-width: 520px; }

    .nf-plane {
      font-size: 64px;
      display: block;
      margin-bottom: 16px;
      animation: float 3s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0) rotate(-10deg); }
      50%       { transform: translateY(-12px) rotate(5deg); }
    }

    .nf-code {
      font-family: var(--font-display);
      font-size: 120px;
      font-weight: 500;
      color: rgba(255,255,255,.1);
      line-height: 1;
      margin-bottom: -20px;
      letter-spacing: -4px;
    }

    .nf-content h1 {
      font-family: var(--font-display);
      font-size: 36px;
      font-weight: 500;
      color: #fff;
      margin: 0 0 14px;
    }

    .nf-content p {
      font-size: 16px;
      color: rgba(255,255,255,.55);
      margin: 0 0 32px;
      line-height: 1.7;
    }

    .nf-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 28px;
    }

    .nf-links {
      display: flex;
      align-items: center;
      gap: 10px;
      justify-content: center;
      font-size: 14px;
      color: rgba(255,255,255,.35);
    }
    .nf-links a {
      color: rgba(255,255,255,.55);
      text-decoration: none;
      transition: color .2s;
    }
    .nf-links a:hover { color: #fff; }
  `]
})
export class NotFoundComponent {}
