import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { FlightSearchParams, FlightSearchResult, Flight } from '../../../core/models';

@Injectable({ providedIn: 'root' })
export class FlightService {
  private http = inject(HttpClient);
  private base = environment.flightUrl;

  searchFlights(params: FlightSearchParams): Observable<FlightSearchResult> {
    let httpParams = new HttpParams()
      .set('origin',        params.origin)
      .set('destination',   params.destination)
      .set('departureDate', params.departureDate)
      .set('tripType',      params.tripType)
      .set('adults',        params.adults)
      .set('children',      params.children)
      .set('infants',       params.infants)
      .set('cabinClass',    params.cabinClass);

    if (params.returnDate) {
      httpParams = httpParams.set('returnDate', params.returnDate);
    }

    return this.http.get<FlightSearchResult>(`${this.base}/search`, { params: httpParams });
  }

  getFlightById(id: string): Observable<Flight> {
    return this.http.get<Flight>(`${this.base}/${id}`);
  }

  getPopularRoutes(): Observable<{ origin: string; destination: string; price: number }[]> {
    return this.http.get<any[]>(`${this.base}/popular-routes`);
  }

  getAirports(query: string): Observable<{ code: string; name: string; city: string }[]> {
    return this.http.get<any[]>(`${this.base}/airports`, {
      params: new HttpParams().set('q', query)
    });
  }
}
