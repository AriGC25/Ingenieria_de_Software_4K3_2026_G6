# Flujos y pruebas de aceptación

## Flujo del visitante (visión del PO)

### Flujo principal

El flujo completo tiene tres tramos: **actividad**, **horario** y **participantes**.

1. El visitante entra a la sección de actividades (con la sesión simulada).
2. **Actividad:** elige la que quiere hacer entre las cuatro.
3. **Horario:** elige un turno disponible de esa actividad (ver RN-11).
4. **Participantes:** indica cuántas personas participan y carga los datos de cada una.
5. Lee y acepta los términos y condiciones de la actividad.
6. Confirma. Ve que la inscripción quedó hecha y recibe el mail con el detalle, el código y el QR.
7. El día de la actividad, se presenta en el parque con el QR.

### Flujos alternativos

Terminan con la inscripción hecha. El detalle se trabaja en la fase de análisis.

| ID | Escenario | Resultado |
|----|-----------|-----------|
| FA-01 | La actividad no requiere talle (Safari o Jardinería) | No se pide el talle y la inscripción se confirma (PA-03) |
| FA-02 | El grupo ocupa exactamente los cupos que quedan | Se confirma y el turno queda agotado (PA-31) |
| FA-03 | Falló el envío del mail y el visitante reintenta | Con el envío funcionando, se confirma (PA-19) |

### Flujos de excepción

La inscripción no se hace. La pantalla muestra el motivo.

| ID | Escenario | Resultado |
|----|-----------|-----------|
| FE-01 | El turno no tiene cupo para todo el grupo | No se inscribe a nadie (PA-02, PA-07) |
| FE-02 | El parque está cerrado ese día, o el turno no existe | No se puede elegir el turno (PA-04, PA-14, PA-23) |
| FE-03 | El turno está fuera de la ventana de inscripción | La actividad no está disponible (PA-08, PA-09) |
| FE-04 | No se aceptan los términos | No se puede confirmar (PA-05) |
| FE-05 | Hay datos inválidos: nombre vacío, DNI, edad o talle | Se muestra el error del dato (PA-06, PA-13, PA-18, PA-20, PA-22) |
| FE-06 | Un participante no cumple la edad mínima de la actividad | No se inscribe (PA-10, PA-24) |
| FE-07 | Una persona ya está inscripta en ese horario, o se repite el DNI | No se inscribe (PA-12, PA-26) |
| FE-08 | Falla el envío del mail | La inscripción no se registra; se muestra el error y se puede reintentar (PA-16) |
| FE-09 | Otro visitante toma los últimos cupos mientras se inscribe | Se informa que no hay cupo (PA-30) |

## Trazabilidad con los criterios y las pruebas

| Criterio de aceptación | Requisitos | Prueba de aceptación | Observación |
|------------------------|------------|----------------------|-------------|
| CA-1 Elegir actividad con cupo | RF-01, RF-08, RF-09 | PA-01, PA-02, PA-27 | Cubierto |
| CA-2 Elegir horario disponible | RF-02, RF-10, RF-11 | PA-01, PA-04, PA-08, PA-09, PA-14, PA-23 | La ventana de 24 h y el cierre de 15 min se cubren con las pruebas propuestas |
| CA-3 Indicar la cantidad de personas | RF-03, RF-14 | PA-01, PA-07, PA-30, PA-31 | Cubierto con las pruebas propuestas |
| CA-4 Datos de cada persona | RF-04, RF-05, RF-12, RF-13, RF-15, RF-18 | PA-01, PA-03, PA-06, PA-10 a PA-13, PA-17, PA-18, PA-20 a PA-22, PA-24 a PA-26 | Cubierto con las pruebas propuestas |
| CA-5 Aceptar los términos | RF-06, RF-16 | PA-05 | Cubierto |
| CA-6 Mail con QR | RF-07, RF-17, RF-19, RF-20, RF-21, RF-22 | PA-01, PA-15, PA-16, PA-19, PA-28, PA-29 | Cubierto con las pruebas propuestas |

