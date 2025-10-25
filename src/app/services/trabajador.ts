import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appsettings } from '../settings/appsettings';
import { TrabajadorBody } from '../modelos/trabajadorBody';
import { Trabajador } from '../modelos/trabajador';

@Injectable({
  providedIn: 'root'
})
export class TrabajadorService {
  private http = inject(HttpClient);
  private baseUrl = appsettings.apiUrl;

  constructor() { }

  listarTrabajadores() {
    return this.http.get<Trabajador[]>(this.baseUrl + 'trabajador/trabajadores');
  }

  editarTrabajador(trabajador: Trabajador) {
    return this.http.post(this.baseUrl + 'trabajador/editarTrabajador', trabajador, { responseType: 'text' });
  }

  nuevoTrabajador(trabajador: TrabajadorBody) {
    return this.http.post(this.baseUrl + 'api/auth/registrarTrabajador', trabajador, { responseType: 'text' });
  }

  habilitarTrabajador(idTrabajador: number) {
    return this.http.post(this.baseUrl + 'trabajador/habilitarTrabajador/' + idTrabajador, null, { responseType: 'text' });
  }

  deshabilitarTrabajador(idTrabajador: number) {
    return this.http.post(this.baseUrl + 'trabajador/deshabilitarTrabajador/' + idTrabajador, null, { responseType: 'text' });
  }
}
