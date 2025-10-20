import { productosResponse } from "./productosResponse";
import { ventaResponse } from "./ventaResponse";

export interface DetalleResponse {
    idDetalle: number;    
    producto: productosResponse;
    venta: ventaResponse;
    cantidadProducto: number;
    precioProducto: number;
}