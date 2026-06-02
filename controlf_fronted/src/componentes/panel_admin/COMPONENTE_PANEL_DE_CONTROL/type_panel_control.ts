interface PanelControl {
  tituloSeccion: string;
  opciones: {
    nombreOpcion: string;
    icono: string;
    notificacionBadge?: number;
  }[];
}