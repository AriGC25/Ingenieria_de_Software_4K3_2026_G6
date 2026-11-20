# Reglas de validación y errores

## Validación de los datos

Se valida en la pantalla (para mostrar los errores juntos) y en el backend (que es la fuente de verdad).

| Campo | Obligatorio | Regla | Error |
|-------|-------------|-------|-------|
| Email (login) | Sí | Formato válido, hasta 254 caracteres | `EMAIL_INVALIDO` |
| Contraseña (login) | Sí | No vacía; no se verifica | `CONTRASENA_VACIA` |
| Fecha | Sí | Formato de fecha válido | `SOLICITUD_INVALIDA` |
| Turno | Sí | Existe, y está disponible ([estados de un turno](01-modelo-de-dominio.md)) | `HORARIO_NO_DISPONIBLE` |
| Cantidad de personas | Sí | Al menos 1 y no más que los cupos disponibles | `DATOS_PARTICIPANTE_INVALIDOS` (campo participantes) / `SIN_CUPO` |
| Nombre | Sí | De 1 a 100 caracteres sin contar los espacios de los extremos (que se recortan); solo letras, tildes, ñ, espacios, apóstrofo y guion | `DATOS_PARTICIPANTE_INVALIDOS` (campo nombre) |
| DNI | Sí | 7 u 8 dígitos; se valida la longitud, no que exista (RN-13); se guarda como texto, así se conservan los ceros iniciales | `DATOS_PARTICIPANTE_INVALIDOS` (campo dni) |
| DNI repetido | — | No se repite dentro de la inscripción | `DNI_REPETIDO` (campo dni) |
| Edad | Sí | Número entero, de 0 a 100 (RN-12) | `DATOS_PARTICIPANTE_INVALIDOS` (campo edad) |
| Edad mínima | — | Mayor o igual a la edad mínima de la actividad (RN-05) | `EDAD_NO_PERMITIDA` (campo edad) |
| Talle | Solo si la actividad lo requiere | Uno de XS, S, M, L, XL, XXL, en mayúsculas | `TALLE_REQUERIDO` si falta; `DATOS_PARTICIPANTE_INVALIDOS` (campo talle) si no es válido |
| Talle en actividad sin talle | No | Si llega, se ignora y no se guarda | — |
| Términos | Sí | Aceptados | `TERMINOS_NO_ACEPTADOS` |

## Orden de validación de la inscripción

El backend corta en el **primer error** que encuentra. El orden sigue los pasos del formulario:

1. **Forma de la solicitud**: campos presentes y del tipo correcto → `SOLICITUD_INVALIDA`.
2. **Turno**: existe, el parque está abierto, y está dentro de la ventana → `HORARIO_NO_DISPONIBLE`.
3. **Cantidad**: al menos un participante → `DATOS_PARTICIPANTE_INVALIDOS`; no más que los cupos disponibles → `SIN_CUPO`.
4. **Participantes**, uno por uno y en orden; dentro de cada uno: nombre → DNI → DNI repetido → edad → edad mínima → talle.
5. **Términos** → `TERMINOS_NO_ACEPTADOS`.
6. **Superposición**: algún DNI ya inscripto en un turno con el mismo inicio → `INSCRIPCION_SUPERPUESTA`.
7. **Reserva** de los cupos y registro: si otra inscripción los tomó mientras tanto → `SIN_CUPO`.
8. **Envío del mail**: si falla → `ENVIO_CONFIRMACION_FALLIDO` y se deshace la inscripción.

Los errores de un dato indican su **campo** (por ejemplo, el talle del segundo participante), para que la pantalla lo muestre junto al campo.

## Catálogo de errores y mensajes

| Código | Cuándo | Mensaje al visitante | Dónde se muestra |
|--------|--------|----------------------|------------------|
| `EMAIL_INVALIDO` | Email con formato inválido o de más de 254 caracteres | Ingresá un email válido. | Junto al campo |
| `CONTRASENA_VACIA` | Contraseña vacía | Ingresá tu contraseña. | Junto al campo |
| `HORARIO_NO_DISPONIBLE` | Parque cerrado, turno inexistente o fuera de la ventana de inscripción | Este horario no está disponible. Elegí otro. | Aviso en la pantalla |
| `SIN_CUPO` | El turno no tiene cupo para todo el grupo | No quedan cupos suficientes para este horario. | Aviso en la pantalla |
| `DATOS_PARTICIPANTE_INVALIDOS` | Nombre, DNI, edad o talle con formato inválido; sin participantes | Revisá este dato. | Junto al campo |
| `DNI_REPETIDO` | Mismo DNI dos veces en la inscripción | Este DNI ya está en la inscripción. | Junto al campo |
| `EDAD_NO_PERMITIDA` | Edad menor al mínimo de la actividad | Esta actividad es para personas de {edad mínima} años o más. | Junto al campo |
| `TALLE_REQUERIDO` | Falta el talle en una actividad que lo requiere | Ingresá el talle. | Junto al campo |
| `TERMINOS_NO_ACEPTADOS` | Términos sin aceptar | Para continuar, aceptá los términos y condiciones. | Junto a la casilla |
| `INSCRIPCION_SUPERPUESTA` | DNI ya inscripto en otro turno del mismo horario | Una de las personas ya está inscripta en este horario. | Aviso en la pantalla |
| `ENVIO_CONFIRMACION_FALLIDO` | El mail no se pudo enviar | No pudimos enviarte la confirmación y tu inscripción no se registró. Intentá de nuevo. | Aviso en la pantalla, con la opción de reintentar |
| `SOLICITUD_INVALIDA` | Solicitud mal formada (no ocurre desde la pantalla) | Algo salió mal. Intentá de nuevo en unos minutos. | Aviso en la pantalla |
| `ACTIVIDAD_INEXISTENTE` | Se consultan turnos de una actividad que no existe | Algo salió mal. Intentá de nuevo en unos minutos. | Aviso en la pantalla |

Los textos siguen el criterio de S-34.
