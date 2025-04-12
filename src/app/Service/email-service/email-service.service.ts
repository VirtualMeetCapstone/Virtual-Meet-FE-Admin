import { Injectable } from '@angular/core';
import {APP_CONSTANTS} from '../../shared/app-constants';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailServiceService {


  private REST_API_SERVER = APP_CONSTANTS.REST_API_SERVIER;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private http: HttpClient) {}


  public emailNotification(subject: string, content: string): Observable<any> {
    const url = `${this.REST_API_SERVER}/notifications/system`;
    const body = {
      subject: subject,
      content: content
    };

    return this.http.post<any>(url, body, this.httpOptions)
      .pipe(catchError(this.handleError));
  }


  private handleError(error: HttpErrorResponse) {

    console.error('An error occurred:', error);


    return throwError('Something bad happened; please try again later.');
  }
  public postReport(fromDate: string, toDate: string): Observable<any> {
    const url = `${this.REST_API_SERVER}/report/post?From=${fromDate}&To=${toDate}`;
    return this.http
      .get<any>(url)
      .pipe(catchError(this.handleError));
  }
}
