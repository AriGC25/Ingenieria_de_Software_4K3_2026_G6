# Testing: Inscribirme a actividad

Diseño de las pruebas de la historia: datos de referencia, escenarios, **clases de equivalencia** de entrada y salida, **valores límite** y casos de prueba derivados. Parte de los [requerimientos](../01-requerimientos/README.md), el [análisis funcional](../02-analisis/README.md) y el [diseño](../03-diseno/README.md). Los casos de prueba automatizados por capa, y su orden de construcción, están en la [fase de implementación](../04-implementacion/README.md).

## Documentos de esta fase

| Documento | Contenido |
|-----------|-----------|
| [01-datos-de-referencia.md](01-datos-de-referencia.md) | Reloj fijo, fechas y datos que usan todas las pruebas |
| [02-escenarios.md](02-escenarios.md) | Escenarios alternativos y de excepción, con su resultado esperado |
| [03-clases-de-equivalencia.md](03-clases-de-equivalencia.md) | Clases de entrada y de salida, y estados de un turno |
| [04-valores-limite.md](04-valores-limite.md) | Límites de la ventana, el calendario, los cupos, la edad y los textos |
| [05-casos-de-prueba.md](05-casos-de-prueba.md) | Casos derivados (CP), de consulta (CC) y de pantalla (UI), con el orden de validación |
| [06-matriz-de-cobertura.md](06-matriz-de-cobertura.md) | Cada prueba de aceptación (PA-01 a PA-31) contra los casos que la cubren |

## Convenciones de identificadores

| Prefijo | Significado |
|---------|-------------|
| `PA-xx` | Prueba de aceptación ([requerimientos](../01-requerimientos/03-flujos-y-pruebas.md)) |
| `CV-xx` y `CI-xx` | Clase de equivalencia **v**álida o **i**nválida |
| `SA-xx` | Clase de equivalencia de **sa**lida |
| `EA-xx` y `EE-xx` | Escenario **a**lternativo o de **e**xcepción de prueba |
| `CP-xx` | Caso de prueba de la inscripción |
| `CC-xx` | Caso de prueba de las consultas (actividades, fechas y turnos) |
| `UI-xx` | Escenario de pantalla |
| `CU-xx`, `RF-xx`, `RN-xx`, `S-xx` | Los del [análisis funcional](../02-analisis/03-casos-de-uso.md) y de los [requerimientos](../01-requerimientos/README.md) |

## Principios

- **Una sola clase inválida por caso**, para saber qué error produjo el resultado. Los casos con varias (CP-32 a CP-34 y CP-41 a CP-43) prueban a propósito el orden de validación.
- **Todas las pruebas fijan el reloj**: no dependen de la hora real.
- Los límites se prueban en el valor exacto y a cada lado, con la menor unidad que tiene sentido.
- El **backend es la fuente de verdad**: cada regla se prueba en el backend, y la pantalla se prueba aparte (errores a la vez, foco, estados).
