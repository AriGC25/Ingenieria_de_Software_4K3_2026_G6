# Análisis de requerimientos: Inscribirme a actividad

Análisis hecho desde el rol de **Product Owner** sobre la historia "Inscribirme a actividad".

## Necesidad y objetivo

**Necesidad del visitante.** Reservar su lugar en una actividad del parque antes de ir, sabiendo que hay cupo, y recibir una confirmación que pueda mostrar en el parque.

**Necesidad del parque**: las actividades tienen **cupos limitados** y el parque quiere **planificarlas con anticipación** según los inscriptos que tenga. Por eso le interesa gestionar las inscripciones en la aplicación.

**Objetivo de la historia.** Que un visitante se inscriba a una de las cuatro actividades (Tirolesa, Safari, Palestra y Jardinería), en un turno con cupo, con los datos de todas las personas que participan, aceptando los términos de esa actividad, y reciba un mail de confirmación con un código QR.

**Valor.** Evita sobrecupos y colas, ordena la operación del día y da al parque información previa sobre cuántas personas, con qué edades y con qué talle de equipo llegan a cada turno.

## Actores

| Actor | Rol en esta historia |
|-------|----------------------|
| Visitante | Se inscribe él y a las personas que lo acompañan. Es quien recibe el mail. La sesión es simulada. |
| Participante | Cada persona que realiza la actividad. Puede ser el visitante u otra persona. Se identifica por nombre, DNI, edad y talle. |
| Administradores del parque | Mantienen actividades, horarios y cupos **fuera de la aplicación**. No operan en esta historia. |
| Personal del parque | Recibe al visitante en la actividad; usa el QR y la información de la confirmación. |

## Documentos de esta fase

Los documentos que describen el dominio (consigna, enunciado, historia de usuario y respuestas del PO) están en [00-dominio](../00-dominio/README.md).

| Documento | Contenido |
|-----------|-----------|
| [01-requisitos-funcionales.md](01-requisitos-funcionales.md) | Requisitos funcionales, decisiones del equipo y requisitos no funcionales |
| [02-reglas-de-negocio.md](02-reglas-de-negocio.md) | Reglas de negocio del dominio |
| [03-flujos-y-pruebas.md](03-flujos-y-pruebas.md) | Flujo del visitante, trazabilidad, pruebas y criterios de aceptación propuestos |
| [04-ambiguedades.md](04-ambiguedades.md) | Inconsistencias y ambigüedades resueltas, y desvíos respecto del FAQ |
| [../supuestos.md](../supuestos.md) | Supuestos y definiciones (S-01 a S-41, de todas las fases) |
