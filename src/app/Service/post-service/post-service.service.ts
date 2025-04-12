import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import {APP_CONSTANTS} from '../../../app/shared/app-constants';
@Injectable({
  providedIn: 'root'
})
export class PostServiceService {


   private REST_API_SERVER = APP_CONSTANTS.REST_API_SERVIER;
   private httpOptions = {
     headers: new HttpHeaders({
       'Content-Type': 'application/json'
     })
   };
   constructor(private http: HttpClient) {}


   public getPosts(skip: number, top: number): Observable<any> {
     const url = `${this.REST_API_SERVER}/posts?Top=${top}&Skip=${skip}&NeedToTalCount=true`;
     return this.http.get<any>(url, this.httpOptions)
       .pipe(catchError(this.handleError));
   }
   public getPostDetail(id: String): Observable<any> {
     const url =  `${this.REST_API_SERVER}/posts/`+id;
     return this.http.get<any>(url, this.httpOptions)
       .pipe(catchError(this.handleError));
   }

   public deletePost(data:string|undefined): Observable<any>{
     const url = `${this.REST_API_SERVER}/posts/`+data;
     return this.http
     .delete<any>(url)
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
  public postReportToExcel(fromDate: string, toDate: string): Observable<Blob> {
    const url = `${this.REST_API_SERVER}/report/post/excel?From=${fromDate}&To=${toDate}`;
    return this.http.get(url, {
      responseType: 'blob' // <-- Quan trọng để nhận file Excel
    }).pipe(
      catchError(this.handleError)
    );
  }
 }
