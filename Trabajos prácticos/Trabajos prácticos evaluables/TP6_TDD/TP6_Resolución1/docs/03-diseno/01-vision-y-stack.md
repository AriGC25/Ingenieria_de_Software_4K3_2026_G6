# Visión general y stack tecnológico

## Visión general

```
┌──────────────────────┐   HTTP/JSON   ┌───────────────────────────────────────┐
│  Frontend (SPA)      │ ────────────▶ │  Backend (API REST)                   │
│  React + Vite        │ ◀──────────── │                                       │
│  Pasos de inscripción│               │  interfaces → aplicación → dominio    │
└──────────────────────┘               │        │                              │
                                       │        ▼                              │
                                       │  infraestructura                      │
                                       │   ├─ Repositorios (Prisma) ─▶ SQLite/ │
                                       │   │                            Turso  │
                                       │   ├─ Notificador (Nodemailer) ─▶ SMTP │
                                       │   ├─ QR fijo (enlace fijo)            │
                                       │   └─ Reloj y generador de código      │
                                       └───────────────────────────────────────┘
```

## Principios de diseño

| Principio | Qué implica | Origen |
|-----------|-------------|--------|
| **Toda la lógica de negocio vive en el backend**, en la capa de dominio | El frontend valida para dar feedback rápido, pero el backend es la fuente de verdad | D-06 |
| **El dominio no depende de nada externo** (ni base de datos, ni Express, ni mail, ni la hora del sistema) | Las pruebas del dominio corren sin infraestructura y en milisegundos | Estrategia TDD |
| **La hora es una dependencia**: se inyecta un `Reloj` | Se pueden probar la ventana de inscripción, los días cerrados y los límites exactos sin depender de la hora real, y fijar la fecha para la demo | D-08, S-30 |
| **Una inscripción no existe a medias**: o se registra completa, con su mail enviado, o no se registra | Reserva de cupos y registro en una sola transacción; si falla el envío del mail, se deshace | INT-05, RF-19 |
| **El estado de un turno se calcula, no se guarda** | Evita inconsistencias entre el reloj, los cupos y el calendario | Análisis, estados de un turno |

## Stack tecnológico

| Capa | Tecnología | Motivo |
|------|------------|--------|
| Lenguaje | **JavaScript (ES2022)** con **ES Modules** (`import`/`export`) | Un solo lenguaje en front y back, sin paso de compilación. Los contratos se documentan con **JSDoc** |
| Runtime | **Node.js 22 LTS** | Es la versión con la que se validó el despliegue (ver [despliegue](../06-despliegue/README.md)) |
| Backend HTTP | **Express 4** | Mínimo y conocido; no impone estructura, así la arquitectura la define el dominio |
| Validación de entrada | **Zod** | Valida en tiempo de ejecución la forma de los requests; en JavaScript es la red de seguridad que reemplaza al chequeo de tipos |
| Fechas | **date-fns** + **@date-fns/tz** | Las reglas horarias se evalúan en `America/Argentina/Buenos_Aires` aunque el servidor (Vercel) corra en UTC (D-09) |
| Persistencia | **Prisma 7** con el adaptador libSQL: **SQLite** (archivo local) en desarrollo y pruebas, **Turso** en la demo | Cero instalación en local y el mismo código en todos los entornos: solo cambia la URL de conexión. Vercel no permite un archivo SQLite persistente |
| Email | **Nodemailer** con perfiles de SMTP: **Mailpit** (desarrollo), notificador en memoria (pruebas) y **Gmail SMTP** (demo) | El envío es real, al email de la sesión (RF-20). El perfil se elige con `MAIL_PERFIL` |
| Email (contenido) | **Plantilla HTML** con variables `{{...}}` y **qrcode** | El mail se arma desde un archivo HTML; el QR apunta a un enlace fijo (RF-22) |
| Frontend | **React 18 + Vite** y **React Router** | SPA liviana y arranque rápido. El router maneja el ingreso, los pasos de inscripción y la pantalla del QR |
| Formularios | **React Hook Form + Zod** | Validación declarativa de cada paso, con todos los errores a la vez |
| Estilos | **CSS Modules + design tokens** (variables CSS), fuente **Lato** y paleta del PO | Ver [fundamentos del design system](10-design-system-fundamentos.md) |
| Monorepo | **npm workspaces** (`backend`, `frontend`) | Un solo `npm install`, un lockfile y scripts globales |
| Calidad | **ESLint** + **Prettier** + **Husky/lint-staged** | Estilo uniforme y chequeos antes de commitear |
| Herramientas de prueba | **Vitest**, **Supertest**, **Testing Library** + **jsdom**, **MSW**, **Playwright** (opcional), **@vitest/coverage-v8** | Ver la [estrategia TDD](../04-implementacion/01-estrategia-tdd.md) |
| CI (opcional) | **GitHub Actions** | Corre lint y pruebas en cada push y pull request |
