import { Injectable } from '@angular/core';
import {APP_CONSTANTS} from '../../shared/app-constants';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogoServiceService {

  private REST_API_SERVER = APP_CONSTANTS.REST_API_SERVIER;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private http: HttpClient) {}
  public updateLogo(mediaUpload: File): Observable<any> {
    const url = `${this.REST_API_SERVER}/admin/logo`;

    const formData = new FormData();
    formData.append('MediaUpload', mediaUpload); // chỉ upload file ảnh

    return this.http.put<any>(url, formData).pipe(
      catchError(this.handleError)
    );
  }
  getLogo(): Observable<any> {
    const url = `${this.REST_API_SERVER}/admin/logo`;

    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    );
  }
  private handleError(error: HttpErrorResponse) {

    console.error('An error occurred:', error);


    return throwError('Something bad happened; please try again later.');
  }

}
