# Casos de Uso — ControlF

Casos de uso respaldados por la funcionalidad realmente implementada en el backend (controladores/servicios) y el frontend (rutas y componentes).

## Actores

- **Usuario** — ciudadano (anónimo o registrado).
- **Validador** — modera contenido ciudadano.
- **Administrador** — gestiona datos, importaciones y mantenimiento.
- **Sistemas externos** — API de la Asamblea Nacional y Gemini/IA.

---

| # | Caso de uso | Descripción corta | Actor(es) |
|---|-------------|-------------------|-----------|
| CU-01 | Registrar cuenta | Crear una cuenta con validación de datos (`/auth/registro`). | Usuario |
| CU-02 | Verificar disponibilidad | Comprobar si email/usuario ya existe antes de registrarse (`/auth/availability`). | Usuario |
| CU-03 | Iniciar sesión | Autenticarse y obtener token JWT (`/auth/login`). | Usuario |
| CU-04 | Consultar sesión actual | Recuperar datos y rol del usuario logueado (`/auth/me`). | Usuario |
| CU-05 | Ver panel/dashboard | Consultar estadísticas generales y actividad reciente (`/dashboard/stats`). | Usuario |
| CU-06 | Explorar directorio de políticos | Listar políticos con paginación y filtros (`/politicos`, `/politicos/filtros`). | Usuario |
| CU-07 | Ver perfil de político | Consultar índice de reputación, coherencia y promesas de un político (`/politicos/{id}`). | Usuario |
| CU-08 | Comparar políticos | Comparar métricas y votaciones entre políticos (`/politicos/comparar`). | Usuario |
| CU-09 | Explorar directorio de leyes | Listar leyes/propuestas con filtros y búsqueda (`/leyes`, `/leyes/filtros`). | Usuario |
| CU-10 | Ver perfil de ley | Consultar contenido, expediente y resultado de votación de una ley (`/leyes/{id}/perfil`). | Usuario |
| CU-11 | Explicar ley con IA | Generar una explicación simplificada de una ley (`/leyes/{id}/explicar`). | Usuario, Gemini/IA |
| CU-12 | Consultar agenda legislativa | Ver eventos y cronograma legislativo (`/leyes/agenda`). | Usuario |
| CU-13 | Ver debates ciudadanos | Consultar comentarios/debate sobre leyes (`/leyes/debates`). | Usuario |
| CU-14 | Comentar en ley o político | Publicar comentarios de debate ciudadano (`/leyes/{id}/comentarios`, `/politicos/{id}/comentarios`). | Usuario registrado |
| CU-15 | Calificar ley o político | Registrar una calificación/valoración (`/leyes/{id}/calificaciones`, `/politicos/{id}/calificaciones`). | Usuario registrado |
| CU-16 | Editar/eliminar comentario propio | Modificar o borrar un comentario publicado (`PATCH`/`DELETE /comentarios/{id}`). | Usuario registrado |
| CU-17 | Gestionar suscripciones/alertas | Suscribirse y ver alertas de temas o políticos (`/alertas`, `/alertas/suscripciones`). | Usuario registrado |
| CU-18 | Consultar métricas interactivas | Visualizar métricas agregadas del sistema (`/dashboard/metricas`). | Usuario |
| CU-19 | Exportar datos | Descargar reportes de políticos/leyes (`/dashboard/export`). | Usuario, Administrador |
| CU-20 | Moderar comentarios | Aprobar o rechazar comentarios en cola de validación (`/validacion/comentarios`, `PATCH .../estado`). | Validador, Administrador |
| CU-21 | Importar desde Asamblea Nacional | Importar leyes, votaciones y políticos desde la API externa (`/admin/import-leyes`, `/admin/import-politicos`). | Administrador, API Asamblea |
| CU-22 | Normalizar lenguaje legislativo | Simplificar con IA el contenido de leyes registradas (`/admin/normalizar-leyes`). | Administrador, Gemini/IA |
| CU-23 | Registrar/eliminar entidades | Crear políticos, leyes y promesas o eliminar un político (`/admin/politicos`, `/admin/leyes`, `/admin/promesas`). | Administrador |
| CU-24 | Vincular promesa con ley (motor de coherencia) | Asociar promesas a leyes para calcular coherencia (`/admin/vinculos`, `/admin/motor/data`). | Administrador |
| CU-25 | Mantenimiento del sistema | Ejecutar respaldo, limpiar caché y consultar histórico (`/admin/mantenimiento/respaldo`, `.../limpiar-cache`, `/admin/historico`). | Administrador |

---

## Resumen por actor

| Actor | Casos de uso |
|-------|--------------|
| **Usuario** | CU-01 a CU-19 (consulta pública y participación ciudadana) |
| **Validador** | CU-20 |
| **Administrador** | CU-19, CU-21 a CU-25 |
| **API Asamblea Nacional** | CU-21 |
| **Gemini/IA** | CU-11, CU-22 |
