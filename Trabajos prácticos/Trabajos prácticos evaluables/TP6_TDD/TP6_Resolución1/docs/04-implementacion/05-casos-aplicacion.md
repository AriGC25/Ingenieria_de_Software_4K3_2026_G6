# Casos de prueba de la aplicación

Pruebas unitarias de los casos de uso, con dobles: **fakes** en memoria para los repositorios, **spy** para el `Notificador` y **stubs** para el `Reloj`, el `GeneradorQR` y el `GeneradorCodigo` ([estrategia TDD](01-estrategia-tdd.md)). Los casos de uso están en la [arquitectura del backend](../03-diseno/03-arquitectura-backend.md).

## `InscribirseActividad`

| ID | Caso |
|----|------|
| APP-01 | Inscripción exitosa: registra la inscripción con su reserva y devuelve el código, la actividad, la fecha, la hora, el email y los participantes |
| APP-02 | Usa el código del generador (stub) |
| APP-03 | Genera el QR y lo pasa al notificador |
| APP-04 | Notifica al email de la solicitud con la actividad, la fecha, la hora, los participantes y el código (spy) |
| APP-05 | Envía el mail después de registrar la inscripción y solo entonces devuelve el resultado |
| APP-06 | Si el notificador falla, deshace la inscripción (la borra y libera los cupos) y lanza `ENVIO_CONFIRMACION_FALLIDO` |
| APP-07 | Si una regla de dominio falla, no guarda ni notifica (por ejemplo, términos) |
| APP-08 | Si el repositorio informa que no hubo cupo al reservar (carrera), lanza `SIN_CUPO` y no notifica |
| APP-09 | Turno inexistente lanza `HORARIO_NO_DISPONIBLE` |
| APP-10 | Consulta los DNI ya inscriptos en el mismo inicio y rechaza si hay superposición |
| APP-11 | Si el código generado ya existe, reintenta con otro; tras 3 colisiones lanza un error técnico |
| APP-12 | Usa la hora del reloj inyectado para la ventana (no la hora real) |
| APP-13 | Si falla la generación del QR, también deshace la inscripción y no envía nada |
| APP-14 | Tras una falla del envío, una nueva solicitud correcta queda registrada una sola vez |

## `ListarActividades`

| ID | Caso |
|----|------|
| APP-20 | Lista las cuatro actividades con su talle, edad mínima, cupo por turno y términos |
| APP-21 | Indica `disponible: true` si la actividad tiene algún turno disponible en este momento |
| APP-22 | Indica `disponible: false` si todos sus turnos están agotados o fuera de la ventana |

## `ConsultarFechas`

| ID | Caso |
|----|------|
| APP-30 | Devuelve hoy y mañana según el reloj inyectado, en hora argentina |
| APP-31 | Marca `abierta: false` con su motivo (`lunes` o `feriado`) en los días cerrados |
| APP-32 | Con el reloj fijado en un domingo, el lunes siguiente aparece cerrado |

## `ConsultarTurnos`

| ID | Caso |
|----|------|
| APP-40 | Con una actividad inexistente, lanza `ACTIVIDAD_INEXISTENTE` |
| APP-41 | Devuelve los turnos de la fecha con su hora, los cupos disponibles y el estado |
| APP-42 | Un día cerrado devuelve `abierta: false`, el motivo y una lista vacía |
| APP-43 | Los turnos vienen ordenados por hora |
| APP-44 | Los turnos `no_disponible` traen su motivo |
