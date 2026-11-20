# Trazabilidad y riesgos

## Pruebas de aceptación contra los casos automatizados

Cada prueba de aceptación tiene al menos un caso automatizado (Definición de Done). Las pruebas de aceptación son las de los [requerimientos](../01-requerimientos/03-flujos-y-pruebas.md); el diseño de los casos está en la [matriz de cobertura](../05-testing/06-matriz-de-cobertura.md).

| Prueba de aceptación | Dominio | Aplicación | API | Frontend | E2E |
|----------------------|---------|------------|-----|----------|-----|
| PA-01 Inscripción exitosa con mail | INS-01 | APP-01 a APP-05 | HTTP-10 | INS-UI-09 | E2E-01 |
| PA-02 Sin cupo | TUR-04, INS-08 | APP-08 | HTTP-20 | INS-UI-10 | E2E-02 |
| PA-03 Sin talle, no lo requiere | ACT-02, ACT-03 | — | HTTP-11, HTTP-12 | PART-UI-02 | E2E-03 |
| PA-04 Parque cerrado o actividad no disponible | CAL-01 a CAL-08, VEN-01 a VEN-06, INS-09 | APP-09 | HTTP-21 | INS-UI-03, INS-UI-04 | E2E-04 |
| PA-05 Sin aceptar los términos | INS-02 | APP-07 | HTTP-22 | INS-UI-08 | E2E-05 |
| PA-06 Sin el talle requerido | ACT-01 | — | HTTP-23 | PART-UI-01 | E2E-06 |
| PA-07 Grupo mayor que los cupos | INS-08 | APP-08 | HTTP-20 | INS-UI-05 | — |
| PA-08 Faltan menos de 15 minutos | VEN-03, VEN-04 | — | HTTP-21 | INS-UI-04 | — |
| PA-09 Empieza en más de 24 horas | VEN-01, VEN-02 | — | HTTP-21 | INS-UI-04 | — |
| PA-10 Menor a la edad mínima | ACT-04 | — | HTTP-24 | PART-UI-05 | — |
| PA-11 Edad mínima exacta | ACT-05 | — | HTTP-14 | — | — |
| PA-12 Persona ya inscripta en esa hora | INS-06 | APP-10 | HTTP-26 | INS-UI-10 | — |
| PA-13 DNI, edad o talle inválidos | PAR-03, PAR-06, PAR-08 | — | HTTP-28 | PART-UI-03, PART-UI-06 | — |
| PA-14 Lunes o feriado | CAL-02 a CAL-04, INS-09 | APP-31 | HTTP-21 | INS-UI-03 | E2E-04 |
| PA-15 El mail contiene el detalle, el código y el QR | — | APP-04 | HTTP-10 | — | E2E-01 |
| PA-16 El mail no se puede enviar | — | APP-06, APP-13 | HTTP-51 | INS-UI-12 | — |
| PA-17 Edad máxima exacta | ACT-07, PAR-07 | — | HTTP-14 | — | — |
| PA-18 Mayor a la edad máxima | ACT-07, PAR-06 | — | HTTP-25 | PART-UI-06 | — |
| PA-19 Reintento tras la falla del envío | — | APP-14 | HTTP-52 | INS-UI-12 | — |
| PA-20 DNI de 6 o 9 dígitos | PAR-03 | — | HTTP-28 | PART-UI-03 | — |
| PA-21 DNI de 7 u 8 dígitos | PAR-02 | — | HTTP-15 | — | — |
| PA-22 Nombre vacío | PAR-04 | — | HTTP-28 | PART-UI-04 | — |
| PA-23 Turno inexistente | — | APP-09 | HTTP-21 | — | — |
| PA-24 11 años en Palestra | ACT-04 | — | HTTP-24 | PART-UI-05 | — |
| PA-25 12 años en Palestra | ACT-05 | — | HTTP-14 | — | — |
| PA-26 Mismo DNI dos veces | INS-05 | — | HTTP-27 | PART-UI-07 | — |
| PA-27 Ver los cupos de cada turno | TUR-01 | APP-41 | HTTP-05 | CMP-06 | — |
| PA-28 QR a la pantalla simulada | — | — | — | VAL-UI-01 | E2E-07 |
| PA-29 Sesión simulada y mail al email del usuario | — | APP-04 | HTTP-10 | SES-UI-02 | E2E-01 |
| PA-30 Dos visitantes por el último cupo | — | APP-08 | HTTP-50 | INS-UI-10 | E2E-02 |
| PA-31 Grupo que ocupa exactamente los cupos | TUR-03 | — | HTTP-13 | — | — |

Los casos de infraestructura (QR-02, REPO-04, SEED-02 y otros) refuerzan PA-23, PA-28, PA-30 y PA-31 y no figuran en la tabla porque verifican piezas, no el comportamiento visible.

## Riesgos del plan

| Riesgo | Mitigación |
|--------|------------|
| La estructura del monorepo no despliega igual que la prueba (proyecto plano) | Desplegar el esqueleto en la fase 0 |
| Zona horaria: Vercel corre en UTC | Casos CAL-07, REPO-07 y TPL-06; todo cálculo horario pasa por la zona argentina |
| Pruebas lentas por la base real | Base SQLite en archivo temporal por archivo de prueba; el dominio y la aplicación no tocan la base |
| `[RED]` bloqueado por el hook de pre-push | Pushear cada `[RED]` junto con su `[GREEN]` |
| Textos de términos y logo pendientes de validar con el PO | Mandarlos en las fases 5 y 6, no al final |
| Gmail desde Vercel puede bloquear el inicio de sesión | Probarlo en la fase 0 y tener el túnel de Cloudflare como plan B ([despliegue](../06-despliegue/README.md)) |
| Una falla del envío tras confirmar la transacción puede dejar un mail entregado de una inscripción deshecha | Riesgo conocido y aceptado ([backend](../03-diseno/03-arquitectura-backend.md)) |
