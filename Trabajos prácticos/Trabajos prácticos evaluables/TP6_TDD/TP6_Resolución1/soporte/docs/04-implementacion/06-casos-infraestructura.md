# Casos de prueba de la infraestructura

Pruebas de los adaptadores de los puertos. Los repositorios usan una base SQLite temporal por archivo de prueba; el correo se prueba sin red.

## Configuración, reloj y código

| ID | Caso |
|----|------|
| CFG-01 | Sin variables de entorno, usa los valores por defecto del PO |
| CFG-02 | Lee el horario del parque, los días cerrados y los feriados del entorno |
| CFG-03 | Los valores mal formados (por ejemplo, `PARQUE_APERTURA=25:00`) fallan al arrancar con un mensaje claro |
| CFG-04 | Un `MAIL_PERFIL` desconocido falla al arrancar; `demo` sin las credenciales de Gmail también |
| REL-01 | El reloj fijo devuelve siempre la fecha de `RELOJ_FIJO` |
| REL-02 | Sin `RELOJ_FIJO`, se usa el reloj del sistema |
| COD-01 | El código tiene el formato `ECOPARK-` más 6 caracteres |
| COD-02 | Solo usa el alfabeto sin ambiguos (sin `0`, `O`, `1`, `I`), en mayúsculas |
| COD-03 | Muchas generaciones producen códigos distintos (prueba estadística simple) |

## QR

| ID | Caso |
|----|------|
| QR-01 | `QrFijo` genera un PNG válido |
| QR-02 | El QR, decodificado con `jsqr`, contiene `{APP_URL}/validar-inscripcion` |
| QR-03 | Genera la imagen una sola vez y la reutiliza |

## Plantilla y notificadores

| ID | Caso |
|----|------|
| TPL-01 | Reemplaza todas las variables de la plantilla |
| TPL-02 | Escapa el HTML de los valores (`<script>` en un nombre aparece como texto) |
| TPL-03 | Falla si queda una variable sin valor |
| TPL-04 | Las filas de participantes muestran el talle solo si corresponde |
| TPL-05 | La plantilla real referencia `cid:logo` y `cid:qr` |
| TPL-06 | El asunto lleva la actividad, la fecha (`dd/mm/aaaa`) y la hora (`HH:mm`) en hora argentina |
| TPL-07 | El mail no incluye montos ni un enlace a los términos |
| MAIL-01 | El notificador en memoria guarda los mails enviados |
| MAIL-02 | El notificador SMTP arma el mensaje con el destinatario, el asunto, el HTML, el logo y el QR embebidos y el QR adjunto (transporte de prueba de Nodemailer, sin red) |
| MAIL-03 | El notificador SMTP propaga el error si el transporte falla |

## Migraciones

| ID | Caso |
|----|------|
| MIG-01 | `aplicarMigraciones` aplica las migraciones pendientes en orden |
| MIG-02 | Ejecutarla dos veces no vuelve a aplicar nada |

## Repositorios

| ID | Caso |
|----|------|
| REPO-01 | Obtiene un turno con su actividad; devuelve `null` si no existe |
| REPO-02 | `registrarConReserva` guarda la inscripción y sus participantes y descuenta los cupos |
| REPO-03 | Sin cupo suficiente en la base, no guarda nada y lo informa |
| REPO-04 | 20 reservas concurrentes sobre 8 cupos: 8 exitosas y cupo final 8 |
| REPO-05 | Un código duplicado se informa como colisión, para el reintento |
| REPO-06 | Devuelve los DNI inscriptos en turnos con el mismo inicio, de cualquier actividad |
| REPO-07 | Lista los turnos de una actividad para una fecha argentina (incluye el de las 17:00 aunque en UTC sean las 20:00) |
| REPO-08 | `anular` borra la inscripción con sus participantes y devuelve los cupos al turno, en una transacción |
| REPO-09 | Lista las actividades con sus turnos disponibles entre dos instantes |

## Seed

| ID | Caso |
|----|------|
| SEED-01 | Carga las 4 actividades con cupo, talle, edad mínima y términos |
| SEED-02 | Crea los turnos de 09:00 a 17:00 de los próximos 7 días, salteando lunes y feriados |
| SEED-03 | No crea turnos a las 08:00, a las 18:00 ni a horas que no sean en punto |
| SEED-04 | Volver a correrlo no duplica datos ni modifica las inscripciones registradas |
| SEED-05 | Cada turno nace con 0 cupos ocupados y el cupo máximo de su actividad |
