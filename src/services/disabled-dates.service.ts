import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRangeDate } from '../types/types';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DisabledDatesService {
  private baseUrl: string | undefined;
  constructor(private _http: HttpClient) {
    this.baseUrl = environment.baseUrl;
  }

  // get array disabled dates
  getDisabledDates(): Observable<{
    body: IRangeDate[] | null;
    errorMessage: string | null;
    errorCode: number;
  }> {
    return this._http.get<{
      body: IRangeDate[] | null;
      errorMessage: string | null;
      errorCode: number;
    }>(`${this.baseUrl}getDisabledDates`);
  }

  // post new array of disabled dates
  postDisabledDates(body: IRangeDate[]): Observable<{
    body: string | null;
    errorMessage: string | null;
    errorCode: number;
  }> {
    return this._http.post<{
      body: string | null;
      errorMessage: string | null;
      errorCode: number;
    }>(`${this.baseUrl}postDisabledDates`, body);
  }

  // post array of dates which need to undisabled
  postUnlockDisabledDates(body: IRangeDate[]): Observable<{
    body: string | null;
    errorMessage: string | null;
    errorCode: number;
  }> {
    return this._http.post<{
      body: string | null;
      errorMessage: string | null;
      errorCode: number;
    }>(`${this.baseUrl}undisabledDates`, body);
  }
}
