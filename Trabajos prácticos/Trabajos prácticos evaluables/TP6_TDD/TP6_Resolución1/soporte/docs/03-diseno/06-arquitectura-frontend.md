# Arquitectura del frontend

SPA de React con pasos de inscripción. Implementa las [pantallas del análisis](../02-analisis/05-pantallas-y-mail.md) con el [design system](10-design-system-fundamentos.md).

## Responsabilidades

| Responsabilidad | Detalle |
|-----------------|---------|
| Presentación | Ingreso simulado, los pasos de inscripción (actividad, horario, participantes, confirmación), el resultado y la pantalla del QR |
| Validación de UX | Valida cada paso antes de avanzar y muestra **todos** sus errores a la vez, con el foco en el primero. **No reemplaza** la validación del backend |
| Sesión | Ingreso simulado: email y contraseña, sin verificar nada. El email queda en `sessionStorage` mientras la pestaña esté abierta (S-35) |
| Comunicación | Solo a través de `src/api/`. Los componentes nunca llaman a `fetch` directamente |
| Reglas de negocio | **Ninguna.** El frontend no decide si hay cupo, si el turno es válido, qué fechas se ofrecen ni si se envía el mail: muestra lo que responde el backend |

## Rutas

| Ruta | Pantalla | Requiere sesión |
|------|----------|-----------------|
| `/ingreso` | PT-01 Ingreso | No |
| `/inscripcion/actividad` | PT-02 Actividades | Sí |
| `/inscripcion/horario` | PT-03 Horario | Sí |
| `/inscripcion/participantes` | PT-04 Participantes | Sí |
| `/inscripcion/confirmacion` | PT-05 Confirmación (con el modal de términos, PT-07) | Sí |
| `/inscripcion/resultado` | PT-06 Resultado | Sí |
| `/validar-inscripcion` | PT-08 Validación simulada (a donde apunta el QR) | **No** |

- Sin sesión, las rutas protegidas redirigen a `/ingreso`. `/validar-inscripcion` es pública: la abre quien escanea el QR.
- Un paso al que se llega sin haber completado los anteriores (por ejemplo, abrir `/inscripcion/horario` sin actividad) redirige al primer paso pendiente.
- El modal de términos (PT-07) **no es una ruta**: es un componente dentro de la confirmación (D-07).

## Estado

| Estado | Dónde vive | Detalle |
|--------|------------|---------|
| Sesión (email) | `sessionStorage` + un contexto | Se borra al cerrar sesión o la pestaña |
| Datos de la inscripción en curso | Un único formulario (React Hook Form) compartido por los pasos, en un contexto | Actividad, turno, participantes y términos. Volver a un paso anterior **conserva** los datos (S-33) |
| Datos del servidor (actividades, fechas, turnos) | Estado local de cada pantalla | Se piden al cargar la pantalla; no hay un store global ni caché compartida |

No hay un store global: no hace falta para un solo flujo.

## Pasos de inscripción

| Paso | Pantalla | Qué pide al backend | Qué valida antes de avanzar |
|------|----------|---------------------|-----------------------------|
| 1 | Actividad | `GET /api/actividades` | Que haya una actividad elegida (solo se pueden elegir las `disponible`) |
| 2 | Horario | `GET /api/fechas`; `GET /api/actividades/:id/turnos` al elegir fecha | Que haya un turno elegido (solo los `disponible`) |
| 3 | Participantes | — | Cantidad de 1 a los cupos disponibles; nombre, DNI, edad y talle de cada persona (según el catálogo de [mensajes](14-contenido-y-mensajes.md)) |
| 4 | Confirmación | — | Términos aceptados |
| — | Envío | `POST /api/inscripciones` | — |
| 5 | Resultado | — | — |

## Manejo de errores y foco

| Situación | Comportamiento |
|-----------|----------------|
| Varios campos inválidos en un paso | Se muestran todos los errores, cada uno debajo de su campo, y el foco va al **primer campo con error** (`setFocus` de React Hook Form), en el orden del formulario |
| Error de la API **con** `campo` (un dato inválido, edad no permitida, talle requerido, DNI repetido, términos) | Se vuelve al paso que tiene ese campo, el error aparece junto al campo y el foco va a él |
| Error de la API **sin** `campo` (`SIN_CUPO`, `HORARIO_NO_DISPONIBLE`, `INSCRIPCION_SUPERPUESTA`) | Se muestra en un `Alert` y el foco va al `Alert`. En `SIN_CUPO` y `HORARIO_NO_DISPONIBLE` se ofrece volver a elegir el turno |
| `ENVIO_CONFIRMACION_FALLIDO` | Se muestra en el resultado, con la opción de **reintentar**: vuelve a la confirmación con todos los datos cargados (S-39) |
| Error de red o respuesta inesperada | "Algo salió mal. Intentá de nuevo en unos minutos." |
| Doble clic en "Confirmar" | El botón queda deshabilitado con "Enviando..." mientras la solicitud está en curso: se crea una sola inscripción |

## Términos y condiciones (modal)

- La confirmación muestra la casilla "Acepto los términos y condiciones de {actividad}" con un enlace que abre un **modal** con el texto completo (viene en `GET /api/actividades`).
- Abrir el modal **no** marca la casilla. Cerrarlo vuelve a la confirmación con todo como estaba.
- El botón "Confirmar inscripción" está deshabilitado hasta marcar la casilla; el backend rechaza igual con `TERMINOS_NO_ACEPTADOS`.
- El modal atrapa el foco, se cierra con `Esc` y devuelve el foco al enlace que lo abrió.

## Cliente HTTP (`src/api/`)

| Función | Llama a |
|---------|---------|
| `listarActividades()` | `GET /api/actividades` |
| `listarFechas()` | `GET /api/fechas` |
| `listarTurnos(actividadId, fecha)` | `GET /api/actividades/:id/turnos?fecha=` |
| `crearInscripcion(solicitud)` | `POST /api/inscripciones` |

Todas devuelven los datos o lanzan un error con `codigo`, `mensaje` y `campo`, tal como los envía el backend. Los esquemas de validación del frontend son **propios** (no se comparten con el backend): solo sirven para la experiencia de uso.
