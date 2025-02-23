import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostServiceService {

 
   private REST_API_SERVIER = 'http://dev-vmeet.runasp.net';
   private httpOptions = {
     headers: new HttpHeaders({
       'Content-Type': 'application/json'
     })
   };
   constructor(private http: HttpClient) {}
 
 
   public getPosts(skip: number, top: number): Observable<any> {
     const url = `${this.REST_API_SERVIER}/posts?Top=${top}&Skip=${skip}&NeedToTalCount=true`;
     return this.http.get<any>(url, this.httpOptions)
       .pipe(catchError(this.handleError)); 
   }
   public getPostDetail(id: String): Observable<any> {
     const url =  `${this.REST_API_SERVIER}/posts/`+id;
     return this.http.get<any>(url, this.httpOptions)
       .pipe(catchError(this.handleError)); 
   }
 
   public deletePost(data:string|undefined): Observable<any>{
     const url = `${this.REST_API_SERVIER}/posts/`+data;
     return this.http
     .delete<any>(url)
       .pipe(catchError(this.handleError)); 
   }
   private handleError(error: HttpErrorResponse) {
     
     console.error('An error occurred:', error);
     
     
     return throwError('Something bad happened; please try again later.');
   }
 }
 