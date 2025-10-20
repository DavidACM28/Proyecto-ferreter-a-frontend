import { Trabajador } from "./trabajador";

export interface loginResponse {
  accessToken: string;
  tokenType: string;
  trabajador: Trabajador;
}



