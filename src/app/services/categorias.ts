import { inject, Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { categoriasResponse } from '../modelos/categoriasResponse';
import { categoriaBody } from '../modelos/categoriaBody';


@Injectable({
  providedIn: 'root'
})
export class Categorias {
  private http = inject(HttpClient);
  private baseUrl = appsettings.apiUrl;

  constructor() { }

  obtenerCategorias() {
    return this.http.get<categoriasResponse[]>(this.baseUrl + 'categoria/categoriasHabilitadas');
  }
  obtenerTodasCategorias() {
    return this.http.get<categoriasResponse[]>(this.baseUrl + 'categoria/categorias');
  }
  nueveaCategoria(categoria: categoriaBody) {
    return this.http.post(this.baseUrl + 'categoria/crearCategoria', categoria, { responseType: 'text' });
  }
  habilitarCategoria(idCategoria: number) {
    return this.http.post<void>(this.baseUrl + 'categoria/habilitar/' + idCategoria, null);
  }
  deshabilitarCategoria(idCategoria: number) {
    return this.http.post<void>(this.baseUrl + 'categoria/deshabilitar/' + idCategoria, null);
  }
}
