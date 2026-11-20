# Clases de equivalencia

`CV` = clase válida, `CI` = clase inválida, `SA` = clase de salida. Cada clase tiene un representante, que es el dato que usan las pruebas. Los límites se detallan en los [valores límite](04-valores-limite.md). Las reglas salen de las [reglas de validación](../02-analisis/04-reglas-de-validacion.md) y de la [API](../03-diseno/04-api-rest.md).

## Entradas

### Ingreso simulado (CU-01)

| Variable | Clase | Descripción | Representante | Resultado |
|----------|-------|-------------|---------------|-----------|
| Email | CV-01 | Formato válido | `ana@mail.com` | Ingresa |
| Email | CI-01 | Vacío | `""` | `EMAIL_INVALIDO` |
| Email | CI-02 | Sin `@` o sin dominio | `ana.mail.com`, `ana@` | `EMAIL_INVALIDO` |
| Email | CI-03 | Más de 254 caracteres | 255 caracteres | `EMAIL_INVALIDO` |
| Contraseña | CV-02 | Al menos 1 carácter (no se verifica) | `x` | Ingresa |
| Contraseña | CI-04 | Vacía | `""` | `CONTRASENA_VACIA` |

### Consulta de turnos (CU-03)

| Variable | Clase | Descripción | Representante | Resultado |
|----------|-------|-------------|---------------|-----------|
| Actividad | CV-03 | Una de las 4 actividades | `tirolesa` | 200 |
| Actividad | CI-05 | Inexistente | `paracaidismo` | 404 `ACTIVIDAD_INEXISTENTE` |
| Fecha | CV-04 | `YYYY-MM-DD` de un día abierto | `2026-10-20` | 200 con 9 turnos |
| Fecha | CV-05 | `YYYY-MM-DD` de un día cerrado | `2026-10-19` | 200 con `abierta: false` y `turnos: []` |
| Fecha | CI-06 | Otro formato | `20/10/2026` | 400 `SOLICITUD_INVALIDA` |
| Fecha | CI-07 | Fecha inexistente | `2026-02-30`, `2026-13-01` | 400 `SOLICITUD_INVALIDA` |
| Fecha | CI-08 | Ausente | sin `?fecha=` | 400 `SOLICITUD_INVALIDA` |

### Inscripción (CU-04): turno y momento

| Variable | Clase | Descripción | Representante | Resultado |
|----------|-------|-------------|---------------|-----------|
| Turno | CV-06 | Existe en el seed | `t-tirolesa-2026-10-20-10` | Sigue la validación |
| Turno | CI-09 | No existe | `t-inexistente` | `HORARIO_NO_DISPONIBLE` |
| Turno | CI-12 | Fuera de la grilla (el seed no lo carga): antes de las 9:00, a las 18:00 o no en punto | 08:00, 18:00, 09:30 | `HORARIO_NO_DISPONIBLE` (el turno no existe) |
| Día del turno | CV-07 | Martes a domingo, no feriado | Martes 20/10/2026 | Abierto |
| Día del turno | CI-10 | Lunes | Lunes 19/10/2026 | `HORARIO_NO_DISPONIBLE` (el seed no lo carga) |
| Día del turno | CI-11 | Feriado cerrado | 25/12/2026, 01/01/2027 | `HORARIO_NO_DISPONIBLE` |
| Hora del turno | CV-08 | En punto, de 09:00 a 17:00 | 10:00 | Válido |
| Momento de inscripción | CV-09 | Dentro de la ventana (entre 24 h y 15 min antes) | 1 h antes | Válido |
| Momento de inscripción | CI-13 | Más de 24 h antes (todavía no abre) | 25 h antes | `HORARIO_NO_DISPONIBLE` |
| Momento de inscripción | CI-14 | Menos de 15 min antes (ya cerró) | 10 min antes | `HORARIO_NO_DISPONIBLE` |
| Momento de inscripción | CI-15 | Turno iniciado o pasado | 1 h después del inicio | `HORARIO_NO_DISPONIBLE` |

### Inscripción: grupo y cupo

