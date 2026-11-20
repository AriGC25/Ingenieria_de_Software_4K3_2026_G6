# Email de confirmación, QR y código de inscripción

Implementa el [mail del análisis](../02-analisis/05-pantallas-y-mail.md). El envío es **real** (RF-20) y es parte de la inscripción: si falla, la inscripción no se registra (RF-19).

## Contenido

| Elemento | Contenido |
|----------|-----------|
| Destinatario | El email de la sesión simulada, que llega en el cuerpo de la solicitud |
| Asunto | `Confirmación de inscripción: {actividad}, {fecha} {hora}` (S-37) |
| Remitente | Con el nombre del parque |
| Detalle | Actividad, fecha (`dd/mm/aaaa`), hora (`HH:mm`) y cantidad de participantes |
| Participantes | Nombre, DNI, edad y talle (si corresponde) |
| Código de inscripción | `ECOPARK-XXXXXX` |
| QR | Una imagen en el cuerpo, que apunta al enlace fijo de la pantalla de validación. Uno por inscripción |
| Adjunto | La imagen del QR como `qr-inscripcion.png` (S-18) |
| Montos | Ninguno: la inscripción no tiene costo (RN-10) |

## Plantilla

Se arma desde `infraestructura/email/templates/confirmacion-inscripcion.html`, con variables que se reemplazan antes de enviar:

| Variable | Contenido |
|----------|-----------|
| `{{actividad}}` | Nombre de la actividad |
| `{{fecha}}` y `{{hora}}` | Fecha y hora del turno, en hora argentina |
| `{{cantidadParticipantes}}` | Cantidad de personas |
| `{{participantes}}` | Listado ya armado como filas HTML |
| `{{codigoInscripcion}}` | Código de inscripción |
| `{{emailUsuario}}` | Email del destinatario |
| `{{urlValidacion}}` | Enlace al que apunta el QR |

Reglas del renderizador:

- Los valores de texto se **escapan** antes de insertarse, para que un nombre con HTML no rompa el mail.
- El reemplazo **falla** si queda alguna variable sin resolver o sin valor.
- El logo y el QR van **embebidos** (`cid:logo`, `cid:qr`) para que se vean en cualquier cliente de correo, y el QR se adjunta además como archivo.

### Diseño visual

- Ancho máximo 600 px, maquetado con tablas y estilos en línea (compatibilidad con clientes de correo).
- Encabezado con el logo (`cid:logo`, versión PNG) sobre `--color-primario`.
- Cuerpo: el detalle, la lista de participantes y el código de inscripción en texto destacado.
- El **QR** centrado (200 × 200 px) con el texto "Presentá este código al llegar a la actividad".
- Pie con datos de contacto del parque.

## Código de inscripción

`ECOPARK-` seguido de 6 caracteres alfanuméricos en mayúsculas, sin los que se confunden (`0`, `O`, `1`, `I`) (S-36). Más de mil millones de combinaciones.

- Lo genera el puerto `GeneradorCodigo` (inyectado, para fijarlo en las pruebas).
- Es único (`@unique` en la base). Si ya existe, `registrarConReserva` informa la colisión y el caso de uso **reintenta con otro código**, hasta 3 veces.
- Sirve de referencia al visitante y al parque. Su uso para validar en el parque está fuera del alcance.

## QR

- Apunta a un **enlace fijo**, igual para todas las inscripciones: `{APP_URL}/validar-inscripcion` (RF-22), una pantalla simulada que no valida nada (S-40).
- `QrFijo` genera el PNG con la librería `qrcode` a partir de `APP_URL` y lo reutiliza. No se versiona una imagen: la URL cambia según el entorno.
- `APP_URL` debe ser accesible desde el celular que escanea el QR (la URL pública de la demo). `localhost` solo sirve en la misma máquina.
- Si más adelante se valida el QR, se reemplaza el generador sin tocar el caso de uso.

## Perfiles de SMTP

El notificador se elige con `MAIL_PERFIL` en `main.js`; el caso de uso no cambia.

| Perfil | Uso | Transporte |
|--------|-----|------------|
| `desarrollo` | Trabajo diario | Mailpit local (`localhost:1025`, bandeja en `localhost:8025`) |
| `pruebas` | Pruebas automatizadas | Notificador en memoria que guarda los mails (sin red) |
| `demo` | Presentación y entrega | Gmail SMTP (`smtp.gmail.com`) con contraseña de aplicación |

Las credenciales van solo en `.env`, que no se versiona. En Vercel, la función **espera** (`await`) el envío antes de responder; si no, termina antes de enviar.
