# Fases de implementación

## Fase 0: configuración inicial

Sin TDD, salvo el endpoint de salud.

1. **Raíz del monorepo**
   - `package.json` con `"type": "module"`, `"private": true`, `"workspaces": ["backend", "frontend"]` y `"engines": { "node": "22.x" }`.
   - `.nvmrc` con `22`.
   - `.editorconfig`, `.prettierrc` (2 espacios, comillas simples, `;`, ancho 100) y `.prettierignore`.
   - `eslint.config.js`: `eslint:recommended`, `eslint-plugin-jsdoc` (backend), `eslint-plugin-react` y `eslint-plugin-react-hooks` (frontend) y `no-console` en error salvo en `main.js` y los scripts.
   - Husky y lint-staged: `pre-commit` corre lint y formato sobre lo modificado; `pre-push` corre `vitest run`.
   - Los scripts del [diseño](../03-diseno/08-configuracion-y-despliegue.md).
   - `.gitignore` (ya existe) y `.env.example` en `backend/` con todas las variables, sin secretos.
2. **Backend**
   - Dependencias: `express@4`, `zod`, `@prisma/client@7`, `@prisma/adapter-libsql@7`, `@libsql/client`, `nodemailer@10`, `qrcode`, `date-fns` y `@date-fns/tz`. Desarrollo: `prisma@7`, `vitest`, `@vitest/coverage-v8`, `supertest`, `jsqr` y `pngjs` (para leer el QR en las pruebas).
   - `vitest.config.js` con cobertura por carpeta: 90% de líneas en `src/dominio/` y `src/aplicacion/`, y 70% global.
   - `prisma.config.ts` y `database/schema.prisma` con el [modelo de datos](../03-diseno/05-modelo-de-datos.md) y el generador ESM.
   - La [estructura de carpetas](../03-diseno/02-estructura-del-proyecto.md), con `tests/builders/` y `tests/dobles/`.
3. **Frontend**
   - Vite y React 18, `react-router`, `react-hook-form`, `zod` y `@hookform/resolvers`. Desarrollo: `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom` y `msw`.
   - Proxy de Vite: `/api` hacia `http://localhost:3000`.
4. **Esqueleto que atraviesa todas las capas** (primer ciclo TDD):
   - `[RED]` prueba de integración: `GET /api/salud` responde `200 { ok: true }`.
   - `[GREEN]` `crearApp()` en `interfaces/http/app.js`, `main.js` con `listen` en local y `api/index.js` en la raíz para Vercel.
5. **Despliegue temprano:** `vercel.json` en la raíz (build, `outputDirectory: frontend/dist`, reescrituras de `/api/*` a la función y del resto a `index.html`). Se despliega el esqueleto con las credenciales de `backend/.env`. Valida el [pendiente del despliegue](../06-despliegue/README.md).
6. **CI opcional:** GitHub Actions con `npm ci`, `npm run lint` y `npm test` en cada push y pull request.

**Terminada cuando:** `npm install` en limpio, `npm test` en verde, `npm run lint` sin errores, `npm run dev` levanta ambos paquetes y la URL de Vercel responde `/api/salud`.

## Fase 1: dominio

Sub-fases, cada una con sus [casos](04-casos-dominio.md):

1. `errores.js` y `constantes.js` (se crean en el primer `[GREEN]` que los necesita, no antes).
2. `calendarioParque.js`: días cerrados y feriados.
3. `ventanaInscripcion.js`.
4. `participante.js`: datos válidos.
5. `actividad.js`: talle y edad mínima y máxima.
6. `turno.js`: cupos y estado.
7. `inscripcion.js`: la regla completa, con el orden de validación y la superposición.

**Terminada cuando:** todos los casos pasan, la cobertura es ≥ 90% en `dominio/` y ningún archivo importa nada externo (salvo `date-fns`).

## Fase 2: aplicación

