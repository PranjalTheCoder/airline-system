import { Component, OnInit, signal, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthStorageService } from '../../../core/services/auth-storage.service';
import { BookingActions } from '../../../store/booking.store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header" [class.scrolled]="isScrolled()" [class.transparent]="isTransparent()">
      <div class="container-app header-inner">

        <!-- Logo -->
        <a routerLink="/" class="logo">
          <span class="logo-icon">✈</span>
          <span class="logo-text">Sky<span class="logo-accent">Way</span></span>
        </a>

        <!-- Nav Links -->
        <nav class="nav-links" [class.open]="mobileOpen()">
          <a routerLink="/"           routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" class="nav-link">Flights</a>
          <a routerLink="/checkin"    routerLinkActive="active" class="nav-link">Check-in</a>
          <a routerLink="/baggage/track" routerLinkActive="active" class="nav-link">Baggage</a>
          <a routerLink="/loyalty"    routerLinkActive="active" class="nav-link">Rewards</a>
          @if (isLoggedIn()) {
            <a routerLink="/my-bookings" routerLinkActive="active" class="nav-link">My Bookings</a>
          }

          <!-- Staff links -->
          <div class="nav-divider"></div>
          <a routerLink="/operations" routerLinkActive="active" class="nav-link staff-link" title="Operations (Staff)">📡 Ops</a>
          <a routerLink="/admin"      routerLinkActive="active" class="nav-link staff-link" title="Admin Panel">🛠 Admin</a>
        </nav>

        <!-- Right Actions -->
        <div class="header-actions">
          <button class="lang-btn">
            <span>EN</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </button>

          @if (isLoggedIn()) {
            <div class="user-menu" (click)="toggleUserMenu()">
              <div class="avatar">{{ userInitials() }}</div>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>

              @if (userMenuOpen()) {
                <div class="user-dropdown animate-slide-down">
                  <a routerLink="/profile"     class="dropdown-item" (click)="userMenuOpen.set(false)">👤 My Profile</a>
                  <a routerLink="/my-bookings" class="dropdown-item" (click)="userMenuOpen.set(false)">📋 My Bookings</a>
                  <a routerLink="/loyalty"     class="dropdown-item" (click)="userMenuOpen.set(false)">⭐ Rewards</a>
                  <div class="dropdown-divider"></div>
                  <a routerLink="/operations"  class="dropdown-item" (click)="userMenuOpen.set(false)">📡 Operations</a>
                  <a routerLink="/admin"       class="dropdown-item" (click)="userMenuOpen.set(false)">🛠 Admin Panel</a>
                  <a routerLink="/crew"        class="dropdown-item" (click)="userMenuOpen.set(false)">👨‍✈️ Crew</a>
                  <div class="dropdown-divider"></div>
                  <button (click)="logout()" class="dropdown-item danger">↩ Sign Out</button>
                </div>
              }
            </div>
          } @else {
            <a routerLink="/auth/login"    class="btn btn-ghost btn-sm">Sign in</a>
            <a routerLink="/auth/register" class="btn btn-primary btn-sm">Register</a>
          }

          <button class="hamburger" (click)="toggleMobile()">
            <span [class.open]="mobileOpen()"></span>
            <span [class.open]="mobileOpen()"></span>
            <span [class.open]="mobileOpen()"></span>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      height: 72px;
      background: rgba(10,15,30,0.95);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255,255,255,.08);
      transition: all 0.3s ease;
    }
    .header.transparent { background: transparent; border-bottom-color: transparent; }
    .header.scrolled    { background: rgba(10,15,30,0.98); box-shadow: 0 4px 24px rgba(0,0,0,0.3); }

    .header-inner { display: flex; align-items: center; height: 100%; gap: 24px; }

    .logo { display: flex; align-items: center; gap: 8px; text-decoration: none; flex-shrink: 0; }
    .logo-icon   { font-size: 20px; color: var(--gold-400); }
    .logo-text   { font-family: var(--font-display); font-size: 22px; font-weight: 600; color: #fff; letter-spacing: -.02em; }
    .logo-accent { color: var(--gold-400); }

    .nav-links { display: flex; align-items: center; gap: 2px; flex: 1; }

    .nav-link {
      padding: 7px 12px; border-radius: 8px; font-size: 13px; font-weight: 500;
      color: rgba(255,255,255,.65); transition: all .2s; text-decoration: none;
    }
    .nav-link:hover, .nav-link.active { color: #fff; background: rgba(255,255,255,.08); }

    .nav-divider { width: 1px; height: 16px; background: rgba(255,255,255,.1); margin: 0 6px; }

    .staff-link { font-size: 12px; color: rgba(255,255,255,.45); }
    .staff-link:hover { color: var(--gold-400); }

    .header-actions { display: flex; align-items: center; gap: 8px; margin-left: auto; }

    .lang-btn {
      display: flex; align-items: center; gap: 4px;
      padding: 6px 10px; background: transparent;
      border: 1px solid rgba(255,255,255,.2); border-radius: 8px;
      color: rgba(255,255,255,.7); font-size: 13px; font-weight: 500; cursor: pointer; transition: all .2s;
    }
    .lang-btn:hover { border-color: rgba(255,255,255,.4); color: #fff; }

    .user-menu {
      position: relative; display: flex; align-items: center; gap: 6px;
      cursor: pointer; padding: 4px 8px; border-radius: 8px;
      color: rgba(255,255,255,.7); transition: background .2s;
    }
    .user-menu:hover { background: rgba(255,255,255,.08); }

    .avatar {
      width: 32px; height: 32px; border-radius: 50%;
      background: var(--sky-500); display: flex; align-items: center; justify-content: center;
      font-size: 13px; font-weight: 700; color: #fff;
    }

    .user-dropdown {
      position: absolute; top: calc(100% + 8px); right: 0;
      background: #fff; border: 1px solid var(--neutral-200); border-radius: 14px;
      box-shadow: var(--shadow-float); min-width: 200px; overflow: hidden; z-index: 100;
    }
    .dropdown-item {
      display: block; padding: 10px 16px; font-size: 13px; color: var(--neutral-700);
      text-decoration: none; transition: background .15s;
      background: none; border: none; width: 100%; text-align: left; cursor: pointer;
    }
    .dropdown-item:hover { background: var(--neutral-50); }
    .dropdown-item.danger { color: var(--danger); }
    .dropdown-divider { height: 1px; background: var(--neutral-200); margin: 4px 0; }

    .btn { font-size: 13px !important; padding: 8px 16px !important; }

    .hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
    .hamburger span { display: block; width: 22px; height: 2px; background: rgba(255,255,255,.8); border-radius: 2px; transition: all .3s; }

    @media (max-width: 900px) {
      .nav-links { display: none; }
      .nav-links.open {
        display: flex; flex-direction: column; position: fixed;
        inset: 72px 0 0; background: var(--sky-900); padding: 24px;
        align-items: flex-start; gap: 4px; overflow-y: auto;
      }
      .hamburger { display: flex; }
      .nav-divider { width: 100%; height: 1px; margin: 8px 0; }
    }
  `]
})
export class HeaderComponent implements OnInit {
  private store  = inject(Store);
  private auth   = inject(AuthStorageService);
  private router = inject(Router);

  isScrolled    = signal(false);
  isTransparent = signal(true);
  mobileOpen    = signal(false);
  userMenuOpen  = signal(false);

  ngOnInit() {
    this.router.events.subscribe(() => {
      const isHome = this.router.url === '/';
      this.isTransparent.set(isHome);
      this.mobileOpen.set(false);
      this.userMenuOpen.set(false);
    });
  }

  @HostListener('window:scroll')
  onScroll() { this.isScrolled.set(window.scrollY > 20); }

  isLoggedIn(): boolean { return this.auth.isLoggedIn(); }

  userInitials(): string {
    try {
      const user = JSON.parse(localStorage.getItem('sw_user') || '{}');
      return `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || 'U';
    } catch { return 'U'; }
  }

  toggleMobile()   { this.mobileOpen.update(v => !v); }
  toggleUserMenu() { this.userMenuOpen.update(v => !v); }

  logout() {
    this.auth.clearTokens();
    this.store.dispatch(BookingActions.resetBooking());
    this.router.navigate(['/auth/login']);
    this.userMenuOpen.set(false);
  }
}
