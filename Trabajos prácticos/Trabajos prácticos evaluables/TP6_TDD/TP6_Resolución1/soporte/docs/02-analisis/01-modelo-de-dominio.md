# Modelo de dominio, estados y cálculos

## Entidades

| Entidad | Atributos | Descripción |
|---------|-----------|-------------|
| **Actividad** | nombre, cupo por turno, requiere talle (sí/no), edad mínima (vacía si no hay), texto de términos | Una de las cuatro actividades. Se carga con el seed |
| **Turno** | actividad, fecha y hora de inicio, cupo máximo, cupos ocupados | Una instancia de una actividad en un horario. Dura una hora. Se carga con el seed |
| **Inscripción** | código, turno, email del visitante, términos aceptados, fecha y hora de aceptación, fecha y hora de creación | Reserva de un grupo en un turno. Solo existe si la inscripción se confirmó |
| **Participante** | nombre, DNI, edad, talle (vacío si no corresponde) | Cada persona del grupo. Pertenece a una inscripción |
| **Calendario del parque** | días cerrados, feriados cerrados, horario de apertura y cierre | Parámetros fijos del parque (RN-01) |
| **Sesión** | email | El visitante simulado. No se guarda en el sistema: vive solo en el navegador |

## Relaciones

- Una **Actividad** tiene muchos **Turnos**; un Turno pertenece a una Actividad.
- Un **Turno** tiene cero o muchas **Inscripciones**; una Inscripción es de un único Turno (S-02).
- Una **Inscripción** tiene uno o muchos **Participantes** (RF-03, RF-14).
- Los **cupos ocupados** de un Turno son la suma de los participantes de sus inscripciones. Nunca superan el cupo máximo.

## Reglas de integridad

| ID | Regla |
|----|-------|
| INT-01 | Los cupos ocupados de un turno no pueden superar su cupo máximo, ni siquiera con inscripciones simultáneas |
| INT-02 | Una inscripción tiene al menos un participante |
| INT-03 | El código de una inscripción es único |
| INT-04 | Un mismo DNI no aparece en dos inscripciones de turnos con el mismo inicio, ni dos veces en una misma inscripción (RN-08, S-11, S-12 y S-13) |
| INT-05 | Una inscripción no existe a medias: si falla cualquier paso, incluido el envío del mail, no queda inscripción ni cupos ocupados (RF-19) |
| INT-06 | Los participantes de una actividad sin talle no tienen talle, aunque se haya enviado uno |

## Estados y cálculos

### Estado de un turno

El estado se calcula con el momento actual cada vez que se consulta; no se guarda. Se evalúa en este orden:

| Estado | Condición | ¿Se puede elegir? | Qué ve el visitante |
|--------|-----------|-------------------|---------------------|
| Cerrado | La fecha es un día cerrado del parque | No | La fecha deshabilitada (P2) |
| No disponible | El momento actual está fuera de la ventana: faltan más de 24 h, faltan menos de 15 min, o el turno ya empezó | No | El turno deshabilitado, con el motivo |
| Agotado | Los cupos ocupados igualan el cupo máximo | No | El turno deshabilitado, "sin cupos" |
| Disponible | Ninguna de las anteriores | Sí | El turno con sus cupos restantes (RF-09) |

Los extremos de la ventana cuentan como **dentro**: exactamente 24 h antes y exactamente 15 min antes se puede inscribir (S-07). Un turno que no existe en el seed no se muestra.

### Cupos disponibles

`cupos disponibles = cupo máximo − cupos ocupados`. Se muestra en cada turno. Se calcula con los participantes de las inscripciones confirmadas.

### Estado de una actividad

Una actividad se muestra **deshabilitada** si no tiene ningún turno disponible en este momento, indicando que no hay cupos (S-08).

### Ciclo de vida de una inscripción

```
Solicitada ──(todas las validaciones y la reserva de cupos)──▶ Confirmada
     │                                                             ▲
     └──(falla cualquier validación, la reserva o el envío)──▶ No registrada
```

Una inscripción queda **Confirmada** solo cuando el mail se envió (RF-19). En cualquier otro caso no se registra: no hay estados intermedios visibles para el visitante ni inscripciones "pendientes".
