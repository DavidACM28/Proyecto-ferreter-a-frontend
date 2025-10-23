import { inject, Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { DetalleResponse } from '../modelos/detalleResponse';


@Injectable({
  providedIn: 'root'
})
export class Detalle {
  private http = inject(HttpClient);
  private baseUrl = appsettings.apiUrl;

  constructor() { }

    findByIdVenta(idVenta: number){
    return this.http.get<DetalleResponse[]>(this.baseUrl + 'detalleVenta/detalles/' + idVenta);
  }
}
