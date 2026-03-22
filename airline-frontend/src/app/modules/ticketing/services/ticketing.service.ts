// ─── Ticketing Service ─────────────────────────────────────
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Ticket } from '../../../core/models';

@Injectable({ providedIn: 'root' })
export class TicketingService {
  private http = inject(HttpClient);
  private base = environment.ticketingUrl;

  getTicketsByReservation(reservationId: string): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.base}/reservation/${reservationId}`);
  }

  getTicket(id: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.base}/${id}`);
  }

  downloadPdf(ticketId: string): Observable<Blob> {
    return this.http.get(`${this.base}/${ticketId}/pdf`, { responseType: 'blob' });
  }
}
