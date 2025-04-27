import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders, HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, from, Observable, throwError } from 'rxjs';
import { APP_CONSTANTS } from '../../../app/shared/app-constants';
import { HttpAuthService } from '../http-auth/http-auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoomServiceService {
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

  public getRooms(): Observable<any> {
    const url = `${this.REST_API_SERVER}/rooms`;
    return this.http
      .get<any>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  public getRoomsPaging(skip: number, top: number): Observable<any> {
    const url = `${this.REST_API_SERVER}/rooms?Top=${top}&Skip=${skip}&NeedToTalCount=true`;
    return this.http
      .get<any>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  public getRoomDetail(id: String): Observable<any> {
    const url = `${this.REST_API_SERVER}/rooms/` + id;
    return this.http
      .get<any>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteRoom(data: string | undefined): Observable<any> {
    if (!data) {
      return throwError(() => new Error('No room id provided'));
    }
    const url = `${this.REST_API_SERVER}/rooms/${data}`;

    return from(
      this.httpAuthService
        .fetchWithAuth(url, { method: 'DELETE' })
        .then(async (response) => {
          if (!response) throw new Error('No response or unauthorized');
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
          }
          return response.json();
        })
    );
  }
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);

    return throwError('Something bad happened; please try again later.');
  }
  public getMeetingReport(): Observable<any> {
    const url = `${this.REST_API_SERVER}/RoomStatictis?Top=1000000000&Skip=0`;
    return this.http
      .get<any>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  public getMeetingReportDetail(id: string): Observable<any> {
    const url = `${this.REST_API_SERVER}/RoomStatictis/${id}`;
    return this.http
      .get<any>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  getMeetingReportsByDateRange(startDate: string, endDate: string): Observable<any> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get(`${this.REST_API_SERVER}/RoomStatictis/date-range`, { params });
  }
}
