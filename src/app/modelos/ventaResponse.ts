import { Trabajador } from "./trabajador";

export interface ventaResponse {
    idVenta: number;
    trabajador: Trabajador;
    fechaVenta: Date;
    totalVenta: number;
}