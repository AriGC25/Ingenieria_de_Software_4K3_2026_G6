# Reglas de negocio

Datos y reglas del dominio. Cada una aparece solo aquí.

| ID | Regla | Fuente |
|----|-------|--------|
| RN-01 | El parque abre todos los días de 8:30 a 19:00, salvo los lunes y los feriados 25 de diciembre y 1 de enero. | P1, P11 |
| RN-02 | Las actividades duran una hora y tienen un turno por hora, de 9:00 a 18:00; a las 18:00 no hay turno. | P12 |
| RN-03 | El cupo de cada actividad es el máximo de participantes que admite **cada turno**: Safari 8, Palestra 12, Jardinería 12, Tirolesa 10. No hay un cupo por día. | P13 |
| RN-04 | Requieren talle de vestimenta Palestra y Tirolesa; talles XS, S, M, L, XL y XXL. | P9, P14 |
| RN-05 | Edad mínima: Jardinería y Safari, todas las edades; Palestra, 12 años o más; Tirolesa, 8 años o más. | P15 |
| RN-06 | La ventana de 24 h es **móvil**: cada turno se abre a la inscripción exactamente 24 h antes de su inicio, sin importar el día (por ejemplo, un martes no se puede inscribir a una actividad del viernes). | P23 |
| RN-07 | La inscripción cierra 15 minutos antes del inicio del turno. | P30 |
| RN-08 | Una persona no puede inscribirse a actividades distintas en turnos del mismo horario. | P29 |
| RN-09 | No hay un máximo de visitantes por día. | P20 |
| RN-10 | La inscripción no tiene costo. El mail muestra el detalle de la actividad y el código de inscripción, sin montos. | Historia |
| RN-11 | Un turno está **disponible** para inscribirse cuando se cumplen las cuatro condiciones: (1) el parque está abierto ese día y hora; (2) el turno existe entre los turnos de la actividad (de 9:00 a 17:00, uno por hora); (3) el momento actual está dentro de la ventana móvil de inscripción (RN-06 y RN-07); (4) el turno tiene cupo (RN-03). La disponibilidad **depende de la ventana de inscripción**. Si falla (1) o (2), el parque está cerrado o el turno no existe; si falla (3), la actividad **no está disponible**; si falla (4), el turno está **agotado**. | PA-04, I-06 |
| RN-12 | La edad de cada participante se valida contra la edad mínima de la actividad (RN-05) y contra la **edad máxima de 100 años**, que es la misma para todas las actividades. Cumplir ese rango alcanza: no se requiere un acompañante. | P15, I-10 |
| RN-13 | El DNI tiene 7 u 8 dígitos. Se valida la longitud, no que el DNI exista realmente. | P32 |
