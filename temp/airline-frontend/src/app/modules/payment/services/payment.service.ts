// ─── Payment Service ─────────────────────────────────────────
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PaymentRequest, PaymentResponse } from '../../../core/models';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);
  private base = environment.paymentUrl;

  initiatePayment(payload: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.base}/initiate`, payload);
  }

  getPaymentStatus(paymentId: string): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(`${this.base}/${paymentId}`);
  }

  retryPayment(paymentId: string): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.base}/${paymentId}/retry`, {});
  }
}
