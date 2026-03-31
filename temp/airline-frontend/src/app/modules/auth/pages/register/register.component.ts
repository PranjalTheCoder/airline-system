import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

function passwordMatch(ctrl: AbstractControl) {
  const pw  = ctrl.get('password')?.value;
  const cpw = ctrl.get('confirmPassword')?.value;
  return pw === cpw ? null : { mismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="register-wrap animate-fade-in-up">
      <div class="auth-header">
        <h2>Create account</h2>
        <p>Join millions of travellers worldwide</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-form">

        <div class="name-row">
          <div class="form-group">
            <label class="form-label">First name</label>
            <input type="text" formControlName="firstName" class="form-input"
              [class.error]="isInvalid('firstName')" placeholder="John" />
            @if (isInvalid('firstName')) {
              <span class="form-error">Required</span>
            }
          </div>
          <div class="form-group">
            <label class="form-label">Last name</label>
            <input type="text" formControlName="lastName" class="form-input"
              [class.error]="isInvalid('lastName')" placeholder="Doe" />
            @if (isInvalid('lastName')) {
              <span class="form-error">Required</span>
            }
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Email address</label>
          <input type="email" formControlName="email" class="form-input"
            [class.error]="isInvalid('email')" placeholder="john@example.com" />
          @if (isInvalid('email')) {
            <span class="form-error">Valid email required</span>
          }
        </div>

        <div class="form-group">
          <label class="form-label">Phone (optional)</label>
          <input type="tel" formControlName="phone" class="form-input"
            placeholder="+1 234 567 8900" />
        </div>

        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" formControlName="password" class="form-input"
            [class.error]="isInvalid('password')" placeholder="Min. 8 characters" />
          @if (isInvalid('password')) {
            <span class="form-error">Min. 8 characters required</span>
          }
          <!-- Strength indicator -->
          @if (form.get('password')?.value) {
            <div class="strength-bar">
              <div class="strength-fill" [style.width.%]="strengthPct()" [class]="strengthClass()"></div>
            </div>
            <span class="strength-label">{{ strengthLabel() }}</span>
          }
        </div>

        <div class="form-group">
          <label class="form-label">Confirm password</label>
          <input type="password" formControlName="confirmPassword" class="form-input"
            [class.error]="isInvalid('confirmPassword') || (form.hasError('mismatch') && form.get('confirmPassword')?.touched)"
            placeholder="Repeat password" />
          @if (form.hasError('mismatch') && form.get('confirmPassword')?.touched) {
            <span class="form-error">Passwords do not match</span>
          }
        </div>

        <label class="checkbox-label">
          <input type="checkbox" formControlName="terms" />
          <span>I agree to the <a href="#" class="auth-link">Terms of Service</a> and <a href="#" class="auth-link">Privacy Policy</a></span>
        </label>
        @if (isInvalid('terms')) {
          <span class="form-error" style="margin-top:-12px">You must agree to continue</span>
        }

        <button type="submit" class="btn btn-primary submit-btn" [disabled]="loading()">
          @if (loading()) {
            <span class="spinner"></span> Creating account...
          } @else {
            Create Account
          }
        </button>

        <p class="auth-footer-text">
          Already have an account? <a routerLink="/auth/login" class="auth-link">Sign in</a>
        </p>
      </form>
    </div>
  `,
  styles: [`
    .register-wrap { width: 100%; max-width: 440px; }

    .auth-header { margin-bottom: 28px; }
    .auth-header h2 {
      font-family: var(--font-display);
      font-size: 30px;
      font-weight: 500;
      color: var(--sky-900);
      margin: 0 0 6px;
    }
    .auth-header p { font-size: 15px; color: var(--neutral-400); margin: 0; }

    .auth-form { display: flex; flex-direction: column; gap: 18px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }

    .name-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

    .strength-bar {
      height: 4px;
      background: var(--neutral-200);
      border-radius: 2px;
      margin-top: 6px;
      overflow: hidden;
    }
    .strength-fill {
      height: 100%;
      border-radius: 2px;
      transition: width 0.3s, background 0.3s;
    }
    .strength-fill.weak   { background: #ef4444; }
    .strength-fill.fair   { background: #f59e0b; }
    .strength-fill.good   { background: #3b82f6; }
    .strength-fill.strong { background: #10b981; }
    .strength-label { font-size: 12px; color: var(--neutral-400); }

    .checkbox-label {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 14px;
      color: var(--neutral-600);
      cursor: pointer;
    }
    .checkbox-label input { margin-top: 2px; flex-shrink: 0; }

    .submit-btn { width: 100%; height: 48px; font-size: 16px; }

    .spinner {
      display: inline-block;
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .auth-footer-text { text-align: center; font-size: 14px; color: var(--neutral-400); margin: 0; }
    .auth-link { color: var(--sky-500); font-weight: 500; text-decoration: none; }
    .auth-link:hover { text-decoration: underline; }
  `]
})
export class RegisterComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private toast  = inject(ToastService);
  private router = inject(Router);

  loading = signal(false);

  form = this.fb.group({
    firstName:       ['', Validators.required],
    lastName:        ['', Validators.required],
    email:           ['', [Validators.required, Validators.email]],
    phone:           [''],
    password:        ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
    terms:           [false, Validators.requiredTrue],
  }, { validators: passwordMatch });

  isInvalid(f: string) { const c = this.form.get(f); return !!(c?.invalid && c.touched); }

  strengthPct(): number {
    const pw = this.form.get('password')?.value ?? '';
    let score = 0;
    if (pw.length >= 8)  score += 25;
    if (/[A-Z]/.test(pw))  score += 25;
    if (/[0-9]/.test(pw))  score += 25;
    if (/[^a-zA-Z0-9]/.test(pw)) score += 25;
    return score;
  }

  strengthClass(): string {
    const p = this.strengthPct();
    if (p <= 25) return 'weak';
    if (p <= 50) return 'fair';
    if (p <= 75) return 'good';
    return 'strong';
  }

  strengthLabel(): string {
    const map: Record<string, string> = { weak: 'Weak', fair: 'Fair', good: 'Good', strong: 'Strong' };
    return map[this.strengthClass()];
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    const { email, password, firstName, lastName, phone } = this.form.value;
    this.auth.register({ email: email!, password: password!, firstName: firstName!, lastName: lastName!, phone: phone || undefined }).subscribe({
      next: () => {
        this.toast.success('Account created! Welcome aboard.');
        this.router.navigate(['/']);
      },
      error: () => this.loading.set(false),
    });
  }
}
