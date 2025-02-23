import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomServiceService {
  
 
  private REST_API_SERVIER = 'http://dev-vmeet.runasp.net';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private http: HttpClient) {}


  public getRooms(): Observable<any> {
    const url = `${this.REST_API_SERVIER}/rooms`;
    return this.http.get<any>(url, this.httpOptions)
      .pipe(catchError(this.handleError)); 
  }
  public getRoomsPaging(skip:number, top : number): Observable<any> {
    const url = `${this.REST_API_SERVIER}/rooms?Top=${top}&Skip=${skip}&NeedToTalCount=true`;
    return this.http.get<any>(url, this.httpOptions)
      .pipe(catchError(this.handleError)); 
  }
  public getRoomDetail(id: String): Observable<any> {
    const url =  `${this.REST_API_SERVIER}/rooms/`+id;
    return this.http.get<any>(url, this.httpOptions)
      .pipe(catchError(this.handleError)); 
  }

  public deleteRoom(data:string|undefined): Observable<any>{
    const url = `${this.REST_API_SERVIER}/rooms/`+data;
    return this.http
    .delete<any>(url)
      .pipe(catchError(this.handleError)); 
  }
  private handleError(error: HttpErrorResponse) {
    
    console.error('An error occurred:', error);
    
    
    return throwError('Something bad happened; please try again later.');
  }
}
