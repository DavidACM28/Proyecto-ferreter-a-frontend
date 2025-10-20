import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Externos {
  private http = inject(HttpClient);
  private baseUrl = 'https://dniruc.apisperu.com/api/v1/';
  constructor() { }

  obtenerDNI(dni: string){
    return this.http.get<any>(this.baseUrl + 'dni/' + dni + '?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRhY2FzbW9yZTZAZ21haWwuY29tIn0.9YUEkan3SEBcP3KHDqa26sEn1OAmjIf1UvD0TbSE4vY');
  }

  obtenerRUC(ruc: string){
    return this.http.get<any>(this.baseUrl + 'ruc/' + ruc + '?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRhY2FzbW9yZTZAZ21haWwuY29tIn0.9YUEkan3SEBcP3KHDqa26sEn1OAmjIf1UvD0TbSE4vY');
  }
}
