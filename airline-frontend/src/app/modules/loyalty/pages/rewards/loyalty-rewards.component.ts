import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector:   'app-loyalty-rewards',
  standalone: true,
  imports:    [CommonModule, RouterLink],
  template: `
    <div class="rewards-page">
      <!-- Hero -->
      <div class="rp-hero">
        <div class="hero-overlay"></div>
        <div class="container-app" style="position:relative;z-index:1;padding-top:48px;padding-bottom:40px;color:#fff">
          <a routerLink="/loyalty" class="back-link">← Back to Dashboard</a>
          <h1>Rewards Catalogue</h1>
          <p>Redeem your miles for upgrades, flights, and exclusive perks.</p>
          @if (account()) {
            <div class="pts-available">
              <span class="pts-num">{{ account().points | number }}</span>
              <span class="pts-label">miles available</span>
            </div>
          }
        </div>
      </div>

      <div class="container-app" style="padding: 32px 0 64px">

        <!-- Category filters -->
        <div class="cat-filters">
          @for (cat of categories; track cat.value) {
            <button class="cat-btn"
              [class.active]="activeCategory() === cat.value"
              (click)="activeCategory.set(cat.value)">
              <span class="cat-icon">{{ cat.icon }}</span>
              <span>{{ cat.label }}</span>
              <span class="cat-count">{{ countByCategory(cat.value) }}</span>
            </button>
          }
        </div>

        <!-- Sort row -->
        <div class="sort-row">
          <span class="result-count">{{ filteredRewards().length }} rewards</span>
          <div class="sort-options">
            <span class="sort-label">Sort:</span>
            @for (s of sortOptions; track s.value) {
              <button class="sort-btn" [class.active]="sortBy() === s.value"
                (click)="setSortBy(s.value)">{{ s.label }}</button>
            }
          </div>
        </div>

        <!-- Rewards grid -->
        <div class="rewards-grid">
          @for (reward of filteredRewards(); track reward.id) {
            <div class="reward-card card" [class.locked]="isLocked(reward)" [class.unavailable]="!reward.available">

              <!-- Category badge -->
              <div class="rwd-top">
                <div class="rwd-cat-badge" [class]="'cat-' + reward.category.toLowerCase()">
                  <span>{{ categoryIcon(reward.category) }}</span>
                  {{ reward.category | titlecase }}
                </div>
                @if (reward.featured) {
                  <span class="featured-tag">★ Featured</span>
                }
              </div>

              <h3 class="rwd-title">{{ reward.name }}</h3>
              <p class="rwd-desc">{{ reward.description }}</p>

              <!-- Miles required -->
              <div class="rwd-miles-row">
                <div class="rwd-miles">
                  <span class="miles-num">{{ reward.points | number }}</span>
                  <span class="miles-label">miles</span>
                </div>
                @if (account()) {
                  <div class="miles-progress-wrap">
                    <div class="miles-progress-bar"
                      [style.width.%]="progressPct(reward.points)"
                      [class.enough]="account().points >= reward.points">
                    </div>
                    @if (isLocked(reward)) {
                      <span class="shortfall">Need {{ (reward.points - account().points) | number }} more</span>
                    }
                  </div>
                }
              </div>

              <!-- Expiry / availability info -->
              @if (reward.expiryDays) {
                <div class="rwd-expiry">⏰ Offer expires in {{ reward.expiryDays }} days</div>
              }

              <div class="rwd-footer">
                @if (!reward.available) {
                  <button class="btn btn-outline btn-sm" disabled>Not Available</button>
                } @else if (isLocked(reward)) {
                  <button class="btn btn-outline btn-sm" (click)="earnMore()">Earn More Miles</button>
                } @else {
                  <button class="btn btn-gold btn-sm" (click)="redeem(reward)" [disabled]="redeeming() === reward.id">
                    @if (redeeming() === reward.id) { <span class="spin-sm"></span> Redeeming... }
                    @else { Redeem Now }
                  </button>
                }
                <button class="btn btn-ghost btn-sm" (click)="showDetails(reward)">Details</button>
              </div>
            </div>
          }
        </div>

        @if (filteredRewards().length === 0) {
          <div class="empty-rewards">
            <span style="font-size:48px">🎁</span>
            <h3>No rewards in this category</h3>
            <p>Check back soon — new rewards are added regularly.</p>
          </div>
        }

        <!-- How it works -->
        <div class="how-it-works">
          <h2>How Redemption Works</h2>
          <div class="hiw-steps">
            @for (step of howItWorks; track step.num) {
              <div class="hiw-step">
                <div class="hiw-num">{{ step.num }}</div>
                <div class="hiw-icon">{{ step.icon }}</div>
                <div class="hiw-title">{{ step.title }}</div>
                <div class="hiw-desc">{{ step.desc }}</div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Redemption modal -->
      @if (selectedReward()) {
        <div class="modal-overlay" (click)="closeModal()">
          <div class="modal-box" (click)="$event.stopPropagation()">
            <button class="modal-close" (click)="closeModal()">✕</button>
            <div class="modal-header">
              <span class="modal-icon">{{ categoryIcon(selectedReward()!.category) }}</span>
              <h3>{{ selectedReward()!.name }}</h3>
            </div>
            <p class="modal-desc">{{ selectedReward()!.description }}</p>
            <div class="modal-detail">
              <div class="md-row"><span>Miles required</span><strong>{{ selectedReward()!.points | number }}</strong></div>
              <div class="md-row"><span>Your balance</span><strong>{{ account()?.points | number }}</strong></div>
              <div class="md-row"><span>After redemption</span><strong>{{ (account()?.points - selectedReward()!.points) | number }}</strong></div>
            </div>
            <div class="modal-actions">
              <button class="btn btn-outline" (click)="closeModal()">Cancel</button>
              <button class="btn btn-gold" (click)="confirmRedeem()">Confirm Redemption</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .rewards-page { background: var(--neutral-100); min-height: 100vh; }

    .rp-hero {
      background: linear-gradient(135deg, var(--sky-900) 0%, #1e1045 60%, #0f1829 100%);
      position: relative; overflow: hidden;
    }
    .back-link { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: rgba(255,255,255,.6); text-decoration: none; margin-bottom: 16px; transition: color .2s; }
    .back-link:hover { color: #fff; }
    .rp-hero h1 { font-family: var(--font-display); font-size: 36px; font-weight: 500; margin: 0 0 8px; }
    .rp-hero p  { color: rgba(255,255,255,.6); margin: 0 0 20px; }

    .pts-available { display: flex; align-items: baseline; gap: 8px; }
    .pts-num   { font-family: var(--font-display); font-size: 36px; font-weight: 500; color: var(--gold-400); }
    .pts-label { font-size: 14px; color: rgba(255,255,255,.5); }

    /* Category filters */
    .cat-filters { display: flex; gap: 10px; margin-bottom: 24px; flex-wrap: wrap; }
    .cat-btn {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 18px; border-radius: 12px;
      border: 1.5px solid var(--neutral-200); background: #fff;
      font-size: 14px; font-weight: 500; color: var(--neutral-600);
      cursor: pointer; transition: all .2s;
    }
    .cat-btn:hover { border-color: var(--sky-300); color: var(--sky-500); }
    .cat-btn.active { background: var(--sky-500); border-color: var(--sky-500); color: #fff; }
    .cat-icon { font-size: 16px; }
    .cat-count { font-size: 12px; opacity: .7; background: rgba(0,0,0,.08); padding: 1px 6px; border-radius: 10px; }
    .cat-btn.active .cat-count { background: rgba(255,255,255,.2); }

    /* Sort row */
    .sort-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
    .result-count { font-size: 14px; color: var(--neutral-400); }
    .sort-options { display: flex; align-items: center; gap: 6px; }
    .sort-label { font-size: 13px; color: var(--neutral-400); }
    .sort-btn { padding: 5px 12px; border-radius: 20px; border: 1px solid var(--neutral-200); background: #fff; font-size: 12px; font-weight: 500; color: var(--neutral-600); cursor: pointer; transition: all .2s; }
    .sort-btn.active { background: var(--sky-50); border-color: var(--sky-300); color: var(--sky-600); }

    /* Rewards grid */
    .rewards-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 48px; }

    .reward-card { padding: 22px; transition: all .25s; }
    .reward-card:hover:not(.locked):not(.unavailable) { transform: translateY(-3px); box-shadow: var(--shadow-float); }
    .reward-card.locked     { opacity: .75; }
    .reward-card.unavailable { opacity: .5; }

    .rwd-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
    .rwd-cat-badge { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; padding: 4px 10px; border-radius: 20px; }
    .cat-upgrade { background: #ede9fe; color: #5b21b6; }
    .cat-flight  { background: var(--sky-50); color: var(--sky-600); }
    .cat-baggage { background: #f0fdf4; color: #065f46; }
    .cat-lounge  { background: var(--gold-100); color: var(--gold-500); }
    .cat-hotel   { background: #fff7ed; color: #9a3412; }
    .cat-car     { background: #fef2f2; color: #991b1b; }

    .featured-tag { font-size: 11px; font-weight: 700; color: var(--gold-500); }

    .rwd-title { font-size: 17px; font-weight: 600; color: var(--neutral-900); margin: 0 0 8px; }
    .rwd-desc  { font-size: 13px; color: var(--neutral-500); margin: 0 0 16px; line-height: 1.5; }

    .rwd-miles-row { margin-bottom: 12px; }
    .rwd-miles { display: flex; align-items: baseline; gap: 4px; margin-bottom: 6px; }
    .miles-num   { font-family: var(--font-display); font-size: 26px; font-weight: 500; color: var(--gold-500); }
    .miles-label { font-size: 13px; color: var(--neutral-400); }

    .miles-progress-wrap { height: 4px; background: var(--neutral-200); border-radius: 2px; overflow: visible; position: relative; }
    .miles-progress-bar  { height: 100%; border-radius: 2px; background: #ef4444; transition: width .4s ease; }
    .miles-progress-bar.enough { background: #10b981; }
    .shortfall { font-size: 11px; color: #ef4444; display: block; margin-top: 4px; }

    .rwd-expiry { font-size: 12px; color: #f59e0b; margin-bottom: 14px; }
    .rwd-footer { display: flex; gap: 8px; align-items: center; }

    .spin-sm { display: inline-block; width: 12px; height: 12px; border: 2px solid rgba(0,0,0,.2); border-top-color: var(--neutral-800); border-radius: 50%; animation: spin .7s linear infinite; margin-right: 4px; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Empty state */
    .empty-rewards { text-align: center; padding: 60px 0; }
    .empty-rewards h3 { font-family: var(--font-display); font-size: 22px; margin: 16px 0 8px; }
    .empty-rewards p  { color: var(--neutral-400); }

    /* How it works */
    .how-it-works { border-top: 1px solid var(--neutral-200); padding-top: 40px; }
    .how-it-works h2 { font-family: var(--font-display); font-size: 24px; font-weight: 500; margin: 0 0 28px; }
    .hiw-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
    .hiw-step  { text-align: center; }
    .hiw-num   { width: 32px; height: 32px; border-radius: 50%; background: var(--sky-500); color: #fff; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; }
    .hiw-icon  { font-size: 28px; margin-bottom: 10px; }
    .hiw-title { font-size: 15px; font-weight: 600; color: var(--neutral-900); margin-bottom: 6px; }
    .hiw-desc  { font-size: 13px; color: var(--neutral-400); line-height: 1.5; }

    /* Modal */
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,.5);
      display: flex; align-items: center; justify-content: center;
      z-index: 9000; padding: 20px;
    }
    .modal-box {
      background: #fff; border-radius: 20px; padding: 32px;
      max-width: 480px; width: 100%; position: relative;
      box-shadow: var(--shadow-float);
    }
    .modal-close { position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 16px; cursor: pointer; color: var(--neutral-400); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    .modal-close:hover { background: var(--neutral-100); color: var(--neutral-700); }
    .modal-header { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
    .modal-icon   { font-size: 32px; }
    .modal-header h3 { font-family: var(--font-display); font-size: 22px; font-weight: 500; margin: 0; }
    .modal-desc   { font-size: 14px; color: var(--neutral-500); margin: 0 0 20px; line-height: 1.6; }
    .modal-detail { background: var(--neutral-50); border-radius: 12px; padding: 16px; margin-bottom: 20px; }
    .md-row { display: flex; justify-content: space-between; font-size: 14px; color: var(--neutral-600); padding: 6px 0; border-bottom: 1px solid var(--neutral-200); }
    .md-row:last-child { border-bottom: none; }
    .md-row strong { color: var(--neutral-900); font-weight: 700; }
    .modal-actions { display: flex; gap: 10px; justify-content: flex-end; }

    @media (max-width: 900px) {
      .rewards-grid { grid-template-columns: repeat(2, 1fr); }
      .hiw-steps    { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 600px) {
      .rewards-grid { grid-template-columns: 1fr; }
      .hiw-steps    { grid-template-columns: 1fr; }
    }
  `]
})
export class LoyaltyRewardsComponent implements OnInit {
  private http  = inject(HttpClient);
  private toast = inject(ToastService);

