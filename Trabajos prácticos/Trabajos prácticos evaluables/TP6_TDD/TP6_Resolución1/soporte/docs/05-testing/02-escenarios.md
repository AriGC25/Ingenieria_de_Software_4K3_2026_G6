# Escenarios

Escenarios de prueba derivados de los [flujos de los requerimientos](../01-requerimientos/03-flujos-y-pruebas.md) y los [casos de uso](../02-analisis/03-casos-de-uso.md). Cada uno indica dónde se detecta.

## Flujo principal

| Paso | Visitante | Sistema | Caso de uso |
|------|-----------|---------|-------------|
| 0 | Ingresa email y contraseña | Valida el formato, guarda el email en la sesión y lo muestra en el encabezado | CU-01 |
| 1 | Elige una actividad | Lista las 4 actividades con su edad mínima y deshabilita las que no tienen turnos disponibles | CU-02 |
| 2 | Elige fecha y turno | Ofrece hoy y mañana (los días cerrados, deshabilitados), muestra cada turno con sus cupos y estado, y solo deja elegir los `disponible` | CU-03 |
| 3 | Indica la cantidad de personas y carga nombre, DNI, edad y talle (si corresponde) de cada una | Acepta de 1 al cupo disponible; muestra el talle solo si la actividad lo requiere; valida el paso y muestra todos los errores juntos | CU-04 |
| 4 | Revisa el resumen, abre los términos (opcional) y los acepta | Habilita "Confirmar inscripción" solo con los términos aceptados | CU-04, CU-05 |
| 5 | Confirma | Valida todo, reserva los cupos, registra la inscripción con su código, genera el QR, envía el mail y muestra "¡Inscripción confirmada!" | CU-04, CU-06 |
| 6 | Abre el mail y escanea el QR | El QR abre `/validar-inscripcion`, una pantalla de demostración | CU-07 |

## Escenarios alternativos (terminan con la inscripción hecha)

| ID | Escenario | Equivale a |
|----|-----------|------------|
| EA-01 | La actividad no requiere talle: el paso no muestra el selector y la inscripción se confirma (PA-03) | FA-01 |
| EA-02 | El grupo ocupa exactamente los cupos que quedan: se confirma y el turno queda agotado (PA-31) | FA-02 |
| EA-03 | Falló el envío y el visitante reintenta con el envío funcionando: se confirma, con una sola inscripción (PA-19) | FA-03 |
| EA-04 | El visitante vuelve a un paso anterior: los datos cargados se conservan | S-33 |
| EA-05 | El visitante abre el modal de términos y lo cierra: el formulario sigue igual y la casilla no se marcó | D-07 |
| EA-06 | Se envía un talle para una actividad que no lo requiere (desde la API): se ignora y el participante queda sin talle | INT-06 |
| EA-07 | El visitante cierra sesión: vuelve al ingreso y se borra el email de la sesión | CU-01 |
| EA-08 | Cambia la cantidad de personas después de cargar datos: se conservan los formularios cargados | S-33 |

## Escenarios de excepción (la inscripción no se registra)

| ID | Escenario | Dónde se detecta | Resultado | Equivale a |
|----|-----------|------------------|-----------|------------|
| EE-01 | El turno no tiene cupo para todo el grupo (PA-02, PA-07) | Pantalla (turno agotado) y backend | `SIN_CUPO` | FE-01 |
| EE-02 | Día cerrado o turno inexistente (PA-04, PA-14, PA-23) | Pantalla (no se puede elegir) y backend | `HORARIO_NO_DISPONIBLE` | FE-02 |
| EE-03 | Fuera de la ventana de inscripción: todavía no abre, ya cerró o ya empezó (PA-08, PA-09) | Pantalla y backend | `HORARIO_NO_DISPONIBLE` | FE-03 |
| EE-04 | Términos sin aceptar (PA-05) | Pantalla (botón deshabilitado) y backend | `TERMINOS_NO_ACEPTADOS` | FE-04 |
| EE-05 | Falta el talle en una actividad que lo requiere (PA-06) | Pantalla y backend | `TALLE_REQUERIDO` | FE-05 |
| EE-06 | Nombre, DNI o edad inválidos (PA-13, PA-18, PA-20, PA-22) | Pantalla y backend | `DATOS_PARTICIPANTE_INVALIDOS` | FE-05 |
| EE-07 | Participante menor a la edad mínima (PA-10, PA-24) | Pantalla y backend | `EDAD_NO_PERMITIDA` | FE-06 |
| EE-08 | DNI repetido dentro del grupo (PA-26) | Pantalla y backend | `DNI_REPETIDO` | FE-07 |
| EE-09 | DNI ya inscripto en otro turno a la misma hora (PA-12) | Backend, al confirmar | `INSCRIPCION_SUPERPUESTA` | FE-07 |
| EE-10 | Varios errores de datos a la vez | Pantalla y backend | La pantalla los muestra todos y pone el foco en el primero; el backend informa solo el primero según el orden de validación | D-06 |
| EE-11 | Otra persona toma los últimos cupos mientras el visitante completa el formulario (PA-30) | Backend, al confirmar | `SIN_CUPO`; se vuelve a elegir turno | FE-09 |
| EE-12 | La ventana cierra mientras el visitante completa el formulario (faltan menos de 15 min) | Backend, al confirmar | `HORARIO_NO_DISPONIBLE` | FE-03 |
| EE-13 | Doble clic en "Confirmar" | Pantalla | El botón queda deshabilitado mientras envía: se crea una sola inscripción | — |
| EE-14 | Sin sesión (URL directa, pestaña nueva, sesión cerrada) | Pantalla | Redirección al ingreso; `/validar-inscripcion` no la requiere | — |
| EE-15 | La API no responde o devuelve un error inesperado | Pantalla | "Algo salió mal. Intentá de nuevo en unos minutos." | — |
| EE-16 | Solicitud mal formada (solo posible fuera de la pantalla) | Backend | 400 `SOLICITUD_INVALIDA` | — |
| EE-17 | Actividad inexistente al consultar turnos | Backend | 404 `ACTIVIDAD_INEXISTENTE` | — |
| EE-18 | El mail no se puede enviar (PA-16) | Backend, después de registrar | La inscripción se deshace (se borra y se liberan los cupos); 503 `ENVIO_CONFIRMACION_FALLIDO`; la pantalla permite reintentar | FE-08 |
