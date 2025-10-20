import { productosResponse } from "./productosResponse";
import { ventaResponse } from "./ventaResponse";

export interface DetalleBody{
    producto: productosResponse;
    venta: ventaResponse;
    cantidadProducto: number;
    precioProducto: number;
}