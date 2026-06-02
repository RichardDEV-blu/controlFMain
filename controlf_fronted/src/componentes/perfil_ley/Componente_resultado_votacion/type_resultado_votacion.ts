interface ResultadoVotacion {
  id: string;
  titulo: string;
  valorPrincipal: number;
  unidadPrincipal: string;
  votosFavor: number;
  votosContra: number;
  votosAbstencion: number;
  escalaMinima: number;
  escalaMedia: number;
  escalaMaxima: number;
  tieneMenuOpciones: boolean;
}