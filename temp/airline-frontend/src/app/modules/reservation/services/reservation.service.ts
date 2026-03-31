// ─── Reservation Service ─────────────────────────────────────
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Reservation, CreateReservationRequest } from '../../../core/models';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private http = inject(HttpClient);
  private base = environment.reservationUrl;

  create(payload: CreateReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.base}`, payload);
  }

  getById(id: string): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.base}/${id}`);
  }

  getMyBookings(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.base}/my-bookings`);
  }

  cancel(id: string): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.base}/${id}/cancel`, {});
  }

  getByPnr(pnr: string): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.base}/pnr/${pnr}`);
  }
}