| Variable | Clase | Descripción | Representante | Resultado |
|----------|-------|-------------|---------------|-----------|
| Cantidad de personas | CV-10 | De 1 a los cupos disponibles | 2 (con 10 libres) | Válido |
| Cantidad de personas | CI-16 | Cero participantes | `[]` | `DATOS_PARTICIPANTE_INVALIDOS` (campo participantes) |
| Cantidad de personas | CI-17 | Más que los cupos disponibles | 4 (con 3 libres) | `SIN_CUPO` |
| Cantidad de personas | CI-18 | Turno agotado | 1 (con 0 libres) | `SIN_CUPO` |
| Cantidad de personas | CI-19 | Más de 50 (tope técnico de la API) | 51 | 400 `SOLICITUD_INVALIDA` |
| DNI en el grupo | CV-11 | Todos distintos | `40123456`, `41123456` | Válido |
| DNI en el grupo | CI-20 | Repetido dentro del grupo | `40123456` dos veces | `DNI_REPETIDO` (campo dni del segundo) |
| DNI frente a otras inscripciones | CV-12 | Sin inscripciones a la misma hora | Inscripto a las 11:00, se inscribe a las 10:00 | Válido |
| DNI frente a otras inscripciones | CI-21 | Inscripto en otra actividad a la misma hora | Safari 10:00, se inscribe a Tirolesa 10:00 | `INSCRIPCION_SUPERPUESTA` |
| DNI frente a otras inscripciones | CI-22 | Ya inscripto en el mismo turno | Tirolesa 10:00, otra vez Tirolesa 10:00 | `INSCRIPCION_SUPERPUESTA` |

### Inscripción: datos de cada participante

| Variable | Clase | Descripción | Representante | Resultado |
|----------|-------|-------------|---------------|-----------|
| Nombre | CV-13 | De 1 a 100 caracteres sin contar los espacios de los extremos; letras, tildes, ñ, espacios, apóstrofo y guion | `Ana Pérez`, `María José O'Neill-Núñez` | Válido (se guarda sin espacios de los extremos) |
| Nombre | CI-23 | Vacío o solo espacios | `""`, `"   "` | `DATOS_PARTICIPANTE_INVALIDOS` (campo nombre) |
| Nombre | CI-24 | Más de 100 caracteres | 101 caracteres | `DATOS_PARTICIPANTE_INVALIDOS` (campo nombre) |
| Nombre | CI-25 | Con dígitos o símbolos | `Ana2`, `Ana@` | `DATOS_PARTICIPANTE_INVALIDOS` (campo nombre) |
| DNI | CV-14 | 7 u 8 dígitos, incluso con ceros a la izquierda | `4012345`, `40123456`, `0123456` | Válido |
| DNI | CI-26 | Menos de 7 dígitos | `401234` | `DATOS_PARTICIPANTE_INVALIDOS` (campo dni) |
| DNI | CI-27 | Más de 8 dígitos | `401234567` | `DATOS_PARTICIPANTE_INVALIDOS` (campo dni) |
| DNI | CI-28 | Caracteres no numéricos | `40.123.456`, `4012345A`, `40 123 456` | `DATOS_PARTICIPANTE_INVALIDOS` (campo dni) |
| Edad | CV-15 | Entero de 0 a 100 | 25 | Válido |
| Edad | CI-29 | Negativa | −1 | `DATOS_PARTICIPANTE_INVALIDOS` (campo edad) |
| Edad | CI-30 | Mayor a 100 | 101 | `DATOS_PARTICIPANTE_INVALIDOS` (campo edad) |
| Edad | CI-31 | No entera | 7.5 | `DATOS_PARTICIPANTE_INVALIDOS` (campo edad) |
| Edad frente a la actividad | CV-16 | Mayor o igual a la mínima, o actividad sin mínimo | Tirolesa 8; Safari 0 | Válido |
| Edad frente a la actividad | CI-32 | Menor a la mínima | Tirolesa 7; Palestra 11 | `EDAD_NO_PERMITIDA` (campo edad) |
| Talle, actividad que lo requiere | CV-17 | Uno de XS, S, M, L, XL, XXL | `M` | Válido |
| Talle, actividad que lo requiere | CI-33 | Ausente | sin talle | `TALLE_REQUERIDO` (campo talle) |
| Talle, actividad que lo requiere | CI-34 | Fuera de la lista (incluye minúsculas) | `XXXL`, `m` | `DATOS_PARTICIPANTE_INVALIDOS` (campo talle) |
| Talle, actividad que no lo requiere | CV-18 | Ausente | sin talle | Válido |
| Talle, actividad que no lo requiere | CV-19 | Presente, con cualquier valor | `M`, `XXXL` | Válido; se ignora (EA-06) |

