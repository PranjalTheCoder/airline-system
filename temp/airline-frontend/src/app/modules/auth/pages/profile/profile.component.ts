// profile.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../../core/services/toast.service';

export { ProfileComponent };

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile-page">
      <div class="container-app" style="padding-top:40px;padding-bottom:64px;max-width:720px">
        <h1 class="page-title">My Profile</h1>
        @if (user()) {
          <div class="profile-card card">
            <div class="profile-avatar">{{ initials() }}</div>
            <div class="profile-info">
              <h2>{{ user().firstName }} {{ user().lastName }}</h2>
              <p>{{ user().email }}</p>
              <p>{{ user().phone }}</p>
              <span class="badge badge-blue">{{ user().role | titlecase }}</span>
            </div>
          </div>
          <div class="card" style="padding:24px;margin-top:16px">
            <h3 style="margin:0 0 20px;font-family:var(--font-display);font-size:18px">Account Details</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
              <div class="form-group">
                <label class="form-label">First Name</label>
                <input type="text" [value]="user().firstName" class="form-input" readonly />
              </div>
              <div class="form-group">
                <label class="form-label">Last Name</label>
                <input type="text" [value]="user().lastName" class="form-input" readonly />
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" [value]="user().email" class="form-input" readonly />
              </div>
              <div class="form-group">
                <label class="form-label">Role</label>
                <input type="text" [value]="user().role" class="form-input" readonly />
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .profile-page { background:var(--neutral-100);min-height:calc(100vh - 72px); }
    .page-title { font-family:var(--font-display);font-size:28px;font-weight:500;margin:0 0 24px; }
    .profile-card { padding:24px;display:flex;align-items:center;gap:24px; }
    .profile-avatar { width:72px;height:72px;border-radius:50%;background:var(--sky-500);color:#fff;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:700;flex-shrink:0; }
    .profile-info h2 { font-family:var(--font-display);font-size:22px;margin:0 0 6px; }
    .profile-info p  { color:var(--neutral-400);margin:0 0 4px;font-size:14px; }
    .form-group { display:flex;flex-direction:column;gap:6px; }
  `]
})
class ProfileComponent implements OnInit {
  private http  = inject(HttpClient);
  private toast = inject(ToastService);
  user = signal<any>(null);

  ngOnInit() {
    const stored = localStorage.getItem('sw_user');
    if (stored) this.user.set(JSON.parse(stored));
    else this.http.get(`${location.origin}/api/auth/profile`).subscribe({ next: (u: any) => this.user.set(u) });
  }

  initials(): string {
    const u = this.user();
    return u ? `${u.firstName?.[0] ?? ''}${u.lastName?.[0] ?? ''}`.toUpperCase() : 'U';
  }
}
