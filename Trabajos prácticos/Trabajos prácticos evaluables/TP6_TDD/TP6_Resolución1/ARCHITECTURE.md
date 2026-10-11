# Diseño de Arquitectura de EcoHarmony Park

Documento de arquitectura del TP 6. Define el stack tecnológico, la estructura del proyecto, la separación de responsabilidades entre frontend y backend, las convenciones de desarrollo y cómo se aplica TDD (Red-Green-Refactor).

---

## 1. Visión general

```
┌──────────────────────┐   HTTP/JSON   ┌───────────────────────────────────────┐
│  Frontend (SPA)      │ ────────────▶ │  Backend (API REST)                   │
│  React + Vite        │ ◀──────────── │                                       │
│  Formulario por pasos│               │  interfaces → aplicación → dominio    │
└──────────────────────┘               │        │                              │
                                       │        ▼                              │
                                       │  infraestructura                      │
                                       │   ├─ Repositorios (Prisma) ─▶ SQLite  │
                                       │   ├─ Notificador (Nodemailer) ─▶ SMTP │
                                       │   └─ QR fijo (imagen estática)        │
                                       └───────────────────────────────────────┘
```

- **Toda la lógica de negocio vive en el backend**, en la capa de dominio. El frontend valida para dar feedback rápido, pero el backend es la fuente de verdad.
- **El dominio no depende de nada externo** (ni base de datos, ni Express, ni mail). Esto permite escribir las pruebas TDD sin infraestructura y en milisegundos.

---

## 2. Stack tecnológico

| Capa | Tecnología | Motivo |
|------|------------|--------|
| Lenguaje | **JavaScript (ES2022)** con **ES Modules** (`import`/`export`) | Un solo lenguaje en front y back, sin paso de compilación. Los contratos se documentan con **JSDoc**. |
| Runtime | **Node.js 20 LTS** | Estable y estándar. |
| Backend HTTP | **Express 4** | Mínimo y conocido; no impone estructura, así la arquitectura la define el dominio. |
| Validación de entrada | **Zod** | Valida en tiempo de ejecución la forma de los requests; en JavaScript es la red de seguridad que reemplaza al chequeo de tipos. |
| Persistencia | **Prisma ORM + SQLite** | Cero instalación (un archivo), migraciones y seed simples. Cambiar a PostgreSQL es modificar el `provider`. |
| Email | **Nodemailer** + **Mailpit** (SMTP local en Docker) o **Ethereal** | Se puede ver el mail real con el QR sin enviar a casillas reales. |
| Email (contenido) | **Template HTML** con placeholders `{{...}}` | El mail se arma desde un archivo HTML; el QR es una **imagen fija** porque la validación del QR está fuera de alcance (ver 4.3). |
| Frontend | **React 18 + Vite** | SPA liviana, arranque rápido. |
| Formularios | **React Hook Form + Zod** | Validación declarativa reutilizando los esquemas. |
| Estilos | **CSS Modules + design tokens** (variables CSS) | Ver [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md). |
| Tests (back y front) | **Vitest** | Mismo runner en todo el monorepo, rápido, modo `watch` ideal para TDD. |
| Tests de API | **Supertest** | Pruebas de integración sobre los endpoints HTTP. |
| Tests de UI | **Testing Library** (`@testing-library/react`, `user-event`) + **jsdom** | Prueba el comportamiento como lo ve el usuario. |
| Mocks HTTP en front | **MSW** (Mock Service Worker) | Simula la API en los tests del frontend. |
| E2E (opcional) | **Playwright** | Recorre las pruebas de aceptación de punta a punta. |
| Calidad | **ESLint** + **Prettier** + **Husky/lint-staged** | Estilo uniforme y chequeos antes de commitear. |
| Cobertura | **@vitest/coverage-v8** | Reporte de cobertura por capa. |
| CI (opcional) | **GitHub Actions** | Corre lint y tests en cada push/PR. |

---

## 3. Estructura del repositorio (monorepo)

