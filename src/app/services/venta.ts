import { inject, Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { VentaBody } from '../modelos/ventaBody';
import { ventaResponse } from '../modelos/ventaResponse';
import { DetalleBody } from '../modelos/detalleBody';
import { DetalleResponse } from '../modelos/detalleResponse';
import { AuditoriaBody } from '../modelos/auditoriaBody';
import { PageResponse } from '../modelos/pageResponse';

@Injectable({
  providedIn: 'root'
})
export class Venta {
  private http = inject(HttpClient);
  private baseUrl = appsettings.apiUrl;

  constructor() { }

  crearVenta(venta: VentaBody) {
    return this.http.post<ventaResponse>(this.baseUrl + 'venta/nuevoVenta', venta);
  }

  crearDetalleVenta(detalle: DetalleBody) {
    return this.http.post<DetalleResponse>(this.baseUrl + 'detalleVenta/crear', detalle);
  }

  crearAuditoria(auditoria: AuditoriaBody) {
    return this.http.post(this.baseUrl + 'auditoria/crear', auditoria, { responseType: 'text' });
  }

  ventasMesActual() {
    return this.http.get(this.baseUrl + 'venta/ventasMesActual', { responseType: 'text' });
  }

  obtenerVentasPage(pagina: number) {
    return this.http.get<PageResponse<ventaResponse>>(this.baseUrl + 'venta/ventasPage' + '?page=' + pagina + '&size=8');
  }

  filtrarVentas(nombre: string, apellido: string, cliente: string, medioPago: string, desde: string, hasta: string, page: number) {
    let params: any = { page };

    if (nombre) params.nombre = nombre;
    if (apellido) params.apellido = apellido;
    if (cliente) params.cliente = cliente;
    if (medioPago) params.medioPago = medioPago;
    if (desde) params.fechaInicio = desde;
    if (hasta) params.fechaFin = hasta;

    return this.http.get<any>(`${this.baseUrl}venta/filtrar`, { params });
  }
}
