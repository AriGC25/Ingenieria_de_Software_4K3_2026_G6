# Matriz de cobertura

Cada prueba de aceptación, oficial (PA-01 a PA-06) o [propuesta](../01-requerimientos/03-flujos-y-pruebas.md) (PA-07 a PA-31), contra los casos de este análisis. Los casos automatizados por capa están en el [catálogo de la fase de implementación](../04-implementacion/09-trazabilidad-y-riesgos.md).

| PA | Prueba | Casos de prueba | Pantalla |
|----|--------|-----------------|----------|
| PA-01 | Inscripción exitosa con el mail | CP-01 | UI-12 |
| PA-02 | Sin cupo | CP-13, CP-14 | UI-14 |
| PA-03 | Sin talle porque la actividad no lo requiere | CP-02, CP-03 | UI-08 |
| PA-04 | Parque cerrado o actividad no disponible | CP-06 a CP-12 | UI-05, UI-06 |
| PA-05 | Sin aceptar los términos | CP-16 | UI-11 |
| PA-06 | Sin el talle que la actividad requiere | CP-17 | UI-08 |
| PA-07 | Grupo mayor que los cupos disponibles | CP-13, CP-33 | UI-07 |
| PA-08 | Faltan menos de 15 minutos | CP-11 y los límites de la ventana | UI-06 |
| PA-09 | Empieza en más de 24 horas | CP-10 y los límites de la ventana | UI-06 |
| PA-10 | Menor a la edad mínima | CP-27 | UI-09 |
| PA-11 | Edad mínima exacta | CP-01, límites de edad | — |
| PA-12 | Persona ya inscripta en esa hora | CP-29, CP-30 | — |
| PA-13 | DNI, edad o talle inválidos | CP-18, CP-21 a CP-26 | UI-09 |
| PA-14 | Lunes o feriado | CP-06, CP-07 | UI-05 |
| PA-15 | El mail contiene el detalle, el código y el QR | CP-01 (mail recibido, SA-12) | — |
| PA-16 | El mail no se puede enviar | CP-05 | UI-13 |
| PA-17 | Edad máxima exacta (100) | CP-46 | — |
| PA-18 | Mayor a la edad máxima (101) | CP-25 | UI-09 |
| PA-19 | Reintento después de una falla del envío | CP-47 | UI-13 |
| PA-20 | DNI de 6 o 9 dígitos | CP-21, CP-22 | UI-09 |
| PA-21 | DNI de 7 u 8 dígitos | CP-01, CP-45 | — |
| PA-22 | Nombre vacío | CP-19 | UI-09 |
| PA-23 | Turno inexistente (18:00 o antes de las 9:00) | CP-08, CP-09 | — |
| PA-24 | 11 años en Palestra | CP-48 | UI-09 |
| PA-25 | 12 años en Palestra | CP-49 | — |
| PA-26 | Mismo DNI dos veces | CP-28 | UI-10 |
| PA-27 | Ver los cupos de cada turno | CC-05, CC-10 | UI-06 |
| PA-28 | Escanear el QR y llegar a la pantalla simulada | Prueba del QR de la fase de implementación | UI-21 |
| PA-29 | Sesión simulada y mail al email del usuario | CP-01 (destinatario) | UI-01 |
| PA-30 | Dos visitantes por el último cupo | CP-39 | UI-14 |
| PA-31 | Grupo que ocupa exactamente los cupos restantes | CP-04 | — |

Todas las pruebas de aceptación tienen al menos un caso. Las que figuran con "—" en la columna de pantalla son reglas del backend que la pantalla no puede mostrar de otro modo que como un error genérico.
