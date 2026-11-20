# Casos de prueba

Casos derivados de las [clases de equivalencia](03-clases-de-equivalencia.md) y los [valores límite](04-valores-limite.md). Los datos de partida están en los [datos de referencia](01-datos-de-referencia.md).

Un caso válido cubre la mayor cantidad posible de clases válidas. Cada caso inválido cubre **una sola** clase inválida, salvo los que prueban el orden de validación.

## Orden de validación del backend

El backend corta en el primer error, en este orden ([reglas de validación](../02-analisis/04-reglas-de-validacion.md)):

1. **Forma de la solicitud** (Zod): `SOLICITUD_INVALIDA`. Incluye el tope técnico de 50 participantes.
2. **Turno**: existe, el parque está abierto y está dentro de la ventana: `HORARIO_NO_DISPONIBLE`.
3. **Cantidad**: al menos un participante (`DATOS_PARTICIPANTE_INVALIDOS`) y no más que los cupos disponibles (`SIN_CUPO`).
4. **Participantes**, uno por uno y en orden; dentro de cada uno: nombre → DNI → DNI repetido → edad → edad mínima → talle.
5. **Términos**: `TERMINOS_NO_ACEPTADOS`.
6. **Superposición** con otras inscripciones a la misma hora: `INSCRIPCION_SUPERPUESTA`.
7. **Reserva** de los cupos: `SIN_CUPO` si otra inscripción los tomó mientras tanto.
8. **Envío del mail**: si falla, se deshace la inscripción y se responde `ENVIO_CONFIRMACION_FALLIDO`.

## Casos de la inscripción (CU-04)

