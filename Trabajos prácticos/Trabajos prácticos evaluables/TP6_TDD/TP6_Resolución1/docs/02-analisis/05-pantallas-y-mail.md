# Pantallas, mail y código de inscripción

## Pantallas y navegación

| ID | Pantalla | Datos y acciones | Pasa a |
|----|----------|------------------|--------|
| PT-01 | **Ingreso** | Email y contraseña; botón "Ingresar" | PT-02 |
| PT-02 | **Actividades** | Cuatro actividades con edad mínima y talle; las agotadas, deshabilitadas | PT-03 |
| PT-03 | **Horario** | Fechas (cerradas deshabilitadas); turnos de la fecha con su estado y sus cupos | PT-04 |
| PT-04 | **Participantes** | Cantidad; un formulario por persona (nombre, DNI, edad, talle si corresponde) | PT-05 |
| PT-05 | **Confirmación** | Resumen, email de la sesión, casilla de términos con enlace; botón "Confirmar" | PT-06 |
| PT-06 | **Resultado** | Éxito: detalle y código. Falla: error y opción de reintentar | PT-02 o PT-05 |
| PT-07 | **Términos** (modal sobre PT-05) | Texto completo de la actividad; acción de cerrar | Al cerrarlo, vuelve a PT-05 |
| PT-08 | **Validación (simulada)** | Mensaje de demostración | — |

**Reglas de navegación**
- Se puede volver a un paso anterior sin perder los datos cargados.
- Sin sesión, todas las pantallas excepto PT-01 y PT-08 llevan a PT-01.
- La actividad y el turno elegidos se muestran en todos los pasos siguientes.

## Mail de confirmación

| Elemento | Contenido |
|----------|-----------|
| Destinatario | El email de la sesión |
| Asunto | Confirmación de inscripción con la actividad, la fecha y la hora (S-37) |
| Detalle | Actividad, fecha, hora y la cantidad de participantes |
| Participantes | Nombre, DNI, edad y talle (si corresponde) de cada persona |
| Código de inscripción | El código único de la inscripción (RF-21) |
| QR | Una imagen, embebida en el cuerpo, que apunta al enlace fijo de la pantalla de validación (RF-22). Hay un solo QR por inscripción |
| Adjunto | La imagen del QR (S-18) |
| Montos | Ninguno: la inscripción no tiene costo (RN-10) |

El mail se arma desde una plantilla con variables que se reemplazan antes de enviarlo: actividad, fecha, hora, cantidad de participantes, listado de participantes, código de inscripción, email y enlace de validación. Los datos de los participantes se muestran sin permitir que un nombre cambie el formato del mail.

## Código de inscripción

Un identificador único por inscripción, en un formato corto que comienza con `ECOPARK-` (RF-21). Se genera al registrar la inscripción y no se repite. El alfabeto y el largo están en S-36. Sirve de referencia para el visitante y para el parque; su uso para validar en el parque está fuera del alcance.
