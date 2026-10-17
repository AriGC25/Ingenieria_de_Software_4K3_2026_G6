# Design system: componentes

Todos viven en `frontend/src/components/` y se prueban con Testing Library, buscando los elementos por rol y nombre accesible. Usan solo los [tokens](10-design-system-fundamentos.md).

## Catálogo

| Componente | Descripción | Variantes y estados |
|------------|-------------|---------------------|
| `Button` | Acción | `primario`, `secundario`, `texto`; estados `hover`, `foco`, `deshabilitado`, `cargando` (spinner y texto "Enviando...") |
| `TextField` | Input con label, ayuda y error | `normal`, `foco`, `error`, `deshabilitado`. Tipos: texto, número, email, contraseña |
| `Select` | Lista desplegable (talle) | Igual que `TextField` |
| `Checkbox` | Aceptación de los términos | `marcado`, `sin marcar`, `error` |
| `SelectorFecha` | Elección de la fecha entre las que ofrece el backend | `disponible`, `cerrada` (deshabilitada, con el motivo: lunes o feriado), `seleccionada` |
| `ActividadCard` | Tarjeta seleccionable de actividad, con su edad mínima si la hay | `seleccionada`, `sin cupos` (deshabilitada, con la leyenda "Sin cupos") |
| `TurnoChip` | Botón de turno con la hora y los cupos restantes | `disponible`, `agotado`, `no disponible` (deshabilitado, con su motivo), `seleccionado` |
| `Stepper` | Indicador de pasos: Actividad, Horario, Participantes y Confirmación | Paso actual, completados, pendientes |
| `Encabezado` | Logo, email de la sesión y botón "Cerrar sesión" | Con sesión, sin sesión (solo el logo) |
| `LoginForm` | Email y contraseña del ingreso simulado | `normal`, `error` |
| `ParticipanteForm` | Grupo de campos de una persona: nombre, DNI, edad y talle | Muestra el talle solo si la actividad lo requiere |
| `Alert` | Mensaje en la página | `exito`, `error`, `advertencia`, `info`; con ícono y `role="alert"` para los errores |
| `ResumenInscripcion` | Resumen antes de confirmar y en el resultado | Actividad, fecha, hora, participantes y email |
| `Modal` | Diálogo sobre la pantalla; se usa para los términos y condiciones | Foco atrapado, cierre con `Esc` y con el botón "Cerrar", devuelve el foco al elemento que lo abrió |

No hay un estado de "pocos cupos" con umbral: el turno disponible muestra sus cupos restantes sin un aviso especial (S-09).

## Reglas de uso

- **Un solo botón primario por pantalla.**
- Los labels van **siempre arriba** del campo, nunca como placeholder.
- Los campos obligatorios llevan `*`, y se explica una vez al inicio del formulario.
- El mensaje de error aparece **debajo del campo**, en `--color-error`, con ícono, y se asocia con `aria-describedby`.
- El botón "Confirmar inscripción" queda deshabilitado hasta aceptar los términos, y mientras se envía la solicitud (con "Enviando...").
- El enlace a los términos abre un **modal**; abrirlo no marca la casilla.
- Antes de avanzar de paso, la pantalla valida todos los campos del paso y muestra **todos los errores a la vez**, cada uno debajo de su campo; el foco va al **primer campo con error**, en el orden del formulario.
- La API informa un error por vez. Si trae `campo`, se muestra debajo de ese campo, volviendo a su paso si hace falta, y el foco va a ese campo.
- Los errores de la API sin `campo` (sin cupo, turno no disponible, persona ya inscripta en ese horario) se muestran en un `Alert`, y el foco se mueve a ese `Alert`.
- Un control deshabilitado siempre dice **por qué** lo está (por ejemplo, "Sin cupos" o "La inscripción cierra 15 minutos antes").
