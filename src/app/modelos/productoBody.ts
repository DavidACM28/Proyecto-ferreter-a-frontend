import { categoriasResponse } from "./categoriasResponse";

export interface productoBody {
  categoria: categoriasResponse;
  nombreProducto: string;
  descripcionProducto: string;
  precioProducto: number;
  cantidadProducto: number;
  estadoProducto: boolean;
}