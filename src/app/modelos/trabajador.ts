import { TipoTrabajador } from "./tipoTrabajador";

export interface Trabajador {
  idTrabajador: number;
  tipoTrabajador: TipoTrabajador | null;
  nombreTrabajador: string | null;
  apellidoTrabajador: string | null;
  usuarioTrabajador: string | null;
  contraseñaTrabajador: string | null;
  estadoTrabajador: boolean | null;
}