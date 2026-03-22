import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-loyalty-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loyalty-page">

      <!-- Hero -->
      <div class="loyalty-hero">
        <div class="hero-overlay"></div>
        <div class="container-app hero-content">
          <div class="loyalty-badge">
            <span class="tier-icon">✦</span>
            <span class="tier-name">{{ account()?.tier | titlecase }} Member</span>
          </div>
          <h1>SkyWay Frequent Flyer</h1>
          <p>Earn miles on every flight. Redeem for upgrades, flights, and more.</p>
        </div>
        <!-- Gold decorative circles -->
        <div class="hero-deco-1"></div>
        <div class="hero-deco-2"></div>
      </div>

      <div class="container-app loyalty-content">

        <!-- Points summary + tier progress -->
        <div class="loyalty-top stagger">

          <div class="points-card animate-fade-in-up">
            <div class="pc-label">Available Miles</div>
            <div class="pc-points">{{ account()?.points | number }}</div>
            <div class="pc-ff">FF# {{ account()?.loyaltyNumber }}</div>
            <div class="pc-expiry">Miles expire {{ account()?.expiryDate | date:'d MMM yyyy' }}</div>
            <button class="btn btn-gold btn-sm" style="margin-top:16px">Redeem Miles</button>
          </div>

          <div class="tier-card animate-fade-in-up">
            <div class="tier-header">
              <div>
                <div class="tc-label">Current Tier</div>
                <div class="tc-tier" [style.color]="currentTierColor()">{{ account()?.tier | titlecase }}</div>
              </div>
              <div class="tier-icon-wrap" [style.background]="currentTierColor() + '20'">
                <span class="tier-star" [style.color]="currentTierColor()">✦</span>
              </div>
            </div>

            <div class="tier-progress-wrap">
              <div class="tp-label">Progress to {{ account()?.nextTier | titlecase }}</div>
              <div class="tp-bar">
                <div class="tp-fill" [style.width.%]="account()?.tierProgress" [style.background]="currentTierColor()"></div>
              </div>
              <div class="tp-meta">
                <span>{{ account()?.points | number }} pts</span>
                <span>{{ account()?.pointsToNextTier | number }} more to {{ account()?.nextTier | titlecase }}</span>
              </div>
            </div>

            <!-- Tier levels -->
            <div class="tier-levels">
              @for (tier of tiers(); track tier.name) {
                <div class="tl-item" [class.active]="account()?.tier === tier.name">
                  <div class="tl-dot" [style.background]="tier.color"></div>
                  <div class="tl-name">{{ tier.name | titlecase }}</div>
                </div>
              }
            </div>
          </div>

          <div class="stats-card animate-fade-in-up">
            <div class="sc-item">
              <div class="sc-val">{{ account()?.milesFlown | number }}</div>
              <div class="sc-label">Miles Flown</div>
            </div>
            <div class="sc-divider"></div>
            <div class="sc-item">
              <div class="sc-val">{{ account()?.tierProgress }}%</div>
              <div class="sc-label">Tier Progress</div>
            </div>
            <div class="sc-divider"></div>
            <div class="sc-item">
              <div class="sc-val">{{ formatJoinDate() }}</div>
              <div class="sc-label">Member Since</div>
            </div>
          </div>
        </div>

        <!-- Rewards catalogue -->
        <div class="section-header">
          <h2>Rewards Catalogue</h2>
          <div class="rwd-tabs">
            @for (cat of categories; track cat.value) {
              <button class="rwd-tab"
                [class.active]="rewardFilter() === cat.value"
                (click)="rewardFilter.set(cat.value)">{{ cat.label }}</button>
            }
          </div>
        </div>

        <div class="rewards-grid stagger">
          @for (r of filteredRewards(); track r.id) {
            <div class="reward-card card animate-fade-in-up" [class.unavailable]="!r.available">
              <div class="rwd-header">
                <span class="rwd-icon">{{ rewardIcon(r.category) }}</span>
                <span class="rwd-cat">{{ r.category | titlecase }}</span>
              </div>
              <h3 class="rwd-name">{{ r.name }}</h3>
              <p class="rwd-desc">{{ r.description }}</p>
              <div class="rwd-footer">
                <div class="rwd-pts">
                  <span class="pts-val">{{ r.points | number }}</span>
                  <span class="pts-label">miles</span>
                </div>
                @if (r.available) {
                  <button class="btn btn-gold btn-sm" (click)="redeemReward(r)"
                    [disabled]="(account()?.points ?? 0) < r.points">
                    Redeem
                  </button>
                } @else {
                  <span class="unavail-label">Unavailable</span>
                }
              </div>
              @if ((account()?.points ?? 0) < r.points) {
                <div class="rwd-shortfall">{{ (r.points - (account()?.points ?? 0)) | number }} more miles needed</div>
              }
            </div>
          }
        </div>

        <!-- Transaction history -->
        <div class="section-header" style="margin-top:40px">
          <h2>Miles Activity</h2>
        </div>

        <div class="card transactions-card">
          @for (tx of transactions(); track tx.id) {
            <div class="tx-row">
              <div class="tx-icon" [class]="'tx-' + tx.type.toLowerCase()">{{ txIcon(tx.type) }}</div>
              <div class="tx-info">
                <div class="tx-desc">{{ tx.description }}</div>
                <div class="tx-date">{{ tx.date | date:'d MMM yyyy' }}</div>
              </div>
              <div class="tx-pts" [class]="'pts-' + tx.type.toLowerCase()">
                {{ tx.type === 'REDEEMED' ? '' : '+' }}{{ tx.points | number }}
              </div>
            </div>
          }
        </div>

      </div>
    </div>
  `,
  styles: [`
    .loyalty-page { background:var(--neutral-100);min-height:100vh; }

    /* Hero */
    .loyalty-hero {
      background:linear-gradient(135deg,var(--sky-900),var(--sky-700),#2d1810);
      padding:60px 0 50px;position:relative;overflow:hidden;
    }
    .hero-content { position:relative;z-index:1;color:#fff; }
    .loyalty-badge { display:flex;align-items:center;gap:8px;margin-bottom:14px; }
    .tier-icon { color:var(--gold-400);font-size:16px; }
    .tier-name { font-size:13px;font-weight:600;color:var(--gold-400);text-transform:uppercase;letter-spacing:.1em; }
    .loyalty-hero h1 { font-family:var(--font-display);font-size:42px;font-weight:500;color:#fff;margin:0 0 10px; }
    .loyalty-hero p  { color:rgba(255,255,255,.6);margin:0; }
    .hero-deco-1 { position:absolute;width:300px;height:300px;border-radius:50%;border:1px solid rgba(212,175,55,.1);right:-80px;top:-80px; }
    .hero-deco-2 { position:absolute;width:500px;height:500px;border-radius:50%;border:1px solid rgba(212,175,55,.05);right:-200px;bottom:-200px; }

    .loyalty-content { padding:32px 0 64px; }

    /* Top row */
    .loyalty-top { display:grid;grid-template-columns:260px 1fr 240px;gap:20px;margin-bottom:36px; }

    .points-card {
      background:linear-gradient(135deg,var(--sky-800),var(--sky-600));
      border-radius:20px;padding:28px;color:#fff;
    }
    .pc-label  { font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:rgba(255,255,255,.5);margin-bottom:8px; }
    .pc-points { font-family:var(--font-display);font-size:40px;font-weight:500;color:#fff;margin-bottom:6px; }
    .pc-ff     { font-family:var(--font-mono);font-size:13px;color:var(--gold-400); }
    .pc-expiry { font-size:12px;color:rgba(255,255,255,.4);margin-top:4px; }

    .tier-card { background:#fff;border-radius:20px;border:1px solid var(--neutral-200);padding:24px; }
    .tier-header { display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px; }
    .tc-label { font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:var(--neutral-400); }
    .tc-tier  { font-family:var(--font-display);font-size:28px;font-weight:500;margin-top:4px; }
    .tier-icon-wrap { width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center; }
    .tier-star { font-size:22px; }

    .tp-label { font-size:12px;color:var(--neutral-400);margin-bottom:8px; }
    .tp-bar   { height:8px;background:var(--neutral-200);border-radius:4px;overflow:hidden;margin-bottom:8px; }
    .tp-fill  { height:100%;border-radius:4px;transition:width .6s ease; }
    .tp-meta  { display:flex;justify-content:space-between;font-size:12px;color:var(--neutral-400); }

    .tier-levels { display:flex;gap:12px;margin-top:16px; }
    .tl-item  { display:flex;align-items:center;gap:5px;font-size:12px;color:var(--neutral-400); }
    .tl-item.active { color:var(--neutral-900);font-weight:600; }
    .tl-dot   { width:8px;height:8px;border-radius:50%; }
    .tl-name  { font-size:11px; }

    .stats-card { background:#fff;border-radius:20px;border:1px solid var(--neutral-200);padding:24px;display:flex;flex-direction:column;justify-content:space-around; }
    .sc-item { text-align:center; }
    .sc-val   { font-family:var(--font-display);font-size:24px;font-weight:500;color:var(--neutral-900); }
    .sc-label { font-size:12px;color:var(--neutral-400);margin-top:4px; }
    .sc-divider { height:1px;background:var(--neutral-200); }

    /* Section headers */
    .section-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:20px; }
    .section-header h2 { font-family:var(--font-display);font-size:22px;font-weight:500;margin:0; }

    .rwd-tabs { display:flex;gap:6px; }
    .rwd-tab { padding:7px 16px;border-radius:20px;border:1px solid var(--neutral-200);background:#fff;font-size:13px;font-weight:500;color:var(--neutral-600);cursor:pointer;transition:all .2s; }
    .rwd-tab.active { background:var(--sky-500);border-color:var(--sky-500);color:#fff; }

    /* Rewards grid */
    .rewards-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:12px; }

    .reward-card { padding:20px; }
    .reward-card.unavailable { opacity:.6; }

    .rwd-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:12px; }
    .rwd-icon   { font-size:24px; }
    .rwd-cat    { font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--neutral-400); }
    .rwd-name   { font-size:16px;font-weight:600;color:var(--neutral-900);margin:0 0 8px; }
    .rwd-desc   { font-size:13px;color:var(--neutral-400);margin:0 0 16px;line-height:1.5; }
    .rwd-footer { display:flex;align-items:center;justify-content:space-between; }
    .pts-val    { font-family:var(--font-display);font-size:22px;font-weight:500;color:var(--gold-500); }
    .pts-label  { font-size:12px;color:var(--neutral-400);margin-left:4px; }
    .unavail-label { font-size:13px;color:var(--neutral-400); }
    .rwd-shortfall { font-size:11px;color:var(--danger);margin-top:8px;text-align:center; }

    /* Transactions */
    .transactions-card { padding:0;overflow:hidden; }
    .tx-row { display:flex;align-items:center;gap:14px;padding:16px 20px;border-bottom:1px solid var(--neutral-100); }
    .tx-row:last-child { border-bottom:none; }
    .tx-icon { width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0; }
    .tx-earned   { background:#d1fae5; }
    .tx-redeemed { background:#fee2e2; }
    .tx-bonus    { background:var(--gold-100); }
    .tx-info { flex:1; }
    .tx-desc { font-size:14px;font-weight:500;color:var(--neutral-900); }
    .tx-date { font-size:12px;color:var(--neutral-400); }
    .tx-pts { font-family:var(--font-mono);font-size:15px;font-weight:700; }
    .pts-earned   { color:#10b981; }
    .pts-redeemed { color:#ef4444; }
    .pts-bonus    { color:var(--gold-500); }
  `]
})
export class LoyaltyDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  account      = signal<any>(null);
  tiers        = signal<any[]>([]);
  transactions = signal<any[]>([]);
  rewards      = signal<any[]>([]);
  rewardFilter = signal('ALL');

  categories = [
    { value: 'ALL', label: 'All' },
    { value: 'UPGRADE', label: 'Upgrades' },
    { value: 'FLIGHT', label: 'Flights' },
    { value: 'BAGGAGE', label: 'Baggage' },
    { value: 'LOUNGE', label: 'Lounge' },
  ];

  filteredRewards = () => {
    const f = this.rewardFilter();
    if (f === 'ALL') return this.rewards();
    return this.rewards().filter(r => r.category === f);
  };

  currentTierColor = () => {
    const tier = this.tiers().find(t => t.name === this.account()?.tier);
    return tier?.color ?? '#9CA3AF';
  };

  ngOnInit() {
    this.http.get<any>(`${this.base}/loyalty`).subscribe({ next: d => { this.account.set(d.account); this.tiers.set(d.tiers); } });
    this.http.get<any[]>(`${this.base}/loyalty/transactions`).subscribe({ next: d => this.transactions.set(d) });
    this.http.get<any[]>(`${this.base}/loyalty/rewards`).subscribe({ next: d => this.rewards.set(d) });
  }

  formatJoinDate(): string {
    const d = this.account()?.joinDate;
    return d ? new Date(d).getFullYear().toString() : '—';
  }

  rewardIcon(cat: string): string {
    const map: Record<string, string> = { UPGRADE: '⬆', FLIGHT: '✈', BAGGAGE: '🧳', LOUNGE: '🛋' };
    return map[cat] ?? '🎁';
  }

  txIcon(type: string): string {
    const map: Record<string, string> = { EARNED: '↑', REDEEMED: '↓', BONUS: '★' };
    return map[type] ?? '•';
  }

  redeemReward(r: any) {
    if (confirm(`Redeem "${r.name}" for ${r.points.toLocaleString()} miles?`)) {
      this.http.post(`${this.base}/loyalty/redeem`, { rewardId: r.id, points: r.points }).subscribe({
        next: () => alert('Redemption successful! Check your email.'),
      });
    }
  }
}
