# Despliegue realizado

Resultado del despliegue del sistema real (17/10/2026), siguiendo el [procedimiento](03-procedimiento.md).

## Datos del despliegue

| Componente | Valor |
|------------|-------|
| URL pública | <https://ecoharmony-park-eight.vercel.app> (el nombre `ecoharmony-park` estaba tomado y Vercel agregó el sufijo) |
| Proyecto de Vercel | `ecoharmony-park`, en el equipo `tdd-isw-utn-frc-2026`, sin conexión a GitHub |
| Base de datos | Turso `ecoharmony` (`aws-us-east-1`), nueva. La base de la prueba, `eco-poc`, quedó sin tocar |
| Datos | Migración `inicial` aplicada con `npm run db:migrate:turso`; seed con `SEED_DIAS_ADELANTE=14` (turnos del 17/10 al 30/10/2026, sin los lunes) |
| Correo | Gmail SMTP (`MAIL_PERFIL=demo`), remitente "EcoHarmony Park" |
| Reloj | Hora real (sin `RELOJ_FIJO`) |

Variables cargadas en Production: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `MAIL_PERFIL`, `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `MAIL_FROM` y `APP_URL`. Las secretas se cargaron como sensibles, leídas de `backend/.env` sin mostrarlas.

## Verificación

| Prueba | Resultado |
|--------|-----------|
| `GET /api/salud`, `/api/fechas`, `/api/actividades` y los turnos | 200, con los datos de Turso |
| Rutas del SPA (`/ingreso`, `/validar-inscripcion`, `/inscripcion/horario`) abiertas directamente | 200 (reescrituras correctas) |
| Inscripción real por la API (Safari, 1 persona) | 201 en 2,1 s, mail enviado por Gmail y cupo descontado |
| Recorrido en un navegador (390 px) hasta la confirmación | Correcto; Lato cargada y sin errores en la consola |
| Recarga en un paso de la inscripción | Vuelve al primer paso pendiente (los datos en curso viven en memoria, por diseño) |
| Pantalla del QR | Muestra el mensaje de demostración sin sesión |

Queda por hacer la prueba desde un celular con datos móviles, escaneando el QR del mail.

## Hallazgos

- `backend/.env` tenía claves repetidas (se le había agregado al final el contenido de `.env.example`): Node toma el último valor, así que `GMAIL_USER` y `GMAIL_APP_PASSWORD` quedaban vacías y `MAIL_FROM` tomaba el valor de ejemplo. Se dejó una sola definición por clave, con `MAIL_FROM="EcoHarmony Park <cuenta@gmail.com>"` (Gmail exige que el remitente sea la cuenta autenticada).
- `vercel link` agrega `.env*` al `.gitignore`, lo que anula la excepción `!.env.example`. Se revirtió: la regla `.env.*` ya ignora el `.env.local` que crea la CLI.
- `vercel env add` sin valor por la entrada estándar falla en modo no interactivo; se carga con `printf 'valor' | npx vercel env add NOMBRE production`.

## La demo: miércoles a las 21:00

Con la hora real, a las 21:00 del miércoles el parque ya cerró: los turnos de "Hoy" aparecen como "Ya empezó", pero los del jueves de 9:00 a 17:00 están dentro de la ventana de 24 horas y se pueden elegir. **No hace falta fijar el reloj**, siempre que:

1. El seed haya cargado ese jueves. El seed actual llega al 30/10/2026 (cubre los miércoles 21/10 y 28/10). Para una fecha posterior, ese mismo día:

   ```bash
   SEED_DIAS_ADELANTE=14 npm run db:seed   # usa Turso (backend/.env); no duplica ni toca inscripciones
   ```

2. El jueves no sea un feriado cerrado (25/12 o 1/1).

### Fijar el reloj si hace falta

Si se quiere que la demo muestre turnos de "Hoy" (por ejemplo, el martes 20/10 a las 10:00) o la demo cae en un día sin turnos:

```bash
# 1. Cargar turnos para esas fechas (el seed usa el reloj fijo como "hoy")
RELOJ_FIJO=2026-10-20T10:00:00-03:00 SEED_DIAS_ADELANTE=7 npm run db:seed

# 2. Fijar el reloj en Vercel y volver a desplegar (las variables se leen al desplegar)
printf '2026-10-20T10:00:00-03:00' | npx vercel env add RELOJ_FIJO production
npx vercel deploy --prod

# Para volver a la hora real
npx vercel env rm RELOJ_FIJO production --yes
npx vercel deploy --prod
```

La fecha va en formato ISO con la zona argentina (`-03:00`). Con el reloj fijo, `GET /api/fechas` ofrece esa fecha y la siguiente, y los turnos se evalúan con esa hora.

## Limpieza después de la demo

Los pasos están en [riesgos y limpieza](04-riesgos-y-limpieza.md), con la base `ecoharmony` (y `eco-poc`, si ya no se usa) en lugar de la del ejemplo.
