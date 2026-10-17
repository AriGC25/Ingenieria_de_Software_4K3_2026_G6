# Procedimiento de despliegue

Pasos para desplegar el sistema real en Vercel y Turso. Las pantallas de Google, Turso y Vercel cambian de vez en cuando: si algún texto no coincide, se sigue el sentido del paso.

## 0. Preparación

```bash
nvm use 22
npm install
```

Node 22 es la versión validada. El `.zshrc` cambia de versión solo al entrar a la carpeta, por el `.nvmrc`.

## 1. Gmail: contraseña de aplicación

1. Entrar a <https://myaccount.google.com/security> con la cuenta que va a enviar los mails.
2. Activar la **Verificación en 2 pasos**, si no está.
3. Abrir <https://myaccount.google.com/apppasswords>. Si la opción no aparece, la verificación en dos pasos no está activa o la cuenta pertenece a una organización que la bloquea.
4. Ponerle un nombre (por ejemplo, `ecoharmony`) y crearla.
5. Google muestra una contraseña de 16 letras **una sola vez**. Copiarla y guardarla sin espacios: es `GMAIL_APP_PASSWORD`.

## 2. Turso: crear la base

```bash
curl -sSfL https://get.tur.so/install.sh | bash   # instala la CLI, si no está
turso auth login
turso db locations
turso db create ecoharmony --location aws-us-east-1
turso db show ecoharmony --url         # TURSO_DATABASE_URL
turso db tokens create ecoharmony      # TURSO_AUTH_TOKEN
turso db shell ecoharmony "select 1"   # comprueba que responde
```

Vercel ejecuta las funciones por defecto en el este de EE. UU., por eso conviene una base cercana. Si se reutiliza la base de la prueba, hay que vaciarla antes (ver el paso 4).

## 3. Variables de entorno locales

Copiar `.env.example` a `backend/.env` y completar los datos de Turso y de Gmail. El archivo está en `.gitignore` y nunca se versiona.

## 4. Migraciones y seed contra Turso

```bash
npm run db:migrate:turso
npm run db:seed
```

- `db:migrate:turso` aplica los `migration.sql` pendientes. Debe imprimir cada migración aplicada.
- Si la base tiene tablas de la prueba, se borran antes con `turso db shell ecoharmony` (`DROP TABLE` de cada tabla) o se destruye y se vuelve a crear la base.
- `db:seed` carga las actividades, los términos y los turnos. Se verifica con `turso db shell ecoharmony "select count(*) from Turno"`.

## 5. Vercel: proyecto y variables

```bash
npx vercel login
npx vercel link
```

En `vercel link`: crear un proyecto nuevo (o elegir el existente), sin conectarlo a GitHub, y dejar `./` como directorio. Después, cargar las variables, una por una (cada comando pide el valor; si pregunta si es sensible, responder que sí):

```bash
npx vercel env add TURSO_DATABASE_URL production
npx vercel env add TURSO_AUTH_TOKEN production
npx vercel env add MAIL_PERFIL production        # demo
npx vercel env add GMAIL_USER production
npx vercel env add GMAIL_APP_PASSWORD production
npx vercel env add MAIL_FROM production
npx vercel env add APP_URL production            # la URL pública del proyecto
npx vercel env add RELOJ_FIJO production         # opcional
npx vercel env ls
```

Los valores se escriben en el prompt: no se pegan en el chat ni se suben al repositorio.

## 6. Desplegar

```bash
npx vercel deploy --prod
```

Al final imprime las URLs. Se usa la de producción (marcada como "Aliased"); la URL única de cada despliegue está protegida por defecto y pide iniciar sesión en Vercel. Si el despliegue falla, `npx vercel logs <url>` muestra el motivo.

## 7. Prueba completa

Con la URL de producción, desde el computador y desde un celular con datos móviles:

1. **Ingreso** con un email al que se pueda acceder y cualquier contraseña.
2. **Actividades:** las cuatro aparecen; las que no tengan turnos disponibles, deshabilitadas.
3. **Horario:** el selector ofrece la fecha y la siguiente, y los turnos muestran su estado.
4. **Participantes y confirmación:** completar una inscripción de Tirolesa con dos personas, abrir el modal de términos, aceptarlos y confirmar.
5. **Mail:** llega con el detalle, el código `ECOPARK-`, el QR embebido y el adjunto. Revisar también la carpeta de spam.
6. **QR:** escanearlo con el celular debe abrir `/validar-inscripcion`.
7. **Errores:** probar sin cupo (inscribirse varias veces al mismo turno hasta agotarlo) y con una persona ya inscripta en ese horario.
8. **Rutas:** recargar la página en un paso de la inscripción y abrir `/validar-inscripcion` directamente.

Si algo falla, el [documento de riesgos](04-riesgos-y-limpieza.md) indica qué significa cada falla y el plan B.
