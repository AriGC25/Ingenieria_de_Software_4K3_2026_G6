# Decisión y prueba de despliegue

## Decisión

| Componente | Servicio | Motivo |
|------------|----------|--------|
| Frontend (estático) y backend (Express como función) | **Vercel**, plan Hobby | Gratis, HTTPS y URL fija; el uso académico entra en el plan personal o no comercial |
| Base de datos | **Turso** (libSQL, compatible con SQLite), plan gratuito | Vercel no tiene disco persistente, así que un archivo SQLite no sirve |
| Correo | **Gmail SMTP** con contraseña de aplicación | Pedido del equipo: envío real al email de la sesión (RF-20) |

### Alternativas descartadas

- **Render (plan gratuito):** bloquea el SMTP saliente (puertos 25, 465 y 587), el disco es efímero y el servicio se duerme tras 15 minutos sin uso.
- **Notebook con túnel de Cloudflare:** se mantiene como **plan B**. No necesita cambios de código, pero depende del equipo y de la conexión durante la demo, y la URL cambia en cada sesión.

## Resultado de la prueba (15/10/2026)

Se desplegó un proyecto mínimo en Vercel y Turso, que ya no está en el repositorio, para ejercitar los riesgos principales.

| Prueba | Resultado |
|--------|-----------|
| Prisma 7 y libSQL corriendo en Vercel | Correcto; 193 ms por consulta |
| 20 reservas simultáneas sobre 8 cupos | 8 exitosas, 12 sin cupo, cupo final 8; 475 ms en total |
| Gmail SMTP desde Vercel, con el QR embebido y adjunto | Mail recibido con el QR correcto; 726 ms |
| El QR apuntando a `/validar-inscripcion` | Abre la pantalla en el celular |
| Rutas del frontend (reescrituras a `index.html`) | Correctas |

Conclusión: la opción es viable para la demo.

## Hallazgos para la implementación

1. **Módulos ES con extensión:** con `"type": "module"`, los imports relativos deben llevar `.js`. El generador de Prisma se configura con `moduleFormat = "esm"` e `importFileExtension = "js"`; sin eso, la función falla al cargar (`FUNCTION_INVOCATION_FAILED`).
2. **Prisma 7 y el adaptador libSQL:** el mismo código funciona con `file:` (desarrollo y pruebas) y con `libsql://` (Turso). Las transacciones interactivas y la reserva atómica de cupos se comportan igual en ambos.
3. **Migraciones:** `prisma migrate` no corre contra Turso. Se generan en local y se aplican a Turso con un script que ejecuta los `migration.sql` pendientes.
4. **Express en Vercel:** `express.static()` no sirve archivos. El frontend se sirve desde el CDN y la API desde la función, con reescrituras en `vercel.json` (`/api/*` a la función y el resto a `index.html`).
5. **Envío del mail:** hay que usar `await` en `sendMail` antes de responder, porque la función termina al responder.
6. **Versiones:** Node 22 y Nodemailer 10 (la serie 6 tiene vulnerabilidades conocidas según `npm audit`). Prisma 7.x: el tag `latest` de npm ya apunta a una versión 8 en candidato a release.
7. **Variables de la prueba:** las credenciales que se usaron (Turso, Gmail y un token de la prueba) se conservaron en `backend/.env`, que Git ignora, para reutilizarlas en la demo.
