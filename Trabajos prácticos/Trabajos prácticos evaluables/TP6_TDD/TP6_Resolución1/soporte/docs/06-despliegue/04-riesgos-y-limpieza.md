# Riesgos y limpieza

## Pendiente de validar en el sistema real

La prueba usó un proyecto plano. El sistema real es un monorepo (`backend/` y `frontend/`), así que hay que comprobar en el primer despliegue:

- La estructura de la función (`api/index.js` en la raíz, que reexporta la app del backend) y la ruta de salida del frontend compilado (`frontend/dist`).
- Las reescrituras de `vercel.json` con las rutas del SPA: `/inscripcion/*`, `/ingreso` y `/validar-inscripcion`.
- La instalación de dependencias y `prisma generate` durante el build.

Se recomienda hacer un primer despliegue del sistema real apenas haya una pantalla y un endpoint funcionando (fase 0 de la [implementación](../04-implementacion/03-fases.md)), y no el día antes de la demo.

## Qué significa cada falla

| Síntoma | Causa probable | Qué hacer |
|---------|----------------|-----------|
| La función no carga (`FUNCTION_INVOCATION_FAILED`) | Imports sin extensión `.js`, o un problema de empaquetado de Prisma | Revisar el generador de Prisma y los logs (`npx vercel logs`) |
| Errores en las reservas simultáneas | Timeout de la transacción por la latencia con Turso | Revisar el mensaje y la región de la base |
| El mail no llega o falla el inicio de sesión de Gmail | Google bloquea la IP de Vercel | Revisar la actividad de seguridad de la cuenta; usar OAuth2 o el plan B |
| Las rutas dan 404 al recargar | Reescrituras de `vercel.json` mal configuradas | Corregir las reglas: `/api/*` a la función y el resto a `index.html` |
| No hay turnos disponibles | La demo cae un lunes, un feriado o fuera del horario, o el seed no cargó esas fechas | Fijar `RELOJ_FIJO` y correr el seed |
| El QR abre una URL que no responde | `APP_URL` mal configurada | Corregirla en Vercel y volver a desplegar |

## Plan B: notebook con túnel de Cloudflare

Si Vercel o Gmail fallan cerca de la demo, el sistema corre en la notebook y se expone con un túnel de Cloudflare (`cloudflared tunnel --url http://localhost:3000`), sin cuentas de hosting ni cambios de código:

1. Levantar el túnel: imprime una URL `https://algo-aleatorio.trycloudflare.com`.
2. Copiar esa URL en `APP_URL` (el QR se genera con ese valor) y arrancar el sistema con `MAIL_PERFIL=demo`, y `RELOJ_FIJO` si hace falta.
3. Probar el flujo completo desde un celular con datos móviles, incluido el QR.

La demo dura mientras el túnel y la notebook estén encendidos: conviene enchufarla, desactivar la suspensión y tener una conexión estable. Si el túnel se reinicia, la URL cambia y hay que repetir los pasos 2 y 3.

## Seguridad y limpieza

- Las credenciales (token de Turso, contraseña de Gmail) solo se cargan como variables de entorno de Vercel y en `backend/.env`; nunca en el repositorio.
- El envío usa una cuenta de Gmail personal solo para la demo y una prueba completa previa.
- La aplicación no tiene autenticación real: mientras la demo está publicada, cualquiera con la URL puede inscribirse.

Al terminar la demo:

1. Revocar la contraseña de aplicación de Gmail.
2. Borrar las variables de entorno y el proyecto de Vercel (`npx vercel remove <proyecto>`).
3. Destruir la base de Turso (`turso db destroy ecoharmony`).
4. Cerrar el túnel de Cloudflare, si se usó.
