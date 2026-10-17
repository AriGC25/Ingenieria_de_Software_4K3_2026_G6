# Design system: pantallas

Diseño de las [pantallas del análisis](../02-analisis/05-pantallas-y-mail.md) (PT-01 a PT-08) con los [componentes](12-componentes.md). El flujo es actividad, horario y participantes (I-05).

## Flujo

| Pantalla | Paso | Contenido principal |
|----------|------|---------------------|
| **PT-01 Ingreso** | — | `LoginForm`: email y contraseña. No se verifica nada; el email es el destinatario de la confirmación. Con errores, se muestran los dos a la vez, con el foco en el primero |
| **PT-02 Actividades** | 1 de 4 | Grilla de `ActividadCard`. Las que no tienen ningún turno disponible aparecen deshabilitadas, con "Sin cupos". Cada tarjeta muestra la edad mínima si la hay |
| **PT-03 Horario** | 2 de 4 | `SelectorFecha` (hoy y mañana; los días cerrados, deshabilitados) y los `TurnoChip` de la fecha, con su estado y los cupos restantes. Solo se eligen los `disponible` |
| **PT-04 Participantes** | 3 de 4 | Cantidad (de 1 a los cupos disponibles del turno) y un `ParticipanteForm` por persona: nombre, DNI, edad y talle si corresponde. Cambiar la cantidad conserva los formularios ya cargados |
| **PT-05 Confirmación** | 4 de 4 | `ResumenInscripcion`, el email de la sesión, la casilla de términos con el enlace que abre el modal (PT-07) y el botón "Confirmar inscripción" |
| **PT-06 Resultado** | — | Éxito: `Alert` con el detalle y el código de inscripción. Falla: `Alert` de error con el motivo y la opción de volver a elegir el turno o de reintentar |
| **PT-07 Términos** | (modal sobre PT-05) | Texto completo de los términos de la actividad y el botón "Cerrar" |
| **PT-08 Validación (simulada)** | — | Mensaje de demostración. No requiere sesión ni valida nada |

## Reglas de navegación

- Se puede volver a un paso anterior sin perder los datos cargados.
- Sin sesión, todas las pantallas salvo PT-01 y PT-08 llevan a PT-01.
- La actividad y el turno elegidos se muestran en todos los pasos siguientes.
- El `Stepper` muestra el avance en los pasos 1 a 4 y no aparece en el ingreso ni en el resultado.

## Diseño por pantalla

- **Móvil (360 px):** una columna, botones a ancho completo, el botón primario al final de la pantalla.
- **Tablet (600 px):** las tarjetas de actividad en dos columnas.
- **Escritorio (1024 px):** contenido centrado y, en la confirmación, el resumen lateral fijo.
- **Estado vacío del horario:** si ninguno de los turnos de la fecha está disponible, se muestra el motivo de cada uno (por ejemplo, "Todavía no abre" o "La inscripción cerró") en lugar de una lista vacía.