```
TP6_Resolución1/
├── backend/
│   ├── database/                    # Todo lo de base de datos en un solo lugar
│   │   ├── schema.prisma
│   │   └── seed.js                  # Actividades, horarios y cupos de ejemplo
│   ├── src/
│   │   ├── dominio/                 # Reglas de negocio puras (sin dependencias)
│   │   │   ├── actividad.js
│   │   │   ├── horario.js
│   │   │   ├── participante.js
│   │   │   ├── inscripcion.js
│   │   │   ├── horarioParque.js
│   │   │   └── errores.js           # Errores de dominio (clases con código)
│   │   ├── aplicacion/              # Casos de uso y puertos (contratos)
│   │   │   ├── inscribirseActividad.js
│   │   │   ├── listarActividades.js
│   │   │   └── puertos.js           # RepositorioHorarios, Notificador, GeneradorQR, Reloj
│   │   ├── infraestructura/         # Adaptadores concretos de los puertos
│   │   │   ├── database/            # Repositorios implementados con Prisma
│   │   │   └── email/               # Notificador SMTP y QrFijo
│   │   │       └── templates/
│   │   │           ├── confirmacion-inscripcion.html
│   │   │           └── qr-placeholder.png
│   │   ├── interfaces/http/         # Rutas, controladores, esquemas Zod, mapeo de errores
│   │   └── main.js                  # Composición (inyección de dependencias) y arranque
│   └── tests/
│       ├── unit/                    # Dominio y casos de uso (con dobles de prueba)
│       └── integration/             # API + base de datos de prueba
├── frontend/
│   ├── src/
│   │   ├── api/                     # Cliente HTTP
│   │   ├── components/              # Componentes del design system (Button, Field...)
│   │   ├── features/inscripcion/    # Pantallas y lógica del flujo de inscripción
│   │   ├── styles/tokens.css        # Design tokens
│   │   └── main.jsx
│   └── tests/
├── docs/
│   ├── consigna.md
│   ├── enunciado.md
│   ├── historia-usuario.md
│   └── decisiones-diseno.md         # Entregable: justificación de decisiones (ADRs)
├── ARCHITECTURE.md
├── DESIGN-SYSTEM.md
└── README.md
```

---

## 4. Separación de responsabilidades

### 4.1 Backend (capas, estilo puertos y adaptadores)

| Capa | Responsabilidad | Puede depender de |
|------|-----------------|-------------------|
| **Dominio** | Entidades y reglas: cupo disponible, talla obligatoria según actividad, horario dentro de la apertura del parque, aceptación de términos, datos válidos del participante. Lanza errores de dominio. | Nada |
| **Aplicación** | Caso de uso `InscribirseActividad`: orquesta obtener el horario, validar con el dominio, reservar cupo, guardar, generar QR y notificar. Define **puertos** (contratos que implementa la infraestructura). | Dominio |
| **Infraestructura** | Implementa los puertos: repositorios Prisma, notificador SMTP (con template HTML), QR fijo, reloj del sistema. | Aplicación, dominio, librerías externas |
| **Interfaces (HTTP)** | Recibe requests, valida forma con Zod, invoca el caso de uso y traduce errores de dominio a códigos HTTP. | Aplicación |

**Puertos definidos en `aplicacion/puertos.js`:**

JavaScript no tiene interfaces, así que cada puerto es un contrato documentado con JSDoc. Cualquier objeto con esos métodos lo cumple (los fakes de las pruebas y los adaptadores reales).

Las dependencias se inyectan por constructor: `new InscribirseActividad({ repositorioHorarios, repositorioInscripciones, notificador, generadorQR, reloj })`.

El **reloj** se inyecta para poder probar casos como "horario pasado" o "parque cerrado" sin depender de la hora real.

### 4.2 Frontend

| Responsabilidad | Detalle |
|-----------------|---------|
| Presentación | Formulario por pasos: 1 - actividad y horario, 2 - cantidad de personas, 3 - datos de cada participante, 4 - términos y confirmación, 5 - resultado. |
| Validación de UX | Campos obligatorios, formato de DNI, talla visible solo si la actividad la requiere. **No reemplaza** la validación del backend. |
| Estado | Estado local del formulario (React Hook Form). Sin store global: no hace falta para un solo flujo. |
| Comunicación | Solo a través de `src/api/`. Los componentes nunca llaman a `fetch` directamente. |
| Errores | Muestra el mensaje que devuelve la API según su `codigo` (ver 5.2). |

