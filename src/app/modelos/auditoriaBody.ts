import { productosResponse } from "./productosResponse";
import { Trabajador } from "./trabajador";

export interface AuditoriaBody{
    producto: productosResponse;
    accion: string;
    cantidadAnterior: number;
    cantidadNueva: number;
    trabajador: Trabajador;
    referencia: string;
}