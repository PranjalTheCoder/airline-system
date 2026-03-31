import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="container-app footer-inner">
        <div class="footer-brand">
          <span class="logo-icon">✈</span>
          <span class="logo-text">Sky<span class="logo-accent">Way</span></span>
          <p>Premium airline booking. 200+ destinations worldwide.</p>
        </div>
        <div class="footer-links">
          <div class="link-group">
            <h4>Book</h4>
            <a routerLink="/">Flights</a>
            <a href="#">Check-in</a>
            <a href="#">Flight Status</a>
          </div>
          <div class="link-group">
            <h4>Support</h4>
            <a href="#">Help Centre</a>
            <a href="#">Baggage</a>
            <a href="#">Cancellation</a>
          </div>
          <div class="link-group">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container-app">
          <span>© 2025 SkyWay Airlines. All rights reserved.</span>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--sky-900);
      color: rgba(255,255,255,0.6);
      margin-top: auto;
    }

    .footer-inner {
      display: flex;
      gap: 64px;
      padding-top: 48px;
      padding-bottom: 48px;
    }

    .footer-brand {
      flex: 0 0 240px;
    }
    .footer-brand .logo-icon  { font-size: 20px; color: var(--gold-400); margin-right: 8px; }
    .footer-brand .logo-text  { font-family: var(--font-display); font-size: 20px; color: #fff; }
    .footer-brand .logo-accent { color: var(--gold-400); }
    .footer-brand p { margin-top: 12px; font-size: 14px; line-height: 1.6; }

    .footer-links {
      display: flex;
      gap: 48px;
      flex: 1;
    }

    .link-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .link-group h4 {
      color: #fff;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      margin-bottom: 4px;
    }
    .link-group a {
      font-size: 14px;
      color: rgba(255,255,255,0.5);
      text-decoration: none;
      transition: color 0.2s;
    }
    .link-group a:hover { color: #fff; }

    .footer-bottom {
      border-top: 1px solid rgba(255,255,255,0.08);
      padding: 16px 0;
      font-size: 13px;
    }

    @media (max-width: 768px) {
      .footer-inner { flex-direction: column; gap: 32px; }
      .footer-brand { flex: none; }
      .footer-links { flex-wrap: wrap; gap: 32px; }
    }
  `]
})
export class FooterComponent {}
