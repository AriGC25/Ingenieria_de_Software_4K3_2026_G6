# Casos de prueba de la API

Pruebas de integración con Supertest, SQLite real y el notificador en memoria. Contrato en la [API REST](../03-diseno/04-api-rest.md).

## Consultas

| ID | Caso |
|----|------|
| HTTP-01 | `GET /api/actividades` responde las 4 actividades con `disponible` |
| HTTP-02 | Una actividad sin turnos disponibles ahora responde `disponible: false` |
| HTTP-03 | `GET /api/fechas` responde hoy y mañana, según el reloj fijo |
| HTTP-04 | `GET /api/fechas` marca el lunes con `abierta: false` y su motivo |
| HTTP-05 | `GET /api/actividades/:id/turnos?fecha=` responde los turnos con los cupos y el estado, ordenados por hora |
| HTTP-06 | Un día cerrado responde `abierta: false`, el motivo y `turnos: []` |
| HTTP-07 | Una actividad inexistente responde 404 `ACTIVIDAD_INEXISTENTE` |
| HTTP-08 | Una `fecha` con otro formato o ausente responde 400 `SOLICITUD_INVALIDA` |

## Inscripción exitosa

| ID | Caso |
|----|------|
| HTTP-10 | `POST /api/inscripciones` válido responde 201 con el código `ECOPARK-` y el detalle, y el notificador registra el mail al email de la solicitud |
| HTTP-11 | Una inscripción a Safari sin talle responde 201 |
| HTTP-12 | Un talle enviado a Safari responde 201 y el participante se guarda sin talle |
| HTTP-13 | Un grupo que ocupa exactamente los cupos restantes responde 201 y el turno queda agotado |
| HTTP-14 | Una edad igual a la mínima (Tirolesa 8, Palestra 12) y la máxima (100) responde 201 |
| HTTP-15 | Un DNI de 7 u 8 dígitos responde 201 |
| HTTP-16 | 50 participantes pasan la validación de forma (y responden `SIN_CUPO` si no alcanza el cupo) |
| HTTP-17 | Un email de 254 caracteres es aceptado |

## Errores de negocio

| ID | Caso |
|----|------|
| HTTP-20 | Sin cupo responde 409 `SIN_CUPO` |
| HTTP-21 | Turno inexistente, en día cerrado, fuera de la grilla o fuera de la ventana responde 422 `HORARIO_NO_DISPONIBLE` |
| HTTP-22 | Sin términos responde 422 `TERMINOS_NO_ACEPTADOS` |
| HTTP-23 | Tirolesa sin talle responde 422 `TALLE_REQUERIDO` |
| HTTP-24 | Menor a la edad mínima responde 422 `EDAD_NO_PERMITIDA` |
| HTTP-25 | Edad 101 responde 422 `DATOS_PARTICIPANTE_INVALIDOS` |
| HTTP-26 | DNI superpuesto con otra inscripción responde 409 `INSCRIPCION_SUPERPUESTA` |
| HTTP-27 | DNI repetido en la solicitud responde 422 `DNI_REPETIDO` |
| HTTP-28 | Nombre vacío, DNI de 6 o 9 dígitos o talle fuera de la lista responde 422 `DATOS_PARTICIPANTE_INVALIDOS` con el `campo` |
| HTTP-29 | Lista de participantes vacía responde 422 `DATOS_PARTICIPANTE_INVALIDOS` en el campo `participantes` |
| HTTP-30 | `aceptaTerminos` en `false` responde 422 `TERMINOS_NO_ACEPTADOS` |
| HTTP-31 | Una solicitud con varios errores responde solo el primero según el orden de validación, con su `campo` |

## Forma de la solicitud y errores generales

| ID | Caso |
|----|------|
| HTTP-40 | `aceptaTerminos` ausente o no booleano responde 400 `SOLICITUD_INVALIDA` |
| HTTP-41 | Body mal formado responde 400 `SOLICITUD_INVALIDA`: sin `participantes`, tipos incorrectos, email inválido, JSON roto |
| HTTP-42 | 51 participantes responden 400 `SOLICITUD_INVALIDA` (tope técnico) |
| HTTP-43 | Un email de 255 caracteres responde 400 `SOLICITUD_INVALIDA` |
| HTTP-44 | Todos los errores tienen el formato `{ codigo, mensaje }`, con `campo` en los de un dato; un error inesperado responde 500 sin detalles internos |
| HTTP-45 | Una ruta inexistente bajo `/api` responde 404 en formato JSON |

## Concurrencia y envío del mail

| ID | Caso |
|----|------|
| HTTP-50 | Dos inscripciones simultáneas por el último cupo: una 201 y otra 409 `SIN_CUPO` |
| HTTP-51 | Si el envío del mail falla, responde 503 `ENVIO_CONFIRMACION_FALLIDO`; la inscripción no queda en la base y los cupos vuelven a su valor anterior |
| HTTP-52 | Tras la falla del envío, repetir la solicitud con el envío funcionando responde 201 y deja una sola inscripción |
