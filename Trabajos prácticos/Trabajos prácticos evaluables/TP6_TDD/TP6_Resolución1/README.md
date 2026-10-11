# EcoHarmony Park: Inscripción a actividades (TP 6 - TDD)

Trabajo Práctico 6 de Ingeniería y Calidad de Software (4K3, 2026, Grupo 6). Implementa la historia de usuario **"Inscribirme a actividad"** (5 SP) del bioparque EcoHarmony Park aplicando **Desarrollo Conducido por Pruebas (TDD)** con el ciclo Red-Green-Refactor.

## Qué hace

El visitante elige una actividad (Tirolesa, Safari, Palestra o Jardinería), un horario con cupo disponible y la cantidad de personas. Después carga los datos de cada participante (nombre, DNI, edad y talla si la actividad la requiere), acepta los términos y condiciones de la actividad y recibe por email la confirmación con un código QR.

Criterios de aceptación y pruebas de aceptación (PA-01 a PA-06): [docs/historia-usuario.md](docs/historia-usuario.md).

## Documentación

| Documento | Contenido |
|-----------|-----------|
| [docs/consigna.md](docs/consigna.md) | Consigna del TP 6 |
| [docs/enunciado.md](docs/enunciado.md) | Descripción del dominio de EcoHarmony Park |
| [docs/historia-usuario.md](docs/historia-usuario.md) | Historia de usuario, criterios, pruebas de aceptación, Definition of Ready/Done y consultas al PO |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Stack, estructura, capas, API REST, modelo de datos y estrategia TDD |
| [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) | Tokens, componentes, flujo de pantallas, tono y accesibilidad |
| `docs/decisiones-diseno.md` | Justificación de las decisiones de diseño (entregable; pendiente) |

## Stack

- **Backend:** Node.js 20, Express 4, Zod, Prisma + SQLite, Nodemailer.
- **Frontend:** React 18, Vite, React Hook Form, CSS Modules.
- **Pruebas:** Vitest, Supertest, Testing Library, MSW (Playwright opcional).
- **Calidad:** ESLint, Prettier, Husky/lint-staged.

El backend sigue una arquitectura de puertos y adaptadores (dominio → aplicación → infraestructura → interfaces HTTP). El dominio no depende de nada externo, por lo que sus pruebas corren sin base de datos ni servidor.

## Estructura

```
backend/     API REST (src/dominio, src/aplicacion, src/infraestructura, src/interfaces, database/, tests/)
frontend/    SPA con el formulario por pasos
docs/        Consigna, enunciado, historia de usuario y decisiones de diseño
```

El detalle está en la sección 3 de [ARCHITECTURE.md](ARCHITECTURE.md).

## Requisitos

- Node.js 20 LTS o superior y npm.
- Opcional: Docker, para levantar [Mailpit](https://mailpit.axllent.org/) y ver los emails enviados.

## Instalación y ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Crear la base de datos y cargar actividades y horarios de ejemplo
npm run db:migrate
npm run db:seed

# 4. (Opcional) SMTP local para ver los mails
docker run -d -p 1025:1025 -p 8025:8025 axllent/mailpit

# 5. Levantar backend y frontend
npm run dev
```

- Frontend: <http://localhost:5173>
- Backend (API): <http://localhost:3000/api>
- Mailpit (bandeja de entrada de prueba): <http://localhost:8025>

### Variables de entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | Ubicación de la base SQLite | `file:./dev.db` |
| `SMTP_HOST` / `SMTP_PORT` | Servidor SMTP | `localhost` / `1025` |
| `MAIL_FROM` | Remitente de los emails | `no-reply@ecoharmony.park` |
| `PARQUE_APERTURA` / `PARQUE_CIERRE` | Horario del parque (supuesto pendiente de confirmar con el PO) | `09:00` / `18:00` |

## Pruebas

| Comando | Acción |
|---------|--------|
| `npm test` | Corre todas las pruebas |
| `npm run test:watch` | Modo TDD (Vitest en `watch`) |
| `npm run test:coverage` | Reporte de cobertura |
| `npm run lint` | ESLint + Prettier |

Cobertura mínima: 90% de líneas en `dominio/` y `aplicacion/`, y 70% global.

## Metodología: TDD

Cada comportamiento se desarrolla en tres pasos, y cada uno es un commit:

```
test(dominio): [RED] inscribir sin cupo lanza SIN_CUPO
feat(dominio): [GREEN] validar cupo disponible en inscripción
refactor(dominio): [REFACTOR] extraer Horario.reservar(cantidad)
```

Se avanza de adentro hacia afuera (dominio → aplicación → API → frontend). El plan de 15 iteraciones está en la sección 7.2 de [ARCHITECTURE.md](ARCHITECTURE.md).

## API

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/actividades` | Lista de actividades |
| `GET` | `/api/actividades/:id/horarios?fecha=YYYY-MM-DD` | Horarios con cupos disponibles |
| `POST` | `/api/inscripciones` | Crea una inscripción (`201`) |

Los errores tienen el formato `{ "codigo": "SIN_CUPO", "mensaje": "..." }`. La tabla completa de códigos y estados HTTP está en la sección 5.2 de [ARCHITECTURE.md](ARCHITECTURE.md).

## Supuestos y alcance

Hay consultas al Product Owner sin responder (horario del parque, cupos, tallas válidas, email de destino). Mientras tanto se usan los supuestos de la sección 3 de [docs/historia-usuario.md](docs/historia-usuario.md), configurables sin tocar el código.

Fuera de alcance: validación del QR (el mail incluye una imagen fija), cancelación o modificación de inscripciones y administración de actividades.

## Equipo

Grupo 6, 4K3, 2026.