### Pruebas de aceptación propuestas

Para cubrir los requisitos que hoy no tienen prueba. Quedan **propuestas**: se incorporan a la historia cuando el equipo y el PO las aprueben.

| ID | Prueba | Resultado |
|----|--------|-----------|
| PA-07 | Inscribirse a una actividad con un grupo de más personas que los cupos disponibles del turno. | Falla |
| PA-08 | Inscribirse a un turno cuando faltan menos de 15 minutos para su inicio (actividad no disponible, RN-11). | Falla |
| PA-09 | Inscribirse a un turno que empieza en más de 24 horas (actividad no disponible, RN-11). | Falla |
| PA-10 | Inscribir a una persona menor a la edad mínima de la actividad (por ejemplo, 7 años en Tirolesa). | Falla |
| PA-11 | Inscribir a una persona con la edad mínima exacta de la actividad (por ejemplo, 8 años en Tirolesa). | Pasa |
| PA-12 | Inscribir a una persona que ya está inscripta en otra actividad a la misma hora. | Falla |
| PA-13 | Inscribirse ingresando un DNI, una edad o un talle inválidos. | Falla |
| PA-14 | Inscribirse a un turno en día lunes o en un feriado en que el parque está cerrado. | Falla |
| PA-15 | Inscribirse con éxito y verificar que el mail contiene el detalle (actividad, fecha, hora y participantes), el código de inscripción y un QR. | Pasa |
| PA-16 | Inscribirse cuando el mail de confirmación no se puede enviar: la inscripción no se registra y la pantalla muestra el error. | Falla |
| PA-17 | Inscribir a una persona con la edad máxima exacta (100 años). | Pasa |
| PA-18 | Inscribir a una persona mayor a la edad máxima (101 años). | Falla |
| PA-19 | Reintentar la inscripción después de una falla del envío, cuando el envío funciona. | Pasa |
| PA-20 | Inscribirse con un DNI de 6 o de 9 dígitos. | Falla |
| PA-21 | Inscribirse con un DNI de 7 o de 8 dígitos. | Pasa |
| PA-22 | Inscribirse con el nombre vacío en un participante. | Falla |
| PA-23 | Inscribirse a un turno que no existe: a las 18:00 o antes de las 9:00. | Falla |
| PA-24 | Inscribir a una persona de 11 años en Palestra. | Falla |
| PA-25 | Inscribir a una persona de 12 años en Palestra. | Pasa |
| PA-26 | Inscribir a dos participantes con el mismo DNI en la misma inscripción. | Falla |
| PA-27 | Ver los cupos disponibles de cada turno al elegir el horario. | Pasa |
| PA-28 | Escanear el QR del mail y llegar a la pantalla simulada de la aplicación. | Pasa |
| PA-29 | Inscribirse con la sesión simulada y verificar que el mail llega al email del usuario simulado. | Pasa |
| PA-30 | Dos visitantes intentan reservar el último cupo de un turno a la vez. | Uno pasa y el otro falla |
| PA-31 | Inscribir un grupo que ocupa exactamente los cupos que quedan en el turno. | Pasa |

### Criterios de aceptación propuestos

Para que la historia diga explícitamente lo que el PO ya respondió:

- La inscripción solo se acepta si el turno tiene cupo para **todas** las personas del grupo.
- Solo se puede inscribir a turnos dentro de una ventana móvil: desde 24 horas antes del inicio hasta 15 minutos antes.
- Los lunes y los feriados cerrados no se pueden elegir.
- Cada participante debe tener al menos la edad mínima de la actividad y no más de 100 años; no se requiere un acompañante.
- Una misma persona no puede estar inscripta en dos turnos del mismo horario.
- La confirmación debe incluir el detalle de la inscripción (actividad, fecha, hora y participantes), el código de inscripción y el código QR, uno por inscripción.
- Si el envío del mail falla, la inscripción no se registra; la pantalla muestra el error y permite reintentar.
- El DNI debe tener 7 u 8 dígitos.
