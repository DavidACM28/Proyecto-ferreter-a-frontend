import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { productosResponse } from '../modelos/productosResponse';
import { productoBody } from '../modelos/productoBody';

@Injectable({
  providedIn: 'root'
})
export class Productos {
  private http = inject(HttpClient);
  private baseUrl = appsettings.apiUrl;

  constructor() { }

  obtenerProductos(){
    return this.http.get<productosResponse[]>(this.baseUrl + 'producto/productos');
  }

  obtenerMasVendidos(){
    return this.http.get<productosResponse[]>(this.baseUrl + 'producto/masVendidos');
  }

  nuevoProducto(producto: productoBody){
    return this.http.post<productosResponse>(this.baseUrl + 'producto/nuevoProducto', producto);
  }

  actualizarProducto(producto: productosResponse){
    return this.http.post(this.baseUrl + 'producto/actualizar', producto, {responseType: 'text'});
  }
}