| ID | Datos (lo que cambia respecto de la partida) | Clases | Salida esperada |
|----|----------------------------------------------|--------|-----------------|
| CP-01 | 2 participantes: `Ana Pérez`, `40123456`, 25, `M` y `Juan Pérez`, `4212345`, 8, `XXL` | CV-06 a CV-11, CV-13 a CV-17, CV-20 a CV-22 | SA-01 (PA-01, PA-11, PA-21, PA-29) |
| CP-02 | Safari 10:00, 1 participante sin talle, edad 0 | CV-16, CV-18 | SA-01 (PA-03) |
| CP-03 | Safari, participante con talle `M` | CV-19 | SA-01; el participante queda sin talle |
| CP-04 | Turno con 3 libres y 3 participantes | CV-10 (límite) | SA-01; el turno queda agotado (PA-31) |
| CP-05 | El SMTP falla | CI-39 | SA-02; no queda inscripción y el turno vuelve a tener 10 cupos libres (PA-16) |
| CP-06 | Turno del lunes 19/10 | CI-10 | SA-04 (PA-04, PA-14) |
| CP-07 | Turno del 25/12/2026 | CI-11 | SA-04 (PA-04, PA-14) |
| CP-08 | Turnos de las 08:00 y de las 18:00 | CI-12 | SA-04 (PA-23) |
| CP-09 | Turno inexistente | CI-09 | SA-04 |
| CP-10 | Turno del miércoles a las 10:00 (25 h) | CI-13 | SA-04 (PA-09) |
| CP-11 | "Ahora" 09:50, turno de las 10:00 | CI-14 | SA-04 (PA-08) |
| CP-12 | Turno del martes a las 09:00 (ya empezó) | CI-15 | SA-04 |
| CP-13 | Turno con 3 libres y 4 participantes | CI-17 | SA-05 `SIN_CUPO` (PA-02, PA-07) |
| CP-14 | Turno agotado | CI-18 | SA-05 `SIN_CUPO` (PA-02) |
| CP-15 | Sin participantes | CI-16 | SA-03 `DATOS_PARTICIPANTE_INVALIDOS` |
| CP-16 | Términos `false` | CI-35 | SA-03 `TERMINOS_NO_ACEPTADOS` (PA-05) |
| CP-17 | Tirolesa sin talle | CI-33 | SA-03 `TALLE_REQUERIDO` (PA-06) |
| CP-18 | Talle `XXXL` | CI-34 | SA-03 `DATOS_PARTICIPANTE_INVALIDOS` (PA-13) |
| CP-19 | Nombre `"   "` | CI-23 | SA-03 `DATOS_PARTICIPANTE_INVALIDOS` (PA-22) |
| CP-20 | Nombre de 101 caracteres | CI-24 | SA-03 `DATOS_PARTICIPANTE_INVALIDOS` |
| CP-21 | DNI `401234` | CI-26 | SA-03 `DATOS_PARTICIPANTE_INVALIDOS` (PA-13, PA-20) |
| CP-22 | DNI `401234567` | CI-27 | SA-03 `DATOS_PARTICIPANTE_INVALIDOS` (PA-13, PA-20) |
| CP-23 | DNI `40.123.456` | CI-28 | SA-03 `DATOS_PARTICIPANTE_INVALIDOS` |
| CP-24 | Edad −1 | CI-29 | SA-03 `DATOS_PARTICIPANTE_INVALIDOS` (PA-13) |
| CP-25 | Edad 101 | CI-30 | SA-03 `DATOS_PARTICIPANTE_INVALIDOS` (PA-18) |
| CP-26 | Edad 7.5 | CI-31 | SA-03 `DATOS_PARTICIPANTE_INVALIDOS` |
| CP-27 | Edad 7 en Tirolesa | CI-32 | SA-03 `EDAD_NO_PERMITIDA` (PA-10) |
| CP-28 | Dos participantes con el mismo DNI | CI-20 | SA-03 `DNI_REPETIDO` (PA-26) |
| CP-29 | DNI ya inscripto en Safari a las 10:00 | CI-21 | SA-05 `INSCRIPCION_SUPERPUESTA` (PA-12) |
| CP-30 | DNI ya inscripto en este mismo turno | CI-22 | SA-05 `INSCRIPCION_SUPERPUESTA` |
| CP-31 | DNI inscripto en Safari a las 11:00 | CV-12 | SA-01 |
| CP-32 | Participante 1 sin talle, participante 2 con edad 7, términos `false` | CI-33, CI-32, CI-35 | SA-03 `TALLE_REQUERIDO` en `participantes[0].talle` (el primer error del orden) |
| CP-33 | Turno con 3 libres, 4 participantes y un nombre vacío | CI-17, CI-23 | SA-05 `SIN_CUPO` (la cantidad se valida antes que los participantes) |
| CP-34 | Turno del lunes y DNI superpuesto | CI-10, CI-21 | SA-04 (el turno se valida primero) |
| CP-35 | Sin `aceptaTerminos` | CI-36 | SA-06 |
| CP-36 | Email `ana@` | CI-37 | SA-06 |
| CP-37 | `edad: "25"` | CI-38 | SA-06 |
| CP-38 | 51 participantes | CI-19 | SA-06 |
| CP-39 | Dos inscripciones simultáneas por el último cupo | CV-23 | Una SA-01 y otra SA-05 `SIN_CUPO` (PA-30) |
| CP-40 | El generador devuelve primero un código existente | CV-24 | SA-01 con otro código |
| CP-41 | Nombre vacío en el participante 1 y DNI inválido en el mismo participante | CI-23, CI-28 | SA-03 `DATOS_PARTICIPANTE_INVALIDOS` en `participantes[0].nombre` |
| CP-42 | Talle faltante y términos `false` | CI-33, CI-35 | SA-03 `TALLE_REQUERIDO` (los participantes van antes que los términos) |
| CP-43 | Términos `false` y DNI ya inscripto en Safari a las 10:00 | CI-35, CI-21 | SA-03 `TERMINOS_NO_ACEPTADOS` (la superposición se consulta después) |
| CP-44 | Nombre `Ana2` | CI-25 | SA-03 `DATOS_PARTICIPANTE_INVALIDOS` |
| CP-45 | DNI `0123456` | CV-14 | SA-01 |
| CP-46 | Participante de 100 años | CV-15 (límite) | SA-01 (PA-17) |
| CP-47 | Falla el SMTP y luego funciona: se repite la solicitud | CI-39, CV-22 | SA-02 y luego SA-01; queda una sola inscripción (PA-19) |
| CP-48 | Palestra, participante de 11 años | CI-32 | SA-03 `EDAD_NO_PERMITIDA` (PA-24) |
| CP-49 | Palestra, participante de 12 años | CV-16 (límite) | SA-01 (PA-25) |
| CP-50 | Email de 254 y de 255 caracteres | CV-21, CI-37 | SA-01 y SA-06 |

## Casos de consulta (CU-02 y CU-03)

