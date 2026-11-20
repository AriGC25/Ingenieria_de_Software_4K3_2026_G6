# Configuración de la demo

Las variables, las constantes y los perfiles están en el [diseño](../03-diseno/08-configuracion-y-despliegue.md). Acá figuran las que cambian en la demo.

## Variables de entorno en Vercel (entorno Production)

| Variable | Contenido |
|----------|-----------|
| `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN` | Conexión a Turso |
| `MAIL_PERFIL` | `demo` |
| `GMAIL_USER`, `GMAIL_APP_PASSWORD` y `MAIL_FROM` | Cuenta de Gmail, su contraseña de aplicación y el remitente con el nombre del parque |
| `APP_URL` | URL pública del despliegue; el QR apunta a `{APP_URL}/validar-inscripcion` |
| `RELOJ_FIJO` | Fecha y hora del sistema para la demo (por ejemplo, un martes a las 10:00). Vacía, usa la hora real |

## Reloj fijo

Con la ventana de inscripción de 24 h, la demo necesita turnos dentro de las próximas 24 horas. Si se hiciera un lunes, un feriado o fuera de horario, no habría turnos disponibles. `RELOJ_FIJO` (D-08) fija la fecha y la hora del sistema y evita depender del día real.

Con el reloj fijo:

- `GET /api/fechas` ofrece la fecha fijada y la siguiente, y no las del día real.
- El seed debe haber cargado turnos para esas fechas: se corre con una fecha de inicio que las incluya (S-28).

## Datos de la demo

- Se **vacía** la base de Turso de la prueba (las tablas de la prueba no coinciden con las del sistema real), se aplican las migraciones y se corre el seed contra Turso.
- El seed carga las 4 actividades, sus términos y los turnos de los próximos 7 días, salteando los lunes y los feriados.
- El destinatario del mail es el email que se ingresa en el ingreso simulado: conviene usar uno al que se pueda acceder durante la demo.
