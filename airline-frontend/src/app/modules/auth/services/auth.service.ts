import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { environment } from '../../../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../../../core/models';
import { AuthStorageService } from '../../../core/services/auth-storage.service';
import { BookingActions } from '../../../store/booking.store';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http    = inject(HttpClient);
  private storage = inject(AuthStorageService);
  private router  = inject(Router);
  private store   = inject(Store);

  private readonly base = environment.authUrl;

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/login`, payload).pipe(
      tap(res => {
        this.storage.setTokens(res.tokens);
        localStorage.setItem('sw_user', JSON.stringify(res.user));
      })
    );
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/register`, payload).pipe(
      tap(res => {
        this.storage.setTokens(res.tokens);
        localStorage.setItem('sw_user', JSON.stringify(res.user));
      })
    );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.base}/profile`);
  }

  updateProfile(payload: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.base}/profile`, payload).pipe(
      tap(user => localStorage.setItem('sw_user', JSON.stringify(user)))
    );
  }

  logout(): void {
    this.storage.clearTokens();
    this.store.dispatch(BookingActions.resetBooking());
    this.router.navigate(['/auth/login']);
  }

  getCurrentUser(): User | null {
    try {
      return JSON.parse(localStorage.getItem('sw_user') || 'null');
    } catch {
      return null;
    }
  }
}
