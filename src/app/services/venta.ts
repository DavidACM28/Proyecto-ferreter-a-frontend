import { inject, Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { VentaBody } from '../modelos/ventaBody';
import { ventaResponse } from '../modelos/ventaResponse';
import { DetalleBody } from '../modelos/detalleBody';
import { DetalleResponse } from '../modelos/detalleResponse';
import { AuditoriaBody } from '../modelos/auditoriaBody';

@Injectable({
  providedIn: 'root'
})
export class Venta {
  private http = inject(HttpClient);
  private baseUrl = appsettings.apiUrl;

  constructor() { }

  crearVenta(venta: VentaBody){
    return this.http.post<ventaResponse>(this.baseUrl + 'venta/nuevoVenta', venta);
  }

  crearDetalleVenta(detalle: DetalleBody){
    return this.http.post<DetalleResponse>(this.baseUrl + 'detalleVenta/crear', detalle);
  }

  crearAuditoria(auditoria: AuditoriaBody){
    return this.http.post(this.baseUrl + 'auditoria/crear', auditoria, {responseType: 'text'});
  }
}
