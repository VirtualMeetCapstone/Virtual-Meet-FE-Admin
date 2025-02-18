import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://dev-vmeet.runasp.net/users';  // URL của API
  private REST_API_SERVIER = 'http://dev-vmeet.runasp.net';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private http: HttpClient) {}

  // Phương thức gọi API để lấy dữ liệu users
  getUsers1(): Observable<any> {
    return this.http.get(this.apiUrl);  // Gửi request GET
  }

  public getUsers(): Observable<any> {
    const url = `${this.REST_API_SERVIER}/users`;
    return this.http.get<any>(url, this.httpOptions)
      .pipe(catchError(this.handleError)); 
  }
  public getUserDetail(id: String): Observable<any> {
    const url =  `${this.REST_API_SERVIER}/users/`+id;
    return this.http.get<any>(url, this.httpOptions)
      .pipe(catchError(this.handleError)); 
  }
  private handleError(error: HttpErrorResponse) {
    // Log the error to the console (or send it to a logging service)
    console.error('An error occurred:', error);
    
    // Return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
}
