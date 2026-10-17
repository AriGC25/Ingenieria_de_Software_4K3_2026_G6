# EcoHarmony Park: Inscripción a actividades (TP 6 - TDD)

Trabajo Práctico 6 de Ingeniería y Calidad de Software (4K3, 2026, Grupo 6). Implementa la historia de usuario **"Inscribirme a actividad"** (5 SP) del bioparque EcoHarmony Park aplicando **Desarrollo Conducido por Pruebas (TDD)** con el ciclo Red-Green-Refactor.

## Qué hace

El visitante ingresa (con una sesión simulada), elige una actividad (Tirolesa, Safari, Palestra o Jardinería), una fecha y un turno con cupo, e indica cuántas personas participan. Carga los datos de cada una (nombre, DNI, edad y talle si la actividad lo requiere), acepta los términos y condiciones de la actividad y recibe por email la confirmación con el detalle, un código de inscripción y un código QR.

Criterios de aceptación y pruebas de aceptación (PA-01 a PA-06): [03-historia-usuario.md](docs/00-dominio/03-historia-usuario.md).

## Documentación

La documentación está en `docs/`, con una carpeta por fase del proyecto. Dentro de cada carpeta, los archivos están numerados en el orden en que conviene leerlos, y las fases con varios documentos tienen un `README.md` que los indexa. Los supuestos y definiciones de todas las fases están reunidos en un único archivo.

| Fase | Documento | Contenido |
|------|-----------|-----------|
| 0. Dominio | [README.md](docs/00-dominio/README.md) | Índice de la documentación del dominio |
| | [01-consigna.md](docs/00-dominio/01-consigna.md) | Consigna del TP 6 |
| | [02-enunciado.md](docs/00-dominio/02-enunciado.md) | Descripción del dominio de EcoHarmony Park |
| | [03-historia-usuario.md](docs/00-dominio/03-historia-usuario.md) | Historia de usuario, criterios y pruebas de aceptación, Definition of Ready/Done |
| | [04-validaciones-po.md](docs/00-dominio/04-validaciones-po.md) | Respuestas del PO (FAQ de los docentes), transcriptas tal cual |
| 1. Requerimientos | [README.md](docs/01-requerimientos/README.md) | Necesidad, objetivo, actores e índice de la fase |
| | [01-requisitos-funcionales.md](docs/01-requerimientos/01-requisitos-funcionales.md) | Requisitos funcionales, decisiones del equipo y requisitos no funcionales |
| | [02-reglas-de-negocio.md](docs/01-requerimientos/02-reglas-de-negocio.md) | Reglas de negocio del dominio |
| | [03-flujos-y-pruebas.md](docs/01-requerimientos/03-flujos-y-pruebas.md) | Flujo del visitante, trazabilidad, pruebas y criterios de aceptación propuestos |
| | [04-ambiguedades.md](docs/01-requerimientos/04-ambiguedades.md) | Ambigüedades resueltas y desvíos respecto del FAQ |
| 2. Análisis | [README.md](docs/02-analisis/README.md) | Alcance, decisiones del analista e índice de la fase |
| | [01-modelo-de-dominio.md](docs/02-analisis/01-modelo-de-dominio.md) | Entidades, relaciones, integridad, estados y cálculos |
| | [02-datos-maestros.md](docs/02-analisis/02-datos-maestros.md) | Actividades, turnos, calendario y datos registrados |
| | [03-casos-de-uso.md](docs/02-analisis/03-casos-de-uso.md) | Casos de uso CU-01 a CU-07 |
| | [04-reglas-de-validacion.md](docs/02-analisis/04-reglas-de-validacion.md) | Validación de campos, orden de validación y errores |
| | [05-pantallas-y-mail.md](docs/02-analisis/05-pantallas-y-mail.md) | Pantallas, mail de confirmación y código de inscripción |
| | [06-trazabilidad.md](docs/02-analisis/06-trazabilidad.md) | Requisitos contra casos de uso y pruebas |
| 3. Diseño | [README.md](docs/03-diseno/README.md) | Índice de la fase, trazabilidad desde el análisis, correcciones y decisiones de diseño |
| | [01 a 09](docs/03-diseno/README.md) | Arquitectura: visión y stack, estructura, backend, API REST, modelo de datos, frontend, mail y QR, configuración y convenciones |
| | [10 a 15](docs/03-diseno/README.md) | Design system: fundamentos, logo, componentes, pantallas, mensajes y accesibilidad |
| 4. Implementación | [README.md](docs/04-implementacion/README.md) | Índice de la fase y resumen de las diez fases de construcción |
| | [01-estrategia-tdd.md](docs/04-implementacion/01-estrategia-tdd.md) | Ciclo Red-Green-Refactor, dobles de prueba y convenciones de las pruebas |
| | [02 a 03](docs/04-implementacion/README.md) | Forma de trabajo y fases |
| | [04 a 09](docs/04-implementacion/README.md) | Casos de prueba por capa (dominio, aplicación, infraestructura, API y frontend) y trazabilidad |
| 5. Testing | [README.md](docs/05-testing/README.md) | Índice de la fase y convenciones de identificadores |
| | [01 a 06](docs/05-testing/README.md) | Datos de referencia, escenarios, clases de equivalencia, valores límite, casos de prueba y matriz de cobertura |
| 6. Despliegue | [README.md](docs/06-despliegue/README.md) | Índice de la fase |
| | [01 a 04](docs/06-despliegue/README.md) | Decisión y prueba, configuración de la demo, procedimiento y riesgos |
| Todas | [supuestos.md](docs/supuestos.md) | Supuestos y definiciones de todas las fases (S-01 a S-41) |
| Entregable | `docs/decisiones-diseno.md` | Justificación de las decisiones de diseño (pendiente) |

