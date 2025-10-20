import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { auditoriaResponse } from '../modelos/auditoriaResponse';
import { PageResponse } from '../modelos/pageResponse';

@Injectable({
  providedIn: 'root'
})
export class Auditoria {
  private http = inject(HttpClient);
  private baseUrl = appsettings.apiUrl;

  constructor() { }

  obtenerAuditorias(pagina: number){
    return this.http.get<PageResponse<auditoriaResponse>>(this.baseUrl + 'auditoria/auditorias' + '?page=' + pagina + '&size=8');
  }
  filtrarAuditorias(producto: string, tipo: string, desde: string, hasta: string, page: number) {
  let params: any = { page };

  if (producto) params.producto = producto;
  if (tipo) params.tipo = tipo;
  if (desde) params.fechaInicio = desde;
  if (hasta) params.fechaFin = hasta;

  return this.http.get<any>(`${this.baseUrl}auditoria/filtrar`, { params });
}
}
