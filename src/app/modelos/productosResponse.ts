import { categoriasResponse } from "./categoriasResponse";

export interface productosResponse {
  idProducto: number;
  categoria: categoriasResponse | null;
  nombreProducto: string | null;
  descripcionProducto: string | null;
  precioProducto: number | null;
  cantidadProducto: number | null;
  estadoProducto: boolean | null;
}