## Stack

- **Backend:** Node.js 22, Express 4, Zod, Prisma 7 (SQLite en local, Turso en la demo), Nodemailer, qrcode y date-fns.
- **Frontend:** React 18, Vite, React Router, React Hook Form, CSS Modules (fuente Lato y paleta del PO).
- **Pruebas:** Vitest, Supertest, Testing Library, MSW (Playwright opcional).
- **Calidad:** ESLint, Prettier, Husky/lint-staged.
- **Demo:** Vercel, Turso y Gmail SMTP.

El backend sigue una arquitectura de puertos y adaptadores (dominio, aplicación, infraestructura e interfaces HTTP). El dominio no depende de nada externo, ni siquiera de la hora, por lo que sus pruebas corren sin base de datos ni servidor.

## Estructura

```
backend/     API REST (src/dominio, src/aplicacion, src/infraestructura, src/interfaces, database/, tests/)
frontend/    SPA con el formulario por pasos
docs/        Una carpeta por fase (00-dominio a 06-despliegue)
```

El detalle está en la [estructura del proyecto](docs/03-diseno/02-estructura-del-proyecto.md).

## Requisitos

- Node.js 22 LTS y npm (el repositorio incluye un `.nvmrc`).
- Opcional: Docker, para levantar [Mailpit](https://mailpit.axllent.org/) y ver los emails enviados.

## Instalación y ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp backend/.env.example backend/.env

# 3. Crear la base de datos y cargar actividades, términos y turnos de los próximos 7 días
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

Las principales; la lista completa y sus valores por defecto están en la [configuración](docs/03-diseno/08-configuracion-y-despliegue.md).

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `DATABASE_URL` | Base SQLite local | `file:./dev.db` |
| `APP_URL` | URL pública, para el QR | `http://localhost:5173` |
| `MAIL_PERFIL` | `desarrollo` (Mailpit), `pruebas` (en memoria) o `demo` (Gmail) | `desarrollo` |
| `PARQUE_APERTURA` y `PARQUE_CIERRE` | Horario del parque | `08:30` y `19:00` |
| `RELOJ_FIJO` | Fecha y hora del sistema para la demo | vacía (hora real) |

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
test(dominio): [RED] rechaza un turno en lunes
feat(dominio): [GREEN] calendario con días cerrados
refactor(dominio): [REFACTOR] extraer estaAbierto
```

Se avanza de adentro hacia afuera (dominio, aplicación, API y frontend). La metodología está en la [estrategia TDD](docs/04-implementacion/01-estrategia-tdd.md) y el orden de construcción, en las [fases](docs/04-implementacion/03-fases.md).

## API

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/actividades` | Actividades con su disponibilidad |
| `GET` | `/api/fechas` | Fechas elegibles para inscribirse |
| `GET` | `/api/actividades/:id/turnos?fecha=YYYY-MM-DD` | Turnos de la fecha, con cupos y estado |
| `POST` | `/api/inscripciones` | Crea una inscripción y envía la confirmación (`201`) |

Los errores tienen el formato `{ "codigo": "SIN_CUPO", "mensaje": "...", "campo": "..." }`. La tabla completa de códigos y estados HTTP está en la [API REST](docs/03-diseno/04-api-rest.md).

## Supuestos y alcance

Los bloqueantes de la historia se resolvieron con las [respuestas del PO](docs/00-dominio/04-validaciones-po.md). Los supuestos y definiciones del equipo están en [supuestos.md](docs/supuestos.md), y los desvíos respecto del FAQ, en las [ambigüedades](docs/01-requerimientos/04-ambiguedades.md).

Fuera de alcance: compra de entradas, registro y autenticación reales, validación real del QR (el mail incluye un QR con un enlace fijo a una pantalla simulada), cancelación o modificación de inscripciones y administración de actividades.

## Equipo

Grupo 6, 4K3, 2026.
