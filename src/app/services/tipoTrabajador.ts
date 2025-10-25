import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { TipoTrabajador } from '../modelos/tipoTrabajador';

@Injectable({
  providedIn: 'root'
})
export class TipoTrabajadorService {
  
  private http = inject(HttpClient);
  private baseUrl = appsettings.apiUrl;

  constructor() { }

  listarTipos(){
    return this.http.get<TipoTrabajador[]>(this.baseUrl + 'tipoTrabajador/tipoTrabajadores');
  }
}
