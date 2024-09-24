import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDate, IPatients, IPhone } from '../types/types';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PatientsService {
  private baseUrl: string | undefined;
  constructor(private http: HttpClient) {
    this.baseUrl = environment.baseUrl;
  }

  // get array of free time by seleckted date
  postTimeByDate(body: IDate): Observable<{
    body: string[];
    errorMessage: string | null;
    errorCode: number;
  }> {
    return this.http.post<{
      body: string[];
      errorMessage: string | null;
      errorCode: number;
    }>(`${this.baseUrl}patients/time`, body);
  }

  // create new patient
  postPatients(body: IPatients): Observable<{
    body: IPatients;
    errorMessage: string | null;
    errorCode: number;
  }> {
    return this.http.post<{
      body: IPatients;
      errorMessage: string | null;
      errorCode: number;
    }>(`${this.baseUrl}patients`, body);
  }

  // check if patient already created
  postCheckPatient(body: IPhone): Observable<{
    body: IPatients | null;
    adminPhone: boolean;
    errorMessage: string | null;
    errorCode: number;
  }> {
    return this.http.post<{
      body: IPatients | null;
      adminPhone: boolean;
      errorMessage: string | null;
      errorCode: number;
    }>(`${this.baseUrl}patients/check`, body);
  }

  // async validate phone input in backend
  validatePhone(
    phone: string
  ): Observable<{ isValid: boolean; message: string | null }> {
    const objectBody = { phone };
    return this.http.post<{ isValid: boolean; message: string | null }>(
      `${this.baseUrl}patients/phone`,
      objectBody
    );
  }
}
