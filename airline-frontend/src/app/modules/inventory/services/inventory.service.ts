import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SeatMap } from '../../../core/models';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private http = inject(HttpClient);
  private base = environment.inventoryUrl;

  getSeatMap(flightId: string, cabinClass: string): Observable<SeatMap> {
    return this.http.get<SeatMap>(`${this.base}/seat-map/${flightId}`, {
      params: { cabinClass }
    });
  }

  lockSeat(flightId: string, seatId: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(
      `${this.base}/seats/${seatId}/lock`,
      { flightId }
    );
  }

  releaseSeat(seatId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/seats/${seatId}/lock`);
  }
}
