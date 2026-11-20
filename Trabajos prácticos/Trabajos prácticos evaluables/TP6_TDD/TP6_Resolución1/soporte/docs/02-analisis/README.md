# Análisis funcional: Inscribirme a actividad

Análisis hecho desde el rol de **analista funcional**. Traduce los requerimientos en un comportamiento del sistema completo y sin ambigüedades: modelo de dominio, datos, casos de uso, validaciones, errores, pantallas y mail. No define tecnologías ni arquitectura: eso es de la fase de diseño.

## Alcance

### Dentro del alcance

| Módulo | Qué incluye |
|--------|-------------|
| Sesión simulada | Pantalla de ingreso con email y contraseña, sin autenticación real, para obtener el email del visitante |
| Disponibilidad | Listado de actividades y de los turnos de una fecha, con cupos y estado |
| Inscripción | Datos de los participantes, términos, reserva de cupos y registro de la inscripción |
| Términos y condiciones | Texto de cada actividad y aceptación |
| Confirmación | Envío real del mail con el detalle, el código de inscripción y el QR |
| Validación simulada | Pantalla a la que apunta el QR, sin validación real |

### Fuera del alcance

Compra de entradas, pagos, registro y autenticación reales, cancelar o modificar inscripciones, ver o reenviar la confirmación, validación real del QR en el parque, administración de actividades y horarios (se cargan por seed), listados para el parque (S-05, S-06 y S-20).

## Decisiones del analista

Decisiones tomadas en esta fase para poder completar el análisis.

| ID | Decisión | Justificación |
|----|----------|---------------|
| D-01 | **Todos los datos maestros se cargan con un seed**: actividades, cupos, términos y los turnos de cada fecha. El sistema no genera turnos por regla: un turno existe si el seed lo cargó | Los administradores mantienen horarios y cupos fuera de la aplicación (enunciado); el seed es esa carga |
| D-02 | **El cupo se reserva solo al confirmar.** Elegir un turno o cargar los datos no bloquea nada | Evita cupos bloqueados por visitantes que abandonan; el caso de dos visitantes por el último cupo ya está cubierto (S-25, PA-30) |
| D-03 | **Los turnos se presentan por fecha**: el visitante elige entre las fechas posibles y ve los turnos de esa fecha, cada uno con su estado | Los lunes y feriados se muestran deshabilitados (P2); con una ventana móvil de 24 h los turnos elegibles pueden abarcar dos días calendario |
| D-04 | **Formato del nombre**: de 1 a 100 caracteres, con letras (incluidas tildes y ñ), espacios, apóstrofo y guion; se recortan los espacios de los extremos | Cubre nombres compuestos y extranjeros sin aceptar números ni símbolos, y evita que "   " pase como nombre |
| D-05 | **Login simulado**: el email debe tener formato válido y hasta 254 caracteres; la contraseña no puede estar vacía y no se verifica | 254 es el máximo de una dirección de correo; la sesión es simulada (P19) |
| D-06 | **La pantalla muestra todos los errores de un paso a la vez y pone el foco en el primero; el backend valida de a un error con un orden fijo** ([orden de validación](04-reglas-de-validacion.md)) | Mejor experiencia para el visitante y respuesta determinística para probar |
| D-07 | **Términos**: casilla de aceptación en la confirmación, con un enlace que abre un **modal** con el texto completo de la actividad | Cumple CA-5 y S-16: el visitante lee los términos antes de aceptarlos sin salir de la confirmación ni perder los datos cargados |
| D-08 | **Reloj configurable para la demo**: se puede fijar la fecha y hora del sistema; si no se fija, se usa la hora real | Con la ventana de 24 h, la demo necesita turnos disponibles aunque se haga un lunes o fuera de horario |
| D-09 | **Todas las reglas de tiempo usan la hora oficial de Argentina (UTC−3)** | El parque está en Argentina; evita errores con servidores en otra zona horaria |

## Documentos de esta fase

| Documento | Contenido |
|-----------|-----------|
| [01-modelo-de-dominio.md](01-modelo-de-dominio.md) | Entidades, relaciones, reglas de integridad, estados y cálculos |
| [02-datos-maestros.md](02-datos-maestros.md) | Actividades, turnos y calendario del seed, y datos que se registran |
| [03-casos-de-uso.md](03-casos-de-uso.md) | Casos de uso CU-01 a CU-07 |
| [04-reglas-de-validacion.md](04-reglas-de-validacion.md) | Validación de los campos, orden de validación y catálogo de errores |
| [05-pantallas-y-mail.md](05-pantallas-y-mail.md) | Pantallas, mail de confirmación y código de inscripción |
| [06-trazabilidad.md](06-trazabilidad.md) | Requisitos contra casos de uso y pruebas de aceptación |
| [../supuestos.md](../supuestos.md) | Supuestos y definiciones (S-01 a S-41, de todas las fases) |