El frontend no decide si hay cupo, si el horario es válido ni si se envía el mail. Solo muestra lo que el backend responde.

### 4.3 Email de confirmación y QR

La validación del QR en el parque está fuera del alcance (C-12 de la historia), así que **el QR es una imagen fija** (`qr-placeholder.png`) igual para todas las inscripciones. El criterio de aceptación solo exige que el mail *contenga* un QR, y esto lo cumple.

- El mail se genera desde `infraestructura/email/templates/confirmacion-inscripcion.html`, con placeholders: `{{actividad}}`, `{{fecha}}`, `{{hora}}`, `{{participantes}}`, `{{codigoInscripcion}}`, `{{terminos}}`.
- El QR se adjunta como imagen embebida (`cid:qr`) para que se vea en cualquier cliente de correo.
- Se mantiene el puerto `GeneradorQR`, implementado por `QrFijo`, que devuelve siempre la misma imagen. Si más adelante se valida el QR, se reemplaza por un generador real (por ejemplo, con la librería `qrcode`) sin tocar el caso de uso.
- El mail muestra además el código de la inscripción en texto, que sirve de referencia mientras el QR sea fijo.

---

## 5. API REST

### 5.1 Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/actividades` | Lista las actividades (id, nombre, `requiereTalla`, términos y condiciones). |
| `GET` | `/api/actividades/:id/horarios?fecha=YYYY-MM-DD` | Horarios de la actividad para la fecha, con `cuposDisponibles`. |
| `POST` | `/api/inscripciones` | Crea una inscripción. Respuesta `201` con el resumen. |

**Ejemplo `POST /api/inscripciones`:**

```json
{
  "horarioId": "h-tirolesa-2026-10-15-10",
  "email": "visitante@mail.com",
  "aceptaTerminos": true,
  "participantes": [
    { "nombre": "Ana Pérez", "dni": "40123456", "edad": 25, "talla": "M" },
    { "nombre": "Juan Pérez", "dni": "42123456", "edad": 22, "talla": "L" }
  ]
}
```

La cantidad de personas se deduce de la longitud de `participantes`.

### 5.2 Errores

Formato único: `{ "codigo": "SIN_CUPO", "mensaje": "No hay cupos suficientes para el horario seleccionado." }`

| Código de dominio | HTTP | Prueba de aceptación relacionada |
|-------------------|------|----------------------------------|
| `SIN_CUPO` | 409 | Actividad sin cupo |
| `HORARIO_NO_DISPONIBLE` | 422 | Parque cerrado o actividad no disponible |
| `TERMINOS_NO_ACEPTADOS` | 422 | Sin aceptar términos |
| `TALLA_REQUERIDA` | 422 | Sin talla cuando la actividad la requiere |
| `DATOS_PARTICIPANTE_INVALIDOS` | 422 | Nombre, DNI o edad inválidos |
| `ACTIVIDAD_INEXISTENTE` | 404 | Actividad fuera del listado |
| `SOLICITUD_INVALIDA` | 400 | Body mal formado (Zod) |

---

## 6. Modelo de datos

```prisma
model Actividad {
  id              String    @id
  nombre          String    @unique   // Tirolesa, Safari, Palestra, Jardinería
  requiereTalla   Boolean
  terminos        String
  horarios        Horario[]
}

model Horario {
  id            String        @id
  actividadId   String
  actividad     Actividad     @relation(fields: [actividadId], references: [id])
  inicio        DateTime      // las actividades duran 1 hora
  cupoMaximo    Int
  cupoOcupado   Int           @default(0)
  habilitado    Boolean       @default(true)
  inscripciones Inscripcion[]
}

model Inscripcion {
  id             String         @id @default(uuid())
  horarioId      String
  horario        Horario        @relation(fields: [horarioId], references: [id])
  email          String
  aceptaTerminos Boolean
  creadaEn       DateTime       @default(now())
  participantes  Participante[]
}

model Participante {
  id            String      @id @default(uuid())
  inscripcionId String
  inscripcion   Inscripcion @relation(fields: [inscripcionId], references: [id])
  nombre        String
  dni           String
  edad          Int
  talla         String?
}
```

