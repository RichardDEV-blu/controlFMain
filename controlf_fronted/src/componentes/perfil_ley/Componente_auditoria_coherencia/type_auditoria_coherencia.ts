interface AuditoriaCoherencia {
  id: string;                  // Identificador único de la auditoría
  titulo: string;              // Título del componente
  subtitulo: string;           // Descripción debajo del título
  filas: FilaAuditoria[];      // Lista de filas (subcomponente)
  textoVerMas: string;         // Texto del enlace inferior
}