  account        = signal<any>(null);
  rewards        = signal<any[]>([]);
  activeCategory = signal('ALL');
  sortBy         = signal<'points_asc'|'points_desc'|'featured'>('featured');
  redeeming      = signal<string | null>(null);
  selectedReward = signal<any | null>(null);

  categories = [
    { value: 'ALL',     icon: '🎁', label: 'All Rewards' },
    { value: 'UPGRADE', icon: '⬆',  label: 'Upgrades' },
    { value: 'FLIGHT',  icon: '✈',  label: 'Free Flights' },
    { value: 'LOUNGE',  icon: '🛋',  label: 'Lounge' },
    { value: 'BAGGAGE', icon: '🧳',  label: 'Baggage' },
    { value: 'HOTEL',   icon: '🏨',  label: 'Hotels' },
  ];

  sortOptions = [
    { value: 'featured',    label: 'Featured' },
    { value: 'points_asc',  label: 'Miles ↑' },
    { value: 'points_desc', label: 'Miles ↓' },
  ];

  howItWorks = [
    { num: '1', icon: '✈', title: 'Fly with SkyWay',     desc: 'Earn miles on every flight with SkyWay Airlines.' },
    { num: '2', icon: '📊', title: 'Accumulate miles',    desc: 'Miles never expire while your account is active.' },
    { num: '3', icon: '🎁', title: 'Choose a reward',     desc: 'Browse the catalogue and pick your reward.' },
    { num: '4', icon: '✓',  title: 'Redeem instantly',    desc: 'Rewards are applied to your account immediately.' },
  ];

