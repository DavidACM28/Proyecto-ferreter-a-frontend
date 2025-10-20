interface RespuestaRucConDatos {
  ruc: string;
  razonSocial: string;
  nombreComercial: string | null;
  telefonos: string[];
  tipo: string | null;
  estado: string;
  condicion: string;
  direccion: string;
  departamento: string;
  provincia: string;
  distrito: string;
  fechaInscripcion: string | null;
  sistEmsion: string | null;
  sistContabilidad: string | null;
  actExterior: string | null;
  actEconomicas: any[]; // puedes tiparlo mejor si sabes la estructura
  cpPago: any[];
  sistElectronica: any[];
  fechaEmisorFe: string | null;
  cpeElectronico: any[];
  fechaPle: string | null;
  padrones: any[];
  fechaBaja: string | null;
  profesion: string | null;
  ubigeo: string;
  capital: string;
}