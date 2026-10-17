# Datos de referencia para las pruebas

Todas las pruebas usan un reloj fijo y fechas conocidas, en hora argentina (ART, UTC−3, sin horario de verano), como define la [arquitectura del backend](../03-diseno/03-arquitectura-backend.md).

| Dato | Valor |
|------|-------|
| Momento de referencia ("ahora") | Martes 20/10/2026 09:00:00 ART |
| Días útiles | Lunes 19/10/2026 (cerrado), martes 20/10, miércoles 21/10, domingo 25/10/2026 |
| Feriados | Viernes 25/12/2026, viernes 01/01/2027; lunes 25/12/2028 (feriado que cae en lunes) |
| Días vecinos a feriados | Jueves 24/12/2026, sábado 26/12/2026, jueves 31/12/2026, sábado 02/01/2027 |
| Actividades | Tirolesa (cupo 10, talle, edad ≥ 8), Safari (cupo 8, sin talle, todas las edades), Palestra (cupo 12, talle, edad ≥ 12), Jardinería (cupo 12, sin talle, todas las edades) |
| Turnos del seed | De 09:00 a 17:00, uno por hora, en los días abiertos (`t-tirolesa-2026-10-20-10` es el turno de Tirolesa del 20/10 a las 10:00) |
| Visitante | `ana@mail.com` |

Con "ahora" = martes 09:00, los turnos dentro de la ventana de inscripción (`inicio − 24 h ≤ ahora ≤ inicio − 15 min`) son los del martes de 10:00 a 17:00 y el del miércoles a las 09:00 (exactamente 24 h). El del martes a las 09:00 ya empezó y el del miércoles a las 10:00 todavía no abre.

Las fechas que ofrece `GET /api/fechas` con este reloj son el martes 20/10 y el miércoles 21/10.

## Datos de partida de los casos de la inscripción

Salvo que el caso diga otra cosa: turno de Tirolesa del martes a las 10:00 con 10 cupos libres, email `ana@mail.com`, términos aceptados y un participante válido.