| ID | Caso | Clases | Salida esperada |
|----|------|--------|-----------------|
| CC-01 | Listar las actividades | — | Las 4, con talle, edad mínima, cupo por turno, términos y `disponible` |
| CC-02 | Listar con una actividad sin ningún turno disponible ahora | — | Esa actividad con `disponible: false` |
| CC-03 | Consultar las fechas con el reloj fijo | — | SA-10: martes 20/10 y miércoles 21/10, ambas `abierta` |
| CC-04 | Consultar las fechas un domingo | — | El lunes con `abierta: false` y su motivo |
| CC-05 | Turnos de Tirolesa del martes | CV-03, CV-04 | SA-08: 9 turnos ordenados; el de las 09:00 `no_disponible` (`ya_empezo`); los de 10:00 a 17:00 `disponible` o `agotado` |
| CC-06 | Turnos del miércoles | CV-04 | El de las 09:00 `disponible` (24 h exactas); los demás `no_disponible` (`todavia_no_abre`) |
| CC-07 | Turnos de un lunes | CV-05 | SA-09 |
| CC-08 | Turnos de una actividad inexistente | CI-05 | SA-07 |
| CC-09 | Turnos con una fecha inválida o ausente | CI-06 a CI-08 | SA-06 |
| CC-10 | Turno con 0 cupos libres | — | `agotado` con `cuposDisponibles: 0` |

## Escenarios de pantalla

| ID | Escenario | Clases o límites | Resultado esperado |
|----|-----------|------------------|--------------------|
| UI-01 | Ingreso con email y contraseña válidos | CV-01, CV-02 | Pasa a la elección de actividad |
| UI-02 | Ingreso con email inválido y contraseña vacía | CI-02, CI-04 | Los dos errores visibles; foco en el email |
| UI-03 | Ruta de inscripción sin sesión | EE-14 | Redirige al ingreso |
| UI-04 | Paso de actividad con una sin turnos disponibles | — | Tarjeta deshabilitada con "Sin cupos" |
| UI-05 | Paso de horario: el selector de fecha | Días del calendario | Solo hoy y mañana; los lunes y feriados, deshabilitados |
| UI-06 | Paso de horario con turnos en cada estado | Estados de un turno | Solo los `disponible` se pueden elegir; los demás muestran su motivo |
| UI-07 | Cantidad con 3 cupos libres | Límites 0, 1, 3 y 4 | 1 a 3 aceptados; 0 y 4 rechazados en el campo |
| UI-08 | Participantes en Tirolesa y en Safari | CV-17, CV-18 | El selector de talle solo en Tirolesa |
| UI-09 | DNI, nombre y edad inválidos en dos participantes | CI-23, CI-26, CI-32 | Todos los errores visibles, cada uno junto a su campo; foco en el primero |
| UI-10 | El mismo DNI en dos participantes | CI-20 | Error en el segundo DNI |
| UI-11 | Confirmación sin términos | CI-35 | "Confirmar" deshabilitado |
| UI-12 | Confirmar con éxito | SA-01 | Mensaje con el email, el detalle y el código |
| UI-13 | La API responde `ENVIO_CONFIRMACION_FALLIDO` | SA-02 | `Alert` de error con la opción de reintentar; los datos cargados se conservan |
| UI-14 | La API responde `SIN_CUPO` al confirmar | EE-11 | `Alert` con foco; opción de volver a elegir turno |
| UI-15 | La API responde 422 con `campo` de un paso anterior | SA-03 | Vuelve a ese paso, el error aparece junto al campo y el foco va a ese campo |
| UI-16 | Doble clic en "Confirmar" | EE-13 | Una sola solicitud |
| UI-17 | La API no responde | EE-15 | Mensaje de error inesperado |
| UI-18 | Volver al paso anterior | EA-04 | Datos conservados |
| UI-19 | Abrir y cerrar el modal de términos | EA-05 | El modal muestra el texto de la actividad; cerrarlo conserva el formulario y la casilla no se marca |
| UI-20 | El modal de términos con teclado | D-07 | Atrapa el foco, se cierra con `Esc` y devuelve el foco al enlace |
| UI-21 | Abrir `/validar-inscripcion` sin sesión | EE-14 | Muestra la pantalla de demostración, sin redirigir al ingreso (PA-28) |
| UI-22 | Cambiar la cantidad después de cargar datos | EA-08 | Los formularios cargados se conservan |
