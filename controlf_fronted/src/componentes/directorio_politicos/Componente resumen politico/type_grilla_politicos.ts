interface GrillaPoliticos {
  id: string;                  // Identificador de la grilla
  cartas: CartaPolitico[];     // Lista de tarjetas (ver type_carta_politico.ts)
  paginaActual: number;        // Página actual
  totalPaginas: number;        // Total de páginas
}