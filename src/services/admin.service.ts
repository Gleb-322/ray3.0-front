import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAdmin, IPatients } from '../types/types';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private baseUrl: string | undefined;
  constructor(private _http: HttpClient) {
    this.baseUrl = environment.baseUrl;
  }

  //login admin
  postLoginAdmin(body: IAdmin): Observable<{
    token: string | null;
    errorMessage: null | string;
    errorCode: number;
  }> {
    return this._http.post<{
      token: string | null;
      errorMessage: null | string;
      errorCode: number;
    }>(`${this.baseUrl}admin/login`, body);
  }

  // logout admin
  logOutAdmin(body: string): Observable<{
    message: string;
    errorCode: number;
  }> {
    const bodyObj = {
      token: body,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    });

    const requestOptions = { headers };
    return this._http.post<{
      message: string;
      errorCode: number;
    }>(`${this.baseUrl}admin/logout`, bodyObj, requestOptions);
  }

  // get all patients
  getAllPatients(
    page: number,
    limit: number,
    keyword: string = ''
  ): Observable<{
    body: IPatients[] | null;
    count: number | null;
    errorMessage: string | null;
    errorCode: number;
  }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    });

    const requestOptions = { headers };

    return this._http.get<{
      body: IPatients[] | null;
      count: number | null;
      errorMessage: string | null;
      errorCode: number;
    }>(
      `${this.baseUrl}admin/patients?page=${page}&limit=${limit}&keyword=${keyword}`,
      requestOptions
    );
  }

  //update patient
  updatePatients(body: IPatients): Observable<{
    body: IPatients | null;
    errorMessage: string | null;
    errorCode: number;
  }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    });
    const requestOptions = { headers };

    return this._http.patch<{
      body: IPatients | null;
      errorMessage: string | null;
      errorCode: number;
    }>(`${this.baseUrl}admin/patients`, body, requestOptions);
  }

  // delete patient
  deletePatient(_id: string): Observable<{
    body: IPatients | null;
    errorMessage: string | null;
    errorCode: number;
  }> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    });

    const requestOptions = { headers };

    return this._http.delete<{
      body: IPatients | null;
      errorMessage: string | null;
      errorCode: number;
    }>(`${this.baseUrl}admin/patients/${_id}`, requestOptions);
  }
}
