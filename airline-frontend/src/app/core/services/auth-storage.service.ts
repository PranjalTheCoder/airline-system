import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthTokens } from '../models';

const ACCESS_TOKEN_KEY  = 'sw_access_token';
const REFRESH_TOKEN_KEY = 'sw_refresh_token';
const USER_KEY          = 'sw_user';

@Injectable({ providedIn: 'root' })
export class AuthStorageService {
  constructor(private http: HttpClient) {}

  setTokens(tokens: AuthTokens): void {
    localStorage.setItem(ACCESS_TOKEN_KEY,  tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  refreshAccessToken(): Observable<string> {
    const refreshToken = this.getRefreshToken();
    return this.http
      .post<{ accessToken: string; refreshToken: string }>(
        `${environment.authUrl}/refresh`,
        { refreshToken }
      )
      .pipe(
        map(res => {
          this.setTokens({
            accessToken:  res.accessToken,
            refreshToken: res.refreshToken,
            expiresIn: 3600
          });
          return res.accessToken;
        })
      );
  }
}