### Inscripción: términos, email y forma de la solicitud

| Variable | Clase | Descripción | Representante | Resultado |
|----------|-------|-------------|---------------|-----------|
| Términos | CV-20 | Aceptados | `true` | Válido |
| Términos | CI-35 | No aceptados | `false` | `TERMINOS_NO_ACEPTADOS` (campo aceptaTerminos) |
| Términos | CI-36 | Ausentes o no booleanos | sin campo, `"si"` | 400 `SOLICITUD_INVALIDA` |
| Email | CV-21 | Formato válido | `ana@mail.com` | Válido |
| Email | CI-37 | Inválido o ausente | `ana@`, sin campo | 400 `SOLICITUD_INVALIDA` |
| Forma | CI-38 | JSON roto, tipos incorrectos (`edad: "25"`), `participantes` no es una lista | `{` | 400 `SOLICITUD_INVALIDA` |

### Condiciones del entorno

| Variable | Clase | Descripción | Resultado |
|----------|-------|-------------|-----------|
| Envío del mail | CV-22 | El servidor SMTP acepta el mail | 201 |
| Envío del mail | CI-39 | El envío falla | 503 `ENVIO_CONFIRMACION_FALLIDO`; no queda inscripción (EE-18) |
| Concurrencia | CV-23 | Dos inscripciones por el último cupo a la vez | Una 201 y otra 409 `SIN_CUPO` |
| Código de inscripción | CV-24 | El código generado ya existe | Se reintenta con otro y se responde 201 |

## Salidas

| Caso de uso | Clase | HTTP | Contenido |
|-------------|-------|------|-----------|
| CU-04 | SA-01. Inscripción confirmada | 201 | `codigo` (`ECOPARK-XXXXXX`), actividad, fecha, hora, email y participantes; el mail ya fue enviado |
| CU-04 | SA-02. Envío de la confirmación fallido | 503 | `ENVIO_CONFIRMACION_FALLIDO`; la inscripción no queda registrada y los cupos se liberan |
| CU-04 | SA-03. Error de datos | 422 | Un solo error, con `codigo`, `mensaje` y `campo`: `DATOS_PARTICIPANTE_INVALIDOS`, `TALLE_REQUERIDO`, `EDAD_NO_PERMITIDA`, `DNI_REPETIDO` o `TERMINOS_NO_ACEPTADOS` |
| CU-04 | SA-04. Turno no disponible | 422 | `HORARIO_NO_DISPONIBLE` |
| CU-04 | SA-05. Conflicto con el estado del sistema | 409 | `SIN_CUPO` o `INSCRIPCION_SUPERPUESTA` |
| CU-02, CU-03, CU-04 | SA-06. Solicitud mal formada | 400 | `SOLICITUD_INVALIDA` |
| CU-03 | SA-07. Actividad inexistente | 404 | `ACTIVIDAD_INEXISTENTE` |
| CU-03 | SA-08. Turnos de un día abierto | 200 | 9 turnos ordenados por hora, cada uno con `cuposDisponibles` y `estado` |
| CU-03 | SA-09. Día cerrado | 200 | `abierta: false`, el `motivo` y `turnos: []` |
| CU-03 | SA-10. Fechas elegibles | 200 | Hoy y mañana, cada una con `abierta` |
| Todos | SA-11. Error inesperado | 500 | Mensaje genérico, sin detalles internos |
| CU-06 | SA-12. Mail recibido | — | Destinatario, asunto, actividad, fecha, hora, participantes, código, logo, QR embebido y adjunto |

## Estados de un turno

Salida de `GET /api/actividades/:id/turnos`, lo que muestra el `TurnoChip`. Se evalúan en este orden ([modelo de dominio](../02-analisis/01-modelo-de-dominio.md)):

| Clase | Condición | Pantalla |
|-------|-----------|----------|
| `no_disponible` | Fuera de la ventana: faltan más de 24 h (`todavia_no_abre`), faltan menos de 15 min (`inscripcion_cerrada`) o ya empezó (`ya_empezo`) | No elegible, con el motivo |
| `agotado` | 0 cupos libres | No elegible, "Sin cupos" |
| `disponible` | Ninguna de las anteriores | Elegible, con sus cupos restantes |

No hay un estado de "pocos cupos" con umbral (S-09) ni turnos deshabilitados a mano.
