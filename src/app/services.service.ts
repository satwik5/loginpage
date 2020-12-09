import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
const baseUrl = 'http://localhost:8080/api/userinformation';
@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(private _http: HttpClient) { }
  createUser(val){
    return this._http.post<any>(`${baseUrl}/create`,{data:val},{withCredentials:true})
   .pipe( 
      map(
        (res)=> { //console.log(res)
          return res['status']; 
        }),
        catchError(this.handleError)
    ); 
  }

  onLogin(user,pass){
   return this._http.post<any>(`${baseUrl}/getuser`,{useremail:user,password:pass},{withCredentials:true})
   .pipe( 
      map(
        (res)=> { //console.log(res)
          return res['status']; 
        }),
        catchError(this.handleError)
    ); 
  };
  addProduct(data){
    return this._http.post<any>(`${baseUrl}/addmoment`,{moment:data},{withCredentials:true})
     .pipe( 
        map(
          (res)=> { //console.log(res)
            return res['status']; 
          }),
          catchError(this.handleError)
      ); 
  }
  uploadImage(image){
    return this._http.post(`${baseUrl}/file`,image,{withCredentials:true})
    .pipe( 
       map(
         (res)=> { //console.log(res)
           return res; 
         }),
         catchError(this.handleError)
     ); 
  }
  getImage(){

  }
  editProduct(data, id){
    return this._http.post<any>(`${baseUrl}/editmoment`,{moment:data, id:id},{withCredentials:true})
     .pipe( 
        map(
          (res)=> { //console.log(res)
            return res['status']; 
          }),
          catchError(this.handleError)
      ); 
  }
  getMoments(){
    return this._http.get<any>(`${baseUrl}/getmoments`)
    .pipe( 
       map(
         (res)=> { //console.log(res)
           return res; 
         }),
         catchError(this.handleError)
     ); 
  }
  deleteMoment(id){
    return this._http.post<any>(`${baseUrl}/deletemoment`,{id:id},{withCredentials:true})
    .pipe( 
       map(
         (res)=> { //console.log(res)
           return res['status']; 
         }),
         catchError(this.handleError)
     ); 
  }
  private handleError(error: HttpErrorResponse){
    //console.log(error)
    return throwError(error);
  }
}
