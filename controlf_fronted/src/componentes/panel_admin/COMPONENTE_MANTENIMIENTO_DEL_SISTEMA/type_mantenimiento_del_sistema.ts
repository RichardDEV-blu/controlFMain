interface PanelMantenimientoServidor {
  id: string;
  titulo: string;
  codigoReferencia: string;
  estadoBaseDeDatos: boolean;
  estadoEtiqueta: string;
  fechaUltimoRespaldo: string;
  cargaServidorPorcentaje: number;
  accionesDisponibles: string[];
}