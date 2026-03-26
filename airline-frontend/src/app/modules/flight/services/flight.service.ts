import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
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
    // 1. Calculate total passengers for the Java backend
    const totalPassengers = (params.adults || 1) + (params.children || 0) + (params.infants || 0);

    // 2. Build the parameters exactly as Spring Boot expects them
    let httpParams = new HttpParams()
      .set('origin',      params.origin)
      .set('destination', params.destination)
      .set('date',        params.departureDate) // ✅ Changed to 'date'
      .set('passengers',  totalPassengers)      // ✅ Changed to 'passengers'
      .set('cabinClass',  params.cabinClass || 'ECONOMY');
    // let httpParams = new HttpParams()
    //   .set('origin', params.origin)
    //   .set('destination', params.destination)
    //   .set('departureDate', params.departureDate)
    //   .set('tripType', params.tripType)
    //   .set('adults', params.adults)
    //   .set('children', params.children)
    //   .set('infants', params.infants)
    //   .set('cabinClass', params.cabinClass);

    if (params.returnDate) {
      httpParams = httpParams.set('returnDate', params.returnDate);
    }

    return this.http
      .get<any>(`${this.base}/search`, { params: httpParams })
      .pipe(
        map((response) => {
          // Grab the array whether it is called 'flights' (Java) or 'outbound' (Mock)
          const flightList = response.flights || response.outbound || [];

          return {
            outbound: flightList,
            searchId: response.searchId || 'SRCH-' + Date.now(),
            currency: response.currency || 'USD',
            totalResults: response.totalResults || flightList.length,
          } as FlightSearchResult;
        }),
      );
  }

  getFlightById(id: string): Observable<Flight> {
    return this.http.get<Flight>(`${this.base}/${id}`);
  }

  getPopularRoutes(): Observable<
    { origin: string; destination: string; price: number }[]
  > {
    return this.http.get<any[]>(`${this.base}/popular-routes`);
  }

  getAirports(
    query: string,
  ): Observable<{ code: string; name: string; city: string }[]> {
    return this.http.get<any[]>(`${this.base}/airports`, {
      params: new HttpParams().set('q', query),
    });
  }
}
