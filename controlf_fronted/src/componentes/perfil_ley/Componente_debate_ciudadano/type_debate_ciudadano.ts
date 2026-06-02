export interface DebateCiudadano {
  id: string;
  titulo: string;
  puntuacionPromedio: number;
  puntuacionMaxima: number;
  comentarios: ComentarioDebate[];
  placeholderComentario: string;
  tieneBotonEnviar: boolean;
}