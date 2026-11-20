# Configuración y despliegue

## Constantes del dominio

Viven en `dominio/constantes.js`. No dependen del entorno.

| Constante | Valor | Origen |
|-----------|-------|--------|
| `DURACION_ACTIVIDAD_MIN` | 60 | RN-02 |
| `PRIMER_TURNO` / `ULTIMO_TURNO` | 09:00 / 17:00 | RN-02 (a las 18:00 no hay turno) |
| `VENTANA_APERTURA_HORAS` | 24 | RN-06 |
| `CIERRE_INSCRIPCION_MIN` | 15 | RN-07 |
| `TALLES` | `XS`, `S`, `M`, `L`, `XL`, `XXL` | RN-04 |
| `FORMATO_DNI` | 7 u 8 dígitos | RN-13 |
| `EDAD_MAXIMA` | 100 | RN-12 |
| `NOMBRE_MAX_CARACTERES` | 100 | D-04 |
| `EMAIL_MAX_CARACTERES` | 254 | D-05 |
| `MAX_PARTICIPANTES_POR_SOLICITUD` | 50 | Tope técnico de la API ([API REST](04-api-rest.md)) |
| `INTENTOS_CODIGO` | 3 | Reintentos si el código de inscripción ya existe |
| `ZONA_HORARIA` | `America/Argentina/Buenos_Aires` | D-09 |

No hay un máximo de personas por inscripción como regla de negocio: el único tope es el cupo del turno (RF-14).

## Variables de entorno

Se definen en `.env` (con `.env.example` versionado, sin secretos) y las lee `configuracion.js`, que **falla al arrancar** con un mensaje claro si un valor está mal formado.

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `DATABASE_URL` | Base local (SQLite) | `file:./dev.db` |
| `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` | Base de la demo | — |
| `APP_URL` | URL pública, para el QR | `http://localhost:5173` |
| `MAIL_PERFIL` | `desarrollo`, `pruebas` o `demo` | `desarrollo` |
| `MAIL_FROM` | Remitente (con el nombre del parque) | — |
| `SMTP_HOST` / `SMTP_PORT` | Sobrescriben el SMTP del perfil | según el perfil |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` | Cuenta de Gmail del perfil `demo` | — |
| `PARQUE_APERTURA` / `PARQUE_CIERRE` | Horario del parque | `08:30` / `19:00` |
| `PARQUE_DIAS_CERRADOS` | Días de la semana cerrados (0 = domingo) | `1` (lunes) |
| `PARQUE_FERIADOS_CERRADOS` | Feriados cerrados, `MM-DD`, cada año | `12-25,01-01` |
| `SEED_DIAS_ADELANTE` | Días de turnos que carga el seed | `7` |
| `RELOJ_FIJO` | Fecha y hora del sistema para la demo; vacía = hora real | vacía |

Los valores por defecto son los que definió el PO (RN-01) y el análisis (S-28, S-30).

## Scripts

| Comando | Acción |
|---------|--------|
| `npm run dev` | Levanta el backend (puerto 3000) y el frontend (puerto 5173) |
| `npm test` | Corre todas las pruebas |
| `npm run test:watch` | Modo TDD |
| `npm run test:coverage` | Reporte de cobertura |
| `npm run lint` | ESLint y Prettier |
| `npm run db:migrate` | Migraciones en la base local |
| `npm run db:seed` | Carga actividades, términos y turnos |
| `npm run db:migrate:turso` | Aplica las migraciones pendientes sobre Turso (demo) |

## Despliegue de la demo

La demo se despliega en **Vercel** (frontend estático y backend Express como función), con **Turso** como base de datos y **Gmail SMTP** para el correo. La decisión, los resultados de la prueba y los pasos están en el [documento de despliegue](../06-despliegue/README.md).

Implicaciones para el código:

- El backend exporta la app de Express y solo llama a `listen` fuera de Vercel. El frontend compilado se sirve desde el CDN, no desde Express.
- `api/index.js`, en la raíz, reexporta la app ya compuesta del backend. `vercel.json` define el build, la salida `frontend/dist` y las reescrituras: `/api/*` a la función y el resto a `index.html`, para que funcionen `/validar-inscripcion` y las demás rutas del SPA.
- `main.js` elige la base (`file:` o `libsql://`), el notificador (`MAIL_PERFIL`) y el reloj (real o `RELOJ_FIJO`) según las variables de entorno.
- Las funciones esperan el envío del mail antes de responder.
- Con la ventana de 24 h, la demo necesita turnos dentro de las próximas 24 horas: se fija `RELOJ_FIJO` (por ejemplo, un martes a las 10:00) y se carga el seed contra Turso (D-08).
