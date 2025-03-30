import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../../model/user';
import {APP_CONSTANTS} from '../../../app/shared/app-constants';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private REST_API_SERVER = APP_CONSTANTS.REST_API_SERVIER;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private http: HttpClient) {}


  public getUsersPaging(top: number, skip: number): Observable<any> {
    const url = `${this.REST_API_SERVER}/users?Top=${top}&Skip=${skip}&NeedToTalCount=true`;
    return this.http.get<any>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  public getUsers(): Observable<any> {
    const url = `${this.REST_API_SERVER}/users`;
    return this.http.get<any>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  public getUserDetail(id: String): Observable<any> {
    const url =  `${this.REST_API_SERVER}/users/`+id;
    return this.http.get<User>(url, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  public deleteUser(data:string|undefined): Observable<any>{
    const url = `${this.REST_API_SERVER}/users/`+data;
    return this.http
    .delete<any>(url)
      .pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    // Log the error to the console (or send it to a logging service)
    console.error('An error occurred:', error);

    // Return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}
