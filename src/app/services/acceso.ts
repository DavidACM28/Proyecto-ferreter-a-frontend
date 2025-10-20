import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { Login } from '../modelos/login';
import { loginResponse } from '../modelos/loginResponse';

@Injectable({
  providedIn: 'root'
})
export class Acceso {
  
  private http = inject(HttpClient);
  private baseUrl = appsettings.apiUrl;

  constructor() { }

  login(usuario:Login){
    return this.http.post<loginResponse>(this.baseUrl + 'api/auth/login', usuario);
  }
}
