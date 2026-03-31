import { Injectable } from '@angular/core';
import {
  HttpRequest, HttpHandler, HttpEvent, HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ToastService } from '../services/toast.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toast: ToastService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const shouldRetry = req.method === 'GET';

    const request$ = shouldRetry
      ? next.handle(req).pipe(retry({ count: 1, delay: 1000 }))
      : next.handle(req);

    return request$.pipe(
      catchError((error: HttpErrorResponse) => {
        const message = this.extractMessage(error);

        // Don't toast 401 — handled by JWT interceptor
        if (error.status !== 401) {
          this.toast.show(message, 'error');
        }

        return throwError(() => ({ ...error, friendlyMessage: message }));
      })
    );
  }

  private extractMessage(error: HttpErrorResponse): string {
    if (error.error?.message) return error.error.message;

    switch (error.status) {
      case 0:    return 'Network error. Please check your connection.';
      case 400:  return error.error?.message || 'Invalid request.';
      case 403:  return 'Access denied.';
      case 404:  return 'Resource not found.';
      case 409:  return error.error?.message || 'Conflict error.';
      case 422:  return 'Validation failed. Please check your input.';
      case 500:  return 'Server error. Please try again later.';
      case 503:  return 'Service unavailable. Please try again.';
      default:   return 'An unexpected error occurred.';
    }
  }
}
