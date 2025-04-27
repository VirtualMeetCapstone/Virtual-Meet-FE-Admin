import { Injectable } from '@angular/core';
import {APP_CONSTANTS} from '../../shared/app-constants';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {HttpAuthService} from '../http-auth/http-auth.service';
import {catchError, from, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RevenueServiceService {
  private REST_API_SERVER = APP_CONSTANTS.REST_API_SERVIER;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(
    private http: HttpClient,
    private httpAuthService: HttpAuthService
  ) {}

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);

    return throwError('Something bad happened; please try again later.');
  }
  public getRevenueReport(startDate : string , endDate: string): Observable<any> {
    const url = `${this.REST_API_SERVER}/vip-payment/payment-statistics?startDate=${startDate}&endDate=${endDate}`;
    return this.http
      .get<any>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
}
