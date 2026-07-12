export type IHistorialCoherencia = {
  leyTitulo: string;
  votoReal: string;
  resultado: string;
  analisis: string;
};

export type ComentarioDebate = {
  id: string;
  usuario: string;
  mensaje: string;
  fecha: string;
  avatarUrl: string;
};

export type PerfilPolitico = {
  id: string;
  nombre: string;
  organizacion: string;
  cargo: string;
  patrimonio: string;
  fotoUrl: string;
  antecedentes: string;
  estaActivo: boolean;
  porcentajeCoherencia: number;
  estadoEtiqueta: string;
  indiceReputacion: number;
  totalCalificaciones: number;
  etiquetaReputacion: string;
  historial: IHistorialCoherencia[];
  comentarios: ComentarioDebate[];
};
