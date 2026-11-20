# Design system: voz, tono y mensajes

## Voz y tono

- Español rioplatense, con **voseo** ("Elegí", "Ingresá", "Aceptá"), coherente con el público local (S-34).
- Frases cortas y positivas. Se dice qué hacer, no solo qué está mal.
- Se usa **talle** en toda la interfaz.
- Fecha `día/mes/año` y hora de 24 horas (S-23).

## Mensajes de error

Son los del [catálogo de errores del análisis](../02-analisis/04-reglas-de-validacion.md), con el texto específico de cada campo cuando el código es genérico. El backend envía el `mensaje` y la pantalla lo muestra **tal cual**, así el texto es el mismo en los dos lados.

| Código | Campo | Mensaje | Dónde se muestra |
|--------|-------|---------|------------------|
| `EMAIL_INVALIDO` (solo frontend) | email | Ingresá un email válido. | Junto al campo |
| `CONTRASENA_VACIA` (solo frontend) | contraseña | Ingresá tu contraseña. | Junto al campo |
| `HORARIO_NO_DISPONIBLE` | — | Este horario no está disponible. Elegí otro. | `Alert` |
| `SIN_CUPO` | — | No quedan cupos suficientes para este horario. Probá con otro. | `Alert` |
| `DATOS_PARTICIPANTE_INVALIDOS` | nombre | Ingresá un nombre válido (hasta 100 letras). | Junto al campo |
| `DATOS_PARTICIPANTE_INVALIDOS` | dni | Ingresá un DNI válido (7 u 8 números, sin puntos). | Junto al campo |
| `DATOS_PARTICIPANTE_INVALIDOS` | edad | Ingresá una edad entre 0 y 100. | Junto al campo |
| `DATOS_PARTICIPANTE_INVALIDOS` | talle | Elegí un talle de la lista. | Junto al campo |
| `DATOS_PARTICIPANTE_INVALIDOS` | participantes | Agregá al menos una persona. | Junto a la cantidad |
| `DNI_REPETIDO` | dni | Este DNI ya está en la inscripción. | Junto al campo |
| `EDAD_NO_PERMITIDA` | edad | Esta actividad es para personas de {edadMinima} años o más. | Junto al campo |
| `TALLE_REQUERIDO` | talle | Ingresá el talle. | Junto al campo |
| `TERMINOS_NO_ACEPTADOS` | aceptaTerminos | Para continuar, aceptá los términos y condiciones. | Junto a la casilla |
| `INSCRIPCION_SUPERPUESTA` | — | Una de las personas ya está inscripta en este horario. Elegí otro. | `Alert` |
| `ENVIO_CONFIRMACION_FALLIDO` | — | No pudimos enviarte la confirmación y tu inscripción no se registró. Intentá de nuevo. | `Alert`, con la opción de reintentar |
| `SOLICITUD_INVALIDA`, `ACTIVIDAD_INEXISTENTE` y errores inesperados | — | Algo salió mal. Intentá de nuevo en unos minutos. | `Alert` |

## Otros textos de la interfaz

| Situación | Texto |
|-----------|-------|
| Actividad sin cupos | "Sin cupos" |
| Turno agotado | "Sin cupos" |
| Turno que todavía no abre | "Todavía no abre. La inscripción se habilita 24 horas antes." |
| Turno con la inscripción cerrada | "La inscripción cerró. Cierra 15 minutos antes del turno." |
| Turno que ya empezó | "Ya empezó" |
| Día cerrado | "El parque está cerrado ese día" |
| Botón de confirmación en curso | "Enviando..." |
| Éxito | "¡Inscripción confirmada! Te enviamos el detalle y el código QR a {email}." |
| Pantalla de validación simulada | "Pantalla de validación de inscripciones: demostración" |