1. `puertos.js` con los contratos en JSDoc.
2. Dobles en `tests/dobles/`: repositorios en memoria (fakes), notificador espía, reloj fijo, y generador de código y QR fijos (stubs).
3. `ListarActividades`, `ConsultarFechas`, `ConsultarTurnos` e `InscribirseActividad` ([casos](05-casos-aplicacion.md)).

## Fase 3: infraestructura

1. Configuración desde el entorno (valores por defecto y errores claros).
2. Relojes: del sistema y fijo (`RELOJ_FIJO`).
3. Generador de código `ECOPARK-XXXXXX`.
4. `QrFijo` con `qrcode`.
5. Plantilla del mail: HTML, renderizador con escape y armado de las filas de participantes.
6. Notificadores: en memoria y SMTP (probado con el transporte de prueba de Nodemailer, sin red).
7. Migraciones: `aplicarMigraciones(cliente)`, la misma función que usa `db:migrate:turso`; las pruebas de integración la usan para preparar la base, así queda probada.
8. Repositorios Prisma sobre una base SQLite temporal por archivo de prueba.
9. Seed: actividades, términos y turnos de los próximos 7 días.

Los [casos](06-casos-infraestructura.md) cubren cada pieza.

## Fase 4: HTTP y composición

1. Esquemas Zod de la forma del request.
2. Mapeo de los errores de dominio a HTTP ([API](../03-diseno/04-api-rest.md)).
3. Rutas y controladores de los cuatro endpoints.
4. `main.js`: composición según el entorno (base `file:` o `libsql://`, perfil de mail, reloj real o fijo).
5. Pruebas de integración con Supertest sobre SQLite real y notificador en memoria ([casos](07-casos-http.md)).

## Fase 5: diseño visual base

1. `styles/tokens.css` con los [tokens](../03-diseno/10-design-system-fundamentos.md) y estilos base con Lato (sin TDD).
2. Logo: `logo.svg`, `logo-simbolo.svg`, favicon y `logo.png` para el mail ([logo](../03-diseno/11-logo.md)). Se manda al PO para validar.
3. Componentes del [design system](../03-diseno/12-componentes.md) con pruebas: `Button`, `TextField`, `Select`, `Checkbox`, `Alert`, `Stepper`, `SelectorFecha`, `ActividadCard`, `TurnoChip`, `ParticipanteForm`, `ResumenInscripcion`, `Encabezado` y `Modal`.

## Fase 6: sesión, rutas y pantallas auxiliares

1. Cliente HTTP en `src/api/`, el único lugar con `fetch`.
2. Sesión simulada: contexto, `sessionStorage`, `LoginForm` y ruta protegida.
3. Pantalla `/validar-inscripcion`, pública.
4. Textos de los términos de las cuatro actividades (se cargan en el seed y se mandan al PO).

## Fase 7: flujo de inscripción

Los pasos de las [pantallas](../03-diseno/13-pantallas.md), en este orden, con MSW simulando la API ([casos](08-casos-frontend.md)): actividad, horario, participantes, confirmación con el modal de términos, y resultado.

## Fase 8: integración y E2E

1. Correr el sistema completo en local (backend, frontend, SQLite y Mailpit).
2. Playwright con las pruebas de aceptación, usando `RELOJ_FIJO` para tener turnos y la API de Mailpit para verificar el mail.
3. Revisión del [checklist de accesibilidad](../03-diseno/15-accesibilidad.md).

## Fase 9: despliegue y entrega

1. Vaciar la base de Turso de la prueba, aplicar las migraciones y correr el seed contra Turso.
2. Cargar las variables de la demo en Vercel (`APP_URL`, `MAIL_PERFIL=demo`, `RELOJ_FIJO` y las demás) y desplegar.
3. Prueba completa en Vercel desde un celular, escaneando el QR.
4. `docs/decisiones-diseno.md` (entregable), README actualizado y Definición de Done revisada.
