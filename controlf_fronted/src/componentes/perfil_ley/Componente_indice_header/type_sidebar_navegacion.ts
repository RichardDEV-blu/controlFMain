interface SidebarNavegacion {
  id: string;                    // Identificador del sidebar
  logoTexto: string;             // Texto del logo superior
  seccionLabel: string;          // Etiqueta de la sección (ej: PLATAFORMA)
  items: ItemNavegacion[];       // Items de navegación (ver type_item_navegacion.ts)
  fotoUrlUsuario: string;        // Avatar del usuario en la parte inferior
}