import { productosResponse } from "./productosResponse";
import { Trabajador } from "./trabajador";

export interface auditoriaResponse {
  idAuditoriaInventario: number;
  producto: productosResponse;
  accion: string;
  cantidadAnterior: number;
  cantidadNueva: number;
  trabajador: Trabajador;
  referencia: string;
  fecha: string;
}