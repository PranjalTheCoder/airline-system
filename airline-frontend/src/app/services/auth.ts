import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API = 'http://localhost:8082/api/auth';

  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post(this.API + '/login', data);
  }

  register(data: any): Observable<any> {
    return this.http.post(this.API + '/register', data);
  }

  forgotPassword(email: string) {
    return this.http.post(this.API + '/forgot-password?email=' + email, {});
  }

  resetPassword(data: any) {
    return this.http.post(this.API + '/reset-password', data);
  }

  getProfile(username: string) {
    return this.http.get(this.API + '/profile?username=' + username);
  }
}
