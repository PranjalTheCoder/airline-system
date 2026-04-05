import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SeatMap } from '../../../core/models';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private http = inject(HttpClient);
  private base = environment.inventoryUrl;

  getSeatMap(flightId: string, cabinClass: string): Observable<SeatMap> {
    const params = new HttpParams()
      .set('flightId', flightId)
      .set('cabinClass', cabinClass);
    // UPDATED: Calls /seatmap with both flightId and cabinClass as query parameters
    return this.http.get<any>(`${this.base}/seatmap`, { params }).pipe(
      map((response) => {
        // Bulletproof parsing: If Java wraps the response in {"seatMap": {...}} or just returns it directly
        if (response?.seatMaps && response.seatMaps.length > 0) {
          return response.seatMaps[0];
        }
        return response?.seatMap || response?.data || response;
      }),
      catchError((err) => {
        console.error('Seat Map API Error:', err);
        throw err;
      }),
    );
  }

  lockSeat(flightId: string, seatId: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(
      `${this.base}/seats/${seatId}/lock?flightId=${flightId}`,
      { flightId },
    );
  }

  // Update to require flightId
  releaseSeat(flightId: string, seatId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/seats/${seatId}/lock?flightId=${flightId}`);
  }
}
