import { inject, Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { categoriasResponse } from '../modelos/categoriasResponse';

@Injectable({
  providedIn: 'root'
})
export class Categorias {
  private http = inject(HttpClient);
  private baseUrl = appsettings.apiUrl;

  constructor() { }

  obtenerCategorias(){
    return this.http.get<categoriasResponse[]>(this.baseUrl + 'categoria/categorias');
  }
}