- **Concurrencia de cupos:** la reserva se hace en una transacción con un `UPDATE ... WHERE cupoOcupado + n <= cupoMaximo`. Si no actualiza ninguna fila, se lanza `SIN_CUPO`. Evita sobreventa si dos personas reservan el último lugar a la vez.
- **Horario del parque:** configurable por variables de entorno (`PARQUE_APERTURA=09:00`, `PARQUE_CIERRE=18:00`) hasta que el PO lo confirme.
- **Ubicación:** el esquema y el seed viven en `backend/database/`. Se configura en `backend/package.json` con `"prisma": { "schema": "database/schema.prisma", "seed": "node database/seed.js" }`.
- **Datos semilla:** `database/seed.js` carga las 4 actividades y horarios de la próxima semana. La administración de actividades queda fuera de la app (lo dice el enunciado).

---

## 7. Desarrollo con TDD

### 7.1 Ciclo

1. **Red:** escribir **una** prueba que exprese un comportamiento todavía no implementado. Ejecutarla y **ver que falla por la razón correcta** (no por un error de compilación ajeno).
2. **Green:** escribir el **código mínimo** para que pase. Se permite hardcodear; la siguiente prueba obliga a generalizar.
3. **Refactor:** mejorar nombres, eliminar duplicación y extraer objetos con todas las pruebas en verde. No se agrega comportamiento en este paso.

Se trabaja con `vitest --watch` abierto durante todo el desarrollo.

### 7.2 Orden de implementación (de adentro hacia afuera)

Se parte del dominio, que es donde están las reglas de la historia, y se avanza hacia afuera:

| Iteración | Prueba (Red) | Capa |
|-----------|--------------|------|
| 1 | Inscribir participantes en un horario con cupo los agrega y descuenta cupo | Dominio |
| 2 | Inscribir más personas que los cupos disponibles lanza `SIN_CUPO` | Dominio |
| 3 | Inscribir sin aceptar términos lanza `TERMINOS_NO_ACEPTADOS` | Dominio |
| 4 | Actividad que requiere talla sin talla lanza `TALLA_REQUERIDA` | Dominio |
| 5 | Actividad que no requiere talla permite participante sin talla | Dominio |
| 6 | Horario fuera de la apertura del parque o deshabilitado lanza `HORARIO_NO_DISPONIBLE` | Dominio (con `Reloj` falso) |
| 7 | Horario en el pasado lanza `HORARIO_NO_DISPONIBLE` | Dominio |
| 8 | Participante con DNI, edad o nombre inválido lanza `DATOS_PARTICIPANTE_INVALIDOS` | Dominio |
| 9 | Caso de uso: inscripción exitosa guarda y llama al notificador con un QR | Aplicación (dobles de prueba) |
| 9b | El template de confirmación se completa con los datos de la inscripción y referencia la imagen del QR | Infraestructura |
| 10 | Caso de uso: si falla una regla no se guarda ni se notifica | Aplicación |
| 11 | `POST /api/inscripciones` devuelve 201 / códigos de error de la tabla 5.2 | Integración (Supertest + SQLite en memoria) |
| 12 | Reserva concurrente del último cupo: solo una tiene éxito | Integración |
| 13 | El formulario muestra el campo talla solo si la actividad lo requiere | Frontend |
| 14 | El botón confirmar queda deshabilitado sin aceptar términos | Frontend |
| 15 | Se muestra el mensaje de error de la API (`SIN_CUPO`, etc.) | Frontend (MSW) |

Las iteraciones 1 a 8 cubren las 6 pruebas de aceptación de la historia de usuario.

### 7.3 Evidencia del ciclo en Git

Cada paso del ciclo es un commit, para que el historial muestre el proceso:

```
test(dominio): [RED] inscribir sin cupo lanza SIN_CUPO
feat(dominio): [GREEN] validar cupo disponible en inscripción
refactor(dominio): [REFACTOR] extraer Horario.reservar(cantidad)
```

### 7.4 Tipos de prueba y dobles

