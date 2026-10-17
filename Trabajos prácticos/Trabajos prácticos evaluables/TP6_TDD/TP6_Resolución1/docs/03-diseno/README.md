# Diseño: Inscribirme a actividad

Diseño de la solución, hecho a partir del [análisis funcional](../02-analisis/README.md) y de los [requerimientos](../01-requerimientos/README.md). Define **cómo** se construye el sistema: la arquitectura del backend y del frontend, la API, el modelo de datos y el design system. Los supuestos (S-XX) están en [supuestos.md](../supuestos.md).

## Documentos de esta fase

### Arquitectura

| Documento | Contenido |
|-----------|-----------|
| [01-vision-y-stack.md](01-vision-y-stack.md) | Visión general, principios de diseño y stack tecnológico |
| [02-estructura-del-proyecto.md](02-estructura-del-proyecto.md) | Estructura del monorepo |
| [03-arquitectura-backend.md](03-arquitectura-backend.md) | Capas, dominio, casos de uso, puertos, flujo de inscripción, reloj |
| [04-api-rest.md](04-api-rest.md) | Endpoints, formato de las solicitudes y respuestas, errores |
| [05-modelo-de-datos.md](05-modelo-de-datos.md) | Esquema, concurrencia de cupos, seed y migraciones |
| [06-arquitectura-frontend.md](06-arquitectura-frontend.md) | Rutas, estado, pasos, manejo de errores y foco, modal de términos |
| [07-email-y-qr.md](07-email-y-qr.md) | Mail de confirmación, plantilla, código de inscripción, QR y perfiles de SMTP |
| [08-configuracion-y-despliegue.md](08-configuracion-y-despliegue.md) | Constantes, variables de entorno, scripts y despliegue |
| [09-convenciones-de-desarrollo.md](09-convenciones-de-desarrollo.md) | Convenciones de código y de Git |

### Design system

| Documento | Contenido |
|-----------|-----------|
| [10-design-system-fundamentos.md](10-design-system-fundamentos.md) | Principios, colores, tipografía, espaciado y breakpoints |
| [11-logo.md](11-logo.md) | Logo y reglas de uso |
| [12-componentes.md](12-componentes.md) | Catálogo de componentes y reglas de uso |
| [13-pantallas.md](13-pantallas.md) | Diseño de las pantallas y navegación |
| [14-contenido-y-mensajes.md](14-contenido-y-mensajes.md) | Voz y tono, y textos de la interfaz |
| [15-accesibilidad.md](15-accesibilidad.md) | Checklist de accesibilidad |

El entregable con la justificación de las decisiones de diseño, `docs/decisiones-diseno.md` (pendiente), está fuera de esta carpeta: reúne las decisiones de diseño (DD-01 a DD-09 y las correcciones de arriba). La estrategia TDD pasó a la [fase de implementación](../04-implementacion/01-estrategia-tdd.md).

## Del análisis al diseño

| Decisión o requisito del análisis | Dónde se resuelve en el diseño |
|-----------------------------------|--------------------------------|
| Turnos cargados por seed (D-01, S-28, S-29) | [Seed](05-modelo-de-datos.md) |
| El cupo se reserva al confirmar (D-02) | [Concurrencia de cupos](05-modelo-de-datos.md) y [flujo de inscripción](03-arquitectura-backend.md) |
| Selector de fecha con hoy y mañana (D-03, S-31) | `GET /api/fechas` y `GET /api/actividades/:id/turnos` en la [API](04-api-rest.md); `SelectorFecha` en los [componentes](12-componentes.md) |
| Formatos del nombre y del login (D-04, D-05) | [Constantes](08-configuracion-y-despliegue.md) y [mensajes](14-contenido-y-mensajes.md) |
| Errores a la vez en pantalla y de a uno en el backend (D-06) | [Manejo de errores del frontend](06-arquitectura-frontend.md) y [API](04-api-rest.md) |
| Términos en un modal (D-07) | [Modal de términos](06-arquitectura-frontend.md) y componente `Modal` |
| Reloj configurable y hora argentina (D-08, D-09, S-30) | [Reloj](03-arquitectura-backend.md) y variable `RELOJ_FIJO` |
| Estados de un turno y disponibilidad de una actividad (RN-11, S-08) | [Dominio](03-arquitectura-backend.md) y [API](04-api-rest.md) |
| Orden de validación (análisis) | [Flujo de inscripción](03-arquitectura-backend.md) |
| Inscripción sin estados intermedios, anulación si falla el mail (INT-05, RF-19) | [Flujo](03-arquitectura-backend.md) y [anulación](05-modelo-de-datos.md) |
| Mail real, código `ECOPARK-` y QR con enlace fijo (RF-20, RF-21, RF-22, S-36, S-37) | [Mail y QR](07-email-y-qr.md) |
| Pantallas PT-01 a PT-08 | [Rutas](06-arquitectura-frontend.md) y [pantallas](13-pantallas.md) |
| Catálogo de errores y mensajes (S-34) | [API](04-api-rest.md) y [mensajes](14-contenido-y-mensajes.md) |

