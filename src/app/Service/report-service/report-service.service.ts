import { Injectable } from '@angular/core';
import {APP_CONSTANTS} from '../../shared/app-constants';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportServiceService {
  private REST_API_SERVER = APP_CONSTANTS.REST_API_SERVIER;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private http: HttpClient) {}


  public getReportList(): Observable<any> {
    const url = `${this.REST_API_SERVER}/report/get-all-reports`;
    return this.http.get<any>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {

    console.error('An error occurred:', error);


    return throwError('Something bad happened; please try again later.');
  }
}
