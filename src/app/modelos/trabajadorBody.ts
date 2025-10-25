import { TipoTrabajador } from "./tipoTrabajador";

export interface TrabajadorBody {
  username: string;
  password: string;
  nombre: string;
  apellido: string;
  tipoTrabajador: TipoTrabajador;
  estadoTrabajador: boolean;
}