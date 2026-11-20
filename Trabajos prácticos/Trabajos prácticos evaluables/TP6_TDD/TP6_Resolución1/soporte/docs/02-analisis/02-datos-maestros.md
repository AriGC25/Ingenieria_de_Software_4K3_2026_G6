# Datos maestros y datos registrados

## Actividades

| Actividad | Cupo por turno | Requiere talle | Edad mínima |
|-----------|----------------|----------------|-------------|
| Tirolesa | 10 | Sí | 8 |
| Safari | 8 | No | Sin mínimo |
| Palestra | 12 | Sí | 12 |
| Jardinería | 12 | No | Sin mínimo |

Valores de RN-03, RN-04 y RN-05. Cada actividad carga también su texto de términos (RNF-04, S-38).

## Turnos

El seed carga, para cada actividad y cada **fecha en que el parque está abierto**, los turnos de 9:00 a 17:00, uno por hora (RN-01 y RN-02). No carga turnos para los lunes ni para el 25 de diciembre y el 1 de enero. Cada turno nace con 0 cupos ocupados y el cupo máximo de su actividad.

- El seed se puede ejecutar de nuevo sin duplicar datos.
- El horizonte de fechas a cargar y cómo se actualiza están en S-28 y S-29.

## Calendario del parque

| Parámetro | Valor |
|-----------|-------|
| Horario | 8:30 a 19:00 |
| Días cerrados | Lunes |
| Feriados cerrados | 25 de diciembre y 1 de enero (cada año) |

El calendario define qué fechas se muestran deshabilitadas (P2) y qué fechas no reciben turnos en el seed. Los dos tienen que coincidir.

## Datos que se registran

| Dato | Cuándo | Para qué |
|------|--------|----------|
| Inscripción (código, turno, email, fecha y hora de creación) | Al confirmar | Reservar el lugar y planificar la actividad |
| Participantes (nombre, DNI, edad, talle) | Al confirmar | Identificar al grupo y evitar la superposición |
| Aceptación de los términos (fecha y hora) | Al confirmar | Dejar constancia de CA-5 (S-17) |
| Cupos ocupados del turno | Al confirmar | Controlar el cupo (INT-01) |

No se guarda la contraseña del login (no se verifica) ni intentos fallidos. La retención y el acceso a los datos personales están en S-41.