  filteredRewards = computed(() => {
    let list = this.rewards();
    const cat = this.activeCategory();
    if (cat !== 'ALL') list = list.filter(r => r.category === cat);

    const sort = this.sortBy();
    if (sort === 'points_asc')  list = [...list].sort((a, b) => a.points - b.points);
    if (sort === 'points_desc') list = [...list].sort((a, b) => b.points - a.points);
    if (sort === 'featured')    list = [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return list;
  });

  ngOnInit() {
    this.http.get<any>(`${environment.apiUrl}/loyalty`).subscribe({ next: d => this.account.set(d.account) });
    this.http.get<any[]>(`${environment.apiUrl}/loyalty/rewards`).subscribe({
      next: d => {
        // Augment with extra fields for demo
        const augmented = [
          ...d,
          { id: 'RWD006', name: 'Hotel Night Stay',   description: 'One night at a SkyWay partner hotel, 4-star or above.', points: 15000, category: 'HOTEL',   available: true,  featured: false, expiryDays: null },
          { id: 'RWD007', name: 'First Class Upgrade', description: 'Upgrade one sector to First Class (subject to availability).', points: 45000, category: 'UPGRADE', available: true, featured: true, expiryDays: 30 },
          { id: 'RWD008', name: 'Round-Trip Economy',  description: 'One free round-trip economy ticket on any SkyWay route.', points: 60000, category: 'FLIGHT',  available: true,  featured: true,  expiryDays: null },
        ];
        this.rewards.set(augmented);
      }
    });
  }

  countByCategory(cat: string): number {
    if (cat === 'ALL') return this.rewards().length;
    return this.rewards().filter(r => r.category === cat).length;
  }

  isLocked(reward: any): boolean {
    return this.account() && this.account().points < reward.points;
  }

  progressPct(pts: number): number {
    if (!this.account()) return 0;
    return Math.min(100, Math.round((this.account().points / pts) * 100));
  }

  categoryIcon(cat: string): string {
    const m: Record<string,string> = { UPGRADE:'⬆', FLIGHT:'✈', BAGGAGE:'🧳', LOUNGE:'🛋', HOTEL:'🏨', CAR:'🚗' };
    return m[cat] ?? '🎁';
  }

  earnMore() { this.toast.info('Book more flights to earn miles!'); }

  redeem(reward: any) { this.selectedReward.set(reward); }
  closeModal()        { this.selectedReward.set(null); }
  showDetails(reward: any) { this.selectedReward.set(reward); }

  confirmRedeem() {
    const r = this.selectedReward();
    if (!r) return;
    this.redeeming.set(r.id);
    this.closeModal();
    this.http.post(`${environment.apiUrl}/loyalty/redeem`, { rewardId: r.id, points: r.points }).subscribe({
      next: () => {
        this.toast.success(`"${r.name}" redeemed successfully! Check your email.`);
        this.account.update(a => ({ ...a, points: a.points - r.points }));
        this.redeeming.set(null);
      },
      error: () => this.redeeming.set(null),
    });
  }
}
