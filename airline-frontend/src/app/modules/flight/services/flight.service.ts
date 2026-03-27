import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  FlightSearchParams,
  FlightSearchResult,
  Flight,
} from '../../../core/models';

@Injectable({ providedIn: 'root' })
export class FlightService {
  private http = inject(HttpClient);
  private base = environment.flightUrl;

  searchFlights(params: FlightSearchParams): Observable<FlightSearchResult> {
    // 1. STRICT DATE FORMATTING (with 'any' cast to satisfy TypeScript)
    const rawDate: any = params.departureDate;
    const formattedDate =
      rawDate instanceof Date
        ? rawDate.toISOString().split('T')[0]
        : String(rawDate).split('T')[0];

    const cabin = (params.cabinClass || 'ECONOMY').toUpperCase();
    const totalPassengers =
      Number(params.adults || 1) +
      Number(params.children || 0) +
      Number(params.infants || 0);

    let httpParams = new HttpParams()
      .set('origin', params.origin)
      .set('destination', params.destination)
      .set('date', formattedDate)
      .set('passengers', totalPassengers)
      .set('cabinClass', cabin);

    if (params.returnDate) {
      const rawRet: any = params.returnDate;
      const retDate =
        rawRet instanceof Date
          ? rawRet.toISOString().split('T')[0]
          : String(rawRet).split('T')[0];
      httpParams = httpParams.set('returnDate', retDate);
    }

    return this.http
      .get<any>(`${this.base}/search`, { params: httpParams })
      .pipe(
        map((response) => {
          // Bulletproof array extraction for flights
          const flightList =
            response?.flights ||
            response?.outbound ||
            (Array.isArray(response) ? response : []);
          return {
            outbound: flightList,
            searchId: response?.searchId || 'SRCH-' + Date.now(),
            currency: response?.currency || 'USD',
            totalResults: response?.totalResults || flightList.length,
          } as FlightSearchResult;
        }),
        catchError((err) => {
          console.error('Flight Search API Error:', err);
          return of({
            outbound: [],
            searchId: '',
            currency: 'USD',
            totalResults: 0,
          } as FlightSearchResult);
        }),
      );
  }

  getFlightById(id: string): Observable<Flight> {
    return this.http.get<Flight>(`${this.base}/${id}`);
  }

  getPopularRoutes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/popular-routes`).pipe(
      catchError(() => of([])), // Prevents homepage crash if endpoint doesn't exist yet
    );
  }

  getAirports(
    query: string,
  ): Observable<{ code: string; name: string; city: string }[]> {
    return this.http
      .get<any>(`${this.base}/airports`, {
        params: new HttpParams().set('q', query),
      })
      .pipe(
        map((res) => {
          // ✅ FIX: Handles raw arrays OR objects like { airports: [...] } from Java
          if (Array.isArray(res)) return res;
          if (res?.airports && Array.isArray(res.airports)) return res.airports;
          if (res?.data && Array.isArray(res.data)) return res.data;
          return [];
        }),
        catchError((err) => {
          console.error('Airports Dropdown API Error:', err);
          return of([]); // Keeps dropdown from permanently breaking on 500 error
        }),
      );
  }
}
