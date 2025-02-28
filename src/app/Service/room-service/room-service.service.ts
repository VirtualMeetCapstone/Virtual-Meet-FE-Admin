import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import {APP_CONSTANTS} from '../../../app/shared/app-constants';

@Injectable({
  providedIn: 'root'
})
export class RoomServiceService {
  
 
  private REST_API_SERVER = APP_CONSTANTS.REST_API_SERVIER;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private http: HttpClient) {}


  public getRooms(): Observable<any> {
    const url = `${this.REST_API_SERVER}/rooms`;
    return this.http.get<any>(url, this.httpOptions)
      .pipe(catchError(this.handleError)); 
  }
  public getRoomsPaging(skip:number, top : number): Observable<any> {
    const url = `${this.REST_API_SERVER}/rooms?Top=${top}&Skip=${skip}&NeedToTalCount=true`;
    return this.http.get<any>(url, this.httpOptions)
      .pipe(catchError(this.handleError)); 
  }
  public getRoomDetail(id: String): Observable<any> {
    const url =  `${this.REST_API_SERVER}/rooms/`+id;
    return this.http.get<any>(url, this.httpOptions)
      .pipe(catchError(this.handleError)); 
  }

  public deleteRoom(data:string|undefined): Observable<any>{
    const url = `${this.REST_API_SERVER}/rooms/`+data;
    return this.http
    .delete<any>(url)
      .pipe(catchError(this.handleError)); 
  }
  private handleError(error: HttpErrorResponse) {
    
    console.error('An error occurred:', error);
    
    
    return throwError('Something bad happened; please try again later.');
  }
}
