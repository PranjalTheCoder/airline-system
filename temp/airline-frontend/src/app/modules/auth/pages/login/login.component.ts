import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],

  
  template: `
    <div class="login-wrap animate-fade-in-up">
      <div class="auth-header">
        <h2>Welcome back</h2>
        <p>Sign in to manage your bookings</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-form">

        <div class="form-group">
          <label class="form-label">Email address</label>
          <input
            type="email"
            formControlName="email"
            class="form-input"
            [class.error]="isInvalid('email')"
            placeholder="you@example.com"
            autocomplete="email" />
          @if (isInvalid('email')) {
            <span class="form-error">
              {{ form.get('email')?.hasError('required') ? 'Email is required' : 'Enter a valid email' }}
            </span>
          }
        </div>

        <div class="form-group">
          <div class="label-row">
            <label class="form-label">Password</label>
            <a href="#" class="forgot-link">Forgot password?</a>
          </div>
          <div class="input-wrapper">
            <input
              [type]="showPassword() ? 'text' : 'password'"
              formControlName="password"
              class="form-input"
              [class.error]="isInvalid('password')"
              placeholder="Your password"
              autocomplete="current-password" />
            <button type="button" class="eye-btn" (click)="togglePassword()">
              {{ showPassword() ? '🙈' : '👁' }}
            </button>
          </div>
          @if (isInvalid('password')) {
            <span class="form-error">Password is required</span>
          }
        </div>

        <button
          type="submit"
          class="btn btn-primary submit-btn"
          [disabled]="loading()">
          @if (loading()) {
            <span class="spinner"></span> Signing in...
          } @else {
            Sign In
          }
        </button>

        <div class="auth-divider"><span>or</span></div>

        <div class="social-btns">
          <button type="button" class="social-btn">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="18" height="18" alt="Google" />
            Continue with Google
          </button>
        </div>

        <p class="auth-footer-text">
          Don't have an account?
          <a routerLink="/auth/register" class="auth-link">Create one free</a>
        </p>

      </form>
    </div>
  `,
  styles: [`
    .login-wrap {
      width: 100%;
      max-width: 420px;
    }

    .auth-header {
      margin-bottom: 32px;
    }
    .auth-header h2 {
      font-family: var(--font-display);
      font-size: 32px;
      font-weight: 500;
      color: var(--sky-900);
      margin: 0 0 8px;
    }
    .auth-header p {
      font-size: 15px;
      color: var(--neutral-400);
      margin: 0;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .forgot-link {
      font-size: 13px;
      color: var(--sky-500);
      text-decoration: none;
    }
    .forgot-link:hover { text-decoration: underline; }

    .input-wrapper {
      position: relative;
    }
    .input-wrapper .form-input {
      padding-right: 44px;
    }
    .eye-btn {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
      color: var(--neutral-400);
    }

    .submit-btn {
      width: 100%;
      height: 48px;
      font-size: 16px;
    }

    .spinner {
      display: inline-block;
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .auth-divider {
      display: flex;
      align-items: center;
      gap: 12px;
      color: var(--neutral-300);
      font-size: 13px;
    }
    .auth-divider::before, .auth-divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--neutral-200);
    }

    .social-btns { display: flex; flex-direction: column; gap: 10px; }

    .social-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 12px;
      background: #fff;
      border: 1.5px solid var(--neutral-200);
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      color: var(--neutral-700);
      cursor: pointer;
      transition: all 0.2s;
    }
    .social-btn:hover {
      border-color: var(--neutral-300);
      background: var(--neutral-50);
    }

    .auth-footer-text {
      text-align: center;
      font-size: 14px;
      color: var(--neutral-400);
      margin: 0;
    }

    .auth-link {
      color: var(--sky-500);
      font-weight: 500;
      text-decoration: none;
    }
    .auth-link:hover { text-decoration: underline; }
  `]
})
export class LoginComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private toast  = inject(ToastService);
  private router = inject(Router);
  private route  = inject(ActivatedRoute);

  loading      = signal(false);
  showPassword = signal(false);

  form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

   // 👇 Add this method
  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c.touched);
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.loading.set(true);
    const { email, password } = this.form.value;

    this.auth.login({ email: email!, password: password! }).subscribe({
      next: () => {
        this.toast.success('Welcome back!');
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: () => this.loading.set(false),
    });
  }
}