## Correcciones respecto de la versión anterior

La arquitectura y el design system anteriores se escribieron antes del análisis funcional y tenían diferencias con él. Se corrigieron así:

| # | Antes | Ahora |
|---|-------|-------|
| 1 | Código de inscripción `ECO-XXXXXX` | `ECOPARK-XXXXXX` (S-36) |
| 2 | Entidad **Horario**, con un campo `habilitado` | Entidad **Turno**, sin campo `habilitado`: no hay deshabilitado manual (RN-11) |
| 3 | Estados de un turno: `disponible`, `agotado`, `fuera_de_ventana` y `deshabilitado` | `disponible`, `agotado` y `no_disponible` con motivo; los días cerrados se informan a nivel de fecha |
| 4 | "Talla" y `TALLA_REQUERIDA` | "Talle" y `TALLE_REQUERIDO` (I-09) |
| 5 | Vista de términos con ruta propia, en una pestaña nueva | Modal dentro de la confirmación (D-07) |
| 6 | El frontend calculaba las fechas o no se definía quién las ofrecía | Endpoint `GET /api/fechas` según el reloj del servidor, para que la demo con fecha fija funcione |
| 7 | Estado "pocos cupos" (3 o menos) en el turno | Sin umbral: se muestran los cupos restantes (S-09) |
| 8 | La inscripción guardaba un booleano `aceptaTerminos` | `terminosAceptadosEn`, la fecha y hora de la aceptación (S-17) |
| 9 | Pasos: actividad y horario juntos, cantidad aparte | Actividad, horario, participantes (cantidad y datos juntos) y confirmación (I-05, PT-04) |
| 10 | Variable `{{urlTerminos}}` en el mail | Se quitó: el mail no lleva el enlace a los términos (análisis, mail) |
| 11 | La respuesta de la inscripción incluía `emailEnviado` | Se quitó: la inscripción solo existe si el mail se envió (RF-19) |
| 12 | Edad máxima como constante de "datos absurdos" | `EDAD_MAXIMA = 100`, una regla de negocio (RN-12) |
| 13 | Mensajes de error sueltos | Catálogo único, alineado con el análisis, con un texto por campo |
| 14 | Referencias a un documento de definiciones que ya no existe | Enlaces al análisis funcional y a los supuestos |
| 15 | La estrategia TDD y el orden de implementación dentro de la arquitectura | La estrategia TDD pasó a la fase de implementación; el orden está en el plan |
| 16 | Stack y nombres (`RepositorioHorarios`, `consultarHorarios`) | `RepositorioTurnos`, `consultarTurnos`, y un caso de uso nuevo, `ConsultarFechas` |

## Decisiones de diseño nuevas

Decisiones tomadas en esta fase que el análisis no definía. Se justifican en el documento indicado.

| ID | Decisión | Justificación | Documento |
|----|----------|---------------|-----------|
| DD-01 | `GET /api/fechas` devuelve hoy y mañana según el reloj del servidor | Cumple S-31 y D-08: con una fecha fija en el servidor, el frontend no puede calcular "hoy" | [API](04-api-rest.md) |
| DD-02 | El turno guarda su propio `cupoMaximo` | Cambiar el cupo de una actividad no altera los turnos ya cargados | [Modelo de datos](05-modelo-de-datos.md) |
| DD-03 | `@@unique([actividadId, inicio])` en el turno | Evita turnos duplicados y hace repetible el seed (S-29) | [Modelo de datos](05-modelo-de-datos.md) |
| DD-04 | El envío del mail se hace después de confirmar la transacción, y se compensa con `anular` | No se bloquean otras inscripciones mientras se habla con el servidor de correo | [Backend](03-arquitectura-backend.md) |
| DD-05 | La forma del request se valida con Zod (hasta 50 participantes) y las reglas de negocio en el dominio | Separa los errores `400` de los `422`; el tope protege la API pública | [API](04-api-rest.md) |
| DD-06 | Reintentos del código de inscripción: hasta 3 | Una colisión es improbable; no se justifica un bucle sin límite | [Backend](03-arquitectura-backend.md) |
| DD-07 | Un único formulario compartido por los pasos | Volver a un paso anterior conserva los datos (S-33) | [Frontend](06-arquitectura-frontend.md) |
| DD-08 | Rutas separadas por paso, y `/validar-inscripcion` pública | Permite recargar un paso y abrir el QR sin sesión | [Frontend](06-arquitectura-frontend.md) |
| DD-09 | Mensajes específicos por campo cuando el código es genérico | El visitante necesita saber qué dato corregir | [Mensajes](14-contenido-y-mensajes.md) |
