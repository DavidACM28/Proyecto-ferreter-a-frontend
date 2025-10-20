import { Trabajador } from "./trabajador";

export interface VentaBody{
    trabajador: Trabajador;
    totalVenta: number;
}