# Casos de prueba del frontend y de punta a punta

Pruebas con Testing Library, buscando los elementos por rol y nombre accesible, y MSW para simular la API. Los mensajes son los del [catálogo](../03-diseno/14-contenido-y-mensajes.md).

## Componentes

| ID | Caso |
|----|------|
| CMP-01 | `Button` deshabilitado no dispara `onClick`; en estado cargando muestra "Enviando..." |
| CMP-02 | `TextField` asocia el label, la ayuda y el error (`aria-describedby`, `aria-invalid`) |
| CMP-03 | `Checkbox` y `Select` son accesibles por rol y nombre |
| CMP-04 | `Alert` de error tiene `role="alert"` |
| CMP-05 | `ActividadCard` sin cupos está deshabilitada con la leyenda "Sin cupos" |
| CMP-06 | `TurnoChip` muestra los cupos y el estado; `agotado` y `no disponible` están deshabilitados y muestran su motivo; no hay un estado de "pocos cupos" |
| CMP-07 | `Stepper` marca el paso actual y los completados |
| CMP-08 | `Encabezado` muestra el email y "Cerrar sesión" con sesión, y solo el logo sin sesión |
| CMP-09 | `SelectorFecha` deshabilita las fechas cerradas y muestra el motivo |
| CMP-10 | `Modal` atrapa el foco, se cierra con `Esc` y con "Cerrar", y devuelve el foco al elemento que lo abrió |
| CMP-11 | `ParticipanteForm` muestra el talle solo si la actividad lo requiere |

## Sesión

| ID | Caso |
|----|------|
| SES-UI-01 | El ingreso exige un email con formato válido de hasta 254 caracteres y una contraseña no vacía |
| SES-UI-02 | Al ingresar, guarda el email en `sessionStorage` y navega a la elección de actividad |
| SES-UI-03 | Sin sesión, las rutas de inscripción redirigen al ingreso |
| SES-UI-04 | Cerrar sesión borra el email y vuelve al ingreso |
| SES-UI-05 | Con los dos campos inválidos, se muestran los dos errores y el foco va al email |

## Pasos de inscripción

| ID | Caso |
|----|------|
| INS-UI-01 | El paso de actividad lista las de la API y muestra la edad mínima |
| INS-UI-02 | Una actividad sin cupos aparece deshabilitada |
| INS-UI-03 | El paso de horario ofrece las fechas de `GET /api/fechas` y deshabilita las cerradas; no calcula "hoy" por su cuenta |
| INS-UI-04 | Solo se pueden elegir los turnos `disponible` |
| INS-UI-05 | La cantidad va de 1 a los cupos disponibles del turno |
| INS-UI-06 | Hay un formulario por persona |
| INS-UI-07 | La confirmación muestra el resumen y el email de la sesión |
| INS-UI-08 | "Confirmar inscripción" está deshabilitado hasta marcar los términos |
| INS-UI-09 | Confirmar envía la solicitud correcta y muestra el éxito con el detalle y el código |
| INS-UI-10 | Un error de la API sin `campo` (`SIN_CUPO`, `HORARIO_NO_DISPONIBLE`, `INSCRIPCION_SUPERPUESTA`) se muestra en un `Alert` y el foco va al mensaje |
| INS-UI-11 | Un error de la API con `campo` (por ejemplo, de un paso anterior) vuelve a ese paso, el error aparece junto al campo y el foco va a él |
| INS-UI-12 | Con `ENVIO_CONFIRMACION_FALLIDO`, muestra el error y permite reintentar sin perder los datos cargados |
| INS-UI-13 | Volver a un paso anterior conserva los datos cargados |
| INS-UI-14 | Mientras se envía, el botón queda deshabilitado con "Enviando...": un doble clic genera una sola solicitud |
| INS-UI-15 | Cambiar la cantidad después de cargar datos conserva los formularios ya cargados |
| INS-UI-16 | Un error de red muestra "Algo salió mal. Intentá de nuevo en unos minutos." |

## Participantes

| ID | Caso |
|----|------|
| PART-UI-01 | El campo talle aparece en Tirolesa y Palestra y es obligatorio |
| PART-UI-02 | El campo talle no aparece en Safari ni Jardinería, y no se envía en la solicitud |
| PART-UI-03 | Un DNI inválido muestra "Ingresá un DNI válido (7 u 8 números, sin puntos)." junto al campo |
| PART-UI-04 | El nombre y la edad son obligatorios |
| PART-UI-05 | Una edad menor a la mínima muestra el mensaje de edad de la actividad |
| PART-UI-06 | Con varios campos inválidos, al intentar avanzar se muestran todos los errores y el foco va al primero |
| PART-UI-07 | Un DNI repetido muestra el error en el segundo DNI |

## Modal de términos y pantalla del QR

| ID | Caso |
|----|------|
| MOD-UI-01 | El enlace "términos y condiciones" abre un modal con el texto completo de la actividad |
| MOD-UI-02 | Abrir el modal no marca la casilla; cerrarlo deja el formulario como estaba |
| MOD-UI-03 | El modal no es una ruta: la URL no cambia al abrirlo |
| VAL-UI-01 | `/validar-inscripcion` muestra el mensaje de demostración y no requiere sesión |

## Punta a punta (Playwright, opcional pero recomendado)

Con `RELOJ_FIJO`, la base sembrada y Mailpit.

| ID | Caso |
|----|------|
| E2E-01 | PA-01: ingreso, Tirolesa, turno disponible, 2 participantes con talle, términos y confirmación; el mail llega a Mailpit con el detalle, el código y el QR |
| E2E-02 | PA-02: un turno sin cupo no se puede elegir; con el último cupo tomado en paralelo, se muestra "No quedan cupos" |
| E2E-03 | PA-03: Safari sin talle se confirma |
| E2E-04 | PA-04: un día cerrado y un turno fuera de la ventana no se pueden elegir |
| E2E-05 | PA-05: sin términos no se puede confirmar |
| E2E-06 | PA-06: Palestra sin talle no avanza |
| E2E-07 | PA-28: el QR del mail apunta a una URL que abre la pantalla simulada |