| Tipo | Qué cubre | Dobles |
|------|-----------|--------|
| Unitarias de dominio | Reglas puras | Ninguno |
| Unitarias de aplicación | Orquestación del caso de uso | **Fakes** en memoria para repositorios; **spy** para `Notificador`; **stub** para `Reloj` y `GeneradorQR` |
| Integración | API + base real (SQLite en memoria / archivo temporal) | Notificador falso que guarda los mails enviados |
| Frontend | Comportamiento de la UI | MSW para la API |
| E2E (opcional) | Pruebas de aceptación completas | Mailpit para verificar el mail recibido |

### 7.5 Convenciones de pruebas

- Estructura **AAA** (Arrange, Act, Assert) separada por líneas en blanco.
- Nombres en español, describiendo el comportamiento: `it('rechaza la inscripción si no se aceptan los términos')`.
- Un comportamiento por prueba. Varias aserciones están bien si verifican el mismo comportamiento.
- **Builders** de datos de prueba (`unaInscripcion().conParticipantes(2).sinTerminos().build()`) para no repetir objetos largos.
- Las pruebas no dependen del orden ni de la fecha real.
- **Cobertura mínima:** 90% de líneas en `dominio/` y `aplicacion/`; 70% global. La cobertura es un indicador, no un objetivo: no se escriben pruebas solo para subirla.

---

## 8. Convenciones de desarrollo

### 8.1 Código

- **Idioma:** términos del dominio en **español** (`Inscripcion`, `Participante`, `cupoDisponible`), igual que en la historia de usuario. Los roles técnicos también se nombran en español cuando suena natural (`RepositorioHorarios`, `Notificador`); lo que viene de librerías o del framework queda en inglés.
- **Nombres:** `PascalCase` para clases y componentes; `camelCase` para variables y funciones; `UPPER_SNAKE_CASE` para constantes y códigos de error; archivos en `camelCase.js` y componentes en `PascalCase.jsx`.
- **Módulos ES:** `"type": "module"` en cada `package.json`; siempre `import`/`export`, nunca `require`.
- **JSDoc** en clases y funciones públicas del dominio y la aplicación (parámetros, retorno y errores que lanza).
- `const` por defecto, `let` solo si se reasigna, nunca `var`. Comparaciones con `===`.
- Validar los datos de entrada en los bordes (Zod en HTTP, constructores en el dominio), ya que no hay chequeo de tipos.
- Funciones cortas (idealmente menos de 20 líneas) y con una sola responsabilidad.
- Sin números mágicos: `MAX_PARTICIPANTES`, `DURACION_ACTIVIDAD_MIN`.
- Los errores de dominio son clases que extienden `ErrorDominio` con un `codigo`. Nunca se lanza `Error` genérico desde el dominio.
- Comentarios solo para explicar el **por qué**, no el qué.
- **Formato:** Prettier (2 espacios, comillas simples, `;`, ancho 100). **Lint:** ESLint con `eslint:recommended`, `eslint-plugin-react`, `eslint-plugin-react-hooks` y `eslint-plugin-jsdoc`.

### 8.2 Git

- Rama principal `main`, protegida. Trabajo en ramas `feature/<descripcion>` o `test/<descripcion>`.
- **Conventional Commits** con la etiqueta del paso TDD (ver 7.3).
- Pull request con: descripción, pruebas agregadas y checklist de la Definición de Done.
- Hooks de Husky: `lint-staged` (lint + format) en pre-commit; `vitest run` en pre-push.

### 8.3 Scripts

| Comando | Acción |
|---------|--------|
| `npm run dev` | Levanta back (puerto 3000) y front (puerto 5173) |
| `npm test` | Corre todas las pruebas |
| `npm run test:watch` | Modo TDD |
| `npm run test:coverage` | Reporte de cobertura |
| `npm run lint` | ESLint + Prettier check |
| `npm run db:migrate` / `npm run db:seed` | Migraciones y datos de ejemplo |

### 8.4 Configuración

Variables en `.env` (con `.env.example` versionado, sin secretos): `DATABASE_URL`, `SMTP_HOST`, `SMTP_PORT`, `MAIL_FROM`, `PARQUE_APERTURA`, `PARQUE_CIERRE`.
