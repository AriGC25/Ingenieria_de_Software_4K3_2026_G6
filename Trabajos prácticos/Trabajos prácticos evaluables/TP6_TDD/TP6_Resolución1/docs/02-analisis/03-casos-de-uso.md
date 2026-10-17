# Casos de uso

## CU-01. Iniciar sesión (simulado)

| | |
|---|---|
| **Actor** | Visitante |
| **Objetivo** | Obtener el email para la inscripción |
| **Precondición** | Ninguna |
| **Requisitos** | RF-17 (sesión simulada) |

**Flujo principal**
1. El visitante ingresa su email y una contraseña.
2. El sistema valida el formato del email y que la contraseña no esté vacía (D-05).
3. El sistema guarda el email como sesión y muestra la lista de actividades (CU-02).

**Alternativos y excepciones**
- 2a. El email o la contraseña no cumplen: se muestran los dos errores a la vez, con el foco en el primero.
- Si una pantalla de inscripción se abre sin sesión, el sistema lleva al visitante al ingreso.
- El visitante puede cerrar la sesión: se borra el email y vuelve al ingreso.

**Postcondición.** Hay un email de sesión disponible. No se verificó ninguna contraseña.

## CU-02. Consultar actividades

| | |
|---|---|
| **Actor** | Visitante con sesión |
| **Precondición** | Sesión iniciada |
| **Requisitos** | RF-01, RF-09, S-08 |

**Flujo principal**
1. El sistema muestra las cuatro actividades con su edad mínima (si tienen) y si requieren talle.
2. Las actividades sin ningún turno disponible aparecen deshabilitadas, con "sin cupos".
3. El visitante elige una actividad habilitada.

**Postcondición.** Hay una actividad elegida.

## CU-03. Consultar turnos de una actividad

| | |
|---|---|
| **Actor** | Visitante con sesión |
| **Precondición** | Actividad elegida |
| **Requisitos** | RF-02, RF-09, RF-10, RF-11, RN-11, D-03 |

**Flujo principal**
1. El sistema muestra las fechas que se pueden elegir: las fechas con turnos que hoy pueden estar dentro de la ventana. Los días cerrados se muestran deshabilitados (P2).
2. El visitante elige una fecha.
3. El sistema muestra los turnos de esa fecha, cada uno con su hora, su estado y, si está disponible, sus cupos restantes ([estados de un turno](01-modelo-de-dominio.md)).
4. El visitante elige un turno **disponible**.

**Alternativos**
- 3a. Si ningún turno de la fecha está disponible, se muestra el motivo de cada uno.

**Postcondición.** Hay un turno elegido. No se reservó ningún cupo (D-02).

## CU-04. Inscribirse a una actividad

| | |
|---|---|
| **Actor** | Visitante con sesión |
| **Precondición** | Actividad y turno elegidos |
| **Requisitos** | RF-03 a RF-08, RF-10 a RF-16, RF-18, RF-19, RN-03, RN-05, RN-08, RN-11 a RN-13 |

**Flujo principal**
1. **Cantidad.** El visitante indica la cantidad de personas, de 1 a los cupos disponibles del turno (S-32).
2. **Participantes.** El sistema muestra un formulario por persona: nombre, DNI, edad y, solo si la actividad requiere talle, el talle. El visitante los completa.
3. El sistema valida los datos del paso y muestra todos los errores a la vez, con el foco en el primero (D-06).
4. **Confirmación.** El sistema muestra el resumen (actividad, fecha, hora y participantes), el email de la sesión y la casilla de aceptación de los términos, con un enlace a su texto (CU-05).
5. El visitante acepta los términos y confirma.
6. El sistema valida la solicitud completa en el [orden de validación](04-reglas-de-validacion.md).
7. El sistema reserva los cupos y registra la inscripción con su código de inscripción, en una sola operación.
8. El sistema envía el mail de confirmación (CU-06).
9. El sistema muestra que la inscripción quedó confirmada, con el detalle y el código.

**Alternativos**
- 1a. El visitante vuelve a un paso anterior: se conservan los datos cargados.
- 2a. La actividad no requiere talle: no se pide el talle (FA-01).
- 5a. El visitante no marca los términos: el botón "Confirmar" está deshabilitado (PA-05).
- 7a. El grupo ocupa exactamente los cupos restantes: se confirma y el turno queda agotado (FA-02).

**Excepciones** (la inscripción no se registra; ver el [catálogo de errores](04-reglas-de-validacion.md))
- 6a. Falla una validación: se informa el primer error del [orden de validación](04-reglas-de-validacion.md). Si el error es de un dato, el visitante vuelve al paso correspondiente con el error junto al campo y el foco en él.
- 7b. Otro visitante tomó los cupos mientras tanto: `SIN_CUPO` (FE-09).
- 8a. El mail no se puede enviar: se deshace la inscripción, se liberan los cupos y se informa el error; el visitante puede reintentar sin volver a cargar los datos (FE-08, FA-03, S-39).
- 5b. El visitante hace doble clic en "Confirmar": el botón queda deshabilitado mientras se procesa; se crea una sola inscripción.

**Postcondiciones.** Éxito: hay una inscripción confirmada con su código, los cupos del turno descontados y un mail enviado. Falla: nada cambió.

## CU-05. Ver los términos de una actividad

| | |
|---|---|
| **Actor** | Visitante con sesión |
| **Precondición** | Actividad elegida |
| **Requisitos** | RF-06, RF-16, S-14, S-16 |

**Flujo principal**
1. El visitante abre el enlace "términos y condiciones" desde la confirmación.
2. El sistema muestra un **modal** con el texto completo de los términos de esa actividad.
3. El visitante lo lee y lo cierra. Vuelve a la confirmación, con los datos cargados y la casilla como estaba.

**Alternativos.** Abrir el modal no marca la casilla: aceptar los términos es una acción aparte del visitante.

## CU-06. Enviar la confirmación (el sistema)

| | |
|---|---|
| **Actor** | Sistema |
| **Disparador** | Paso 8 de CU-04 |
| **Requisitos** | RF-07, RF-19, RF-20, RF-21, RF-22 |

**Flujo principal**
1. El sistema arma el mail con el [contenido del mail](05-pantallas-y-mail.md).
2. Lo envía por correo real al email de la sesión.
3. Si el envío termina bien, informa a CU-04.

**Excepción.** Si el envío falla, informa la falla a CU-04, que deshace la inscripción (INT-05).

## CU-07. Ver la pantalla de validación (simulada)

| | |
|---|---|
| **Actor** | Cualquier persona que escanea el QR |
| **Precondición** | Ninguna: no requiere sesión |
| **Requisitos** | RF-22, PA-28 |

**Flujo principal.** El visitante escanea el QR del mail, que es un enlace fijo, y el sistema muestra una pantalla de demostración. No valida ninguna inscripción (texto en S-40).
