# Estructura del proyecto

Monorepo con dos paquetes (`backend` y `frontend`) y la documentación en `docs/`.

```
TP6_Resolución1/
├── package.json                     # Workspaces y scripts globales
├── vercel.json                      # Build, salida del frontend y reescrituras
├── api/
│   └── index.js                     # Entrada de Vercel: reexporta la app del backend
├── backend/
│   ├── database/                    # Todo lo de base de datos en un solo lugar
│   │   ├── schema.prisma
│   │   ├── seed.js                  # Actividades, términos y turnos de los próximos días
│   │   └── migraciones/             # SQL generado por Prisma
│   ├── src/
│   │   ├── dominio/                 # Reglas de negocio puras (sin dependencias)
│   │   │   ├── constantes.js        # Turnos, ventana, talles, formatos y límites
│   │   │   ├── actividad.js
│   │   │   ├── turno.js             # Cupos y estado de un turno
│   │   │   ├── participante.js
│   │   │   ├── inscripcion.js       # Regla completa de inscripción
│   │   │   ├── calendarioParque.js  # Días y horario de apertura (configurables)
│   │   │   ├── ventanaInscripcion.js
│   │   │   └── errores.js           # Errores de dominio (clases con código)
│   │   ├── aplicacion/              # Casos de uso y puertos (contratos)
│   │   │   ├── listarActividades.js
│   │   │   ├── consultarFechas.js
│   │   │   ├── consultarTurnos.js
│   │   │   ├── inscribirseActividad.js
│   │   │   └── puertos.js           # Contratos en JSDoc
│   │   ├── infraestructura/         # Adaptadores concretos de los puertos
│   │   │   ├── database/            # Repositorios implementados con Prisma
│   │   │   ├── email/               # Notificadores por perfil, plantilla y renderizador
│   │   │   │   └── templates/
│   │   │   │       ├── confirmacion-inscripcion.html
│   │   │   │       └── logo.png
│   │   │   ├── qrFijo.js
│   │   │   ├── generadorCodigo.js
│   │   │   └── reloj.js             # Reloj del sistema y reloj fijo
│   │   ├── interfaces/http/         # Rutas, controladores, esquemas Zod, mapeo de errores
│   │   ├── configuracion.js         # Lee y valida las variables de entorno
│   │   └── main.js                  # Composición (inyección de dependencias) y arranque
│   └── tests/
│       ├── unit/                    # Dominio y casos de uso (con dobles de prueba)
│       ├── integration/             # API + base de datos de prueba
│       ├── builders/                # Datos de prueba
│       └── dobles/                  # Fakes, spies y stubs
├── frontend/
│   ├── src/
│   │   ├── api/                     # Cliente HTTP
│   │   ├── components/              # Componentes del design system (Button, TextField...)
│   │   ├── features/
│   │   │   ├── sesion/              # Ingreso simulado y ruta protegida
│   │   │   ├── inscripcion/         # Pasos del flujo de inscripción y su estado
│   │   │   └── validacion/          # Pantalla simulada a la que apunta el QR
│   │   ├── assets/                  # Logo (logo.svg, logo-simbolo.svg)
│   │   ├── styles/tokens.css        # Design tokens
│   │   ├── main.jsx
│   │   └── rutas.jsx
│   └── tests/
├── docs/                            # Una carpeta por fase; los archivos van numerados
│   ├── 00-dominio/                  # Consigna, enunciado, historia de usuario y respuestas del PO
│   ├── 01-requerimientos/           # Requisitos, reglas de negocio, flujos y ambigüedades
│   ├── 02-analisis/                 # Modelo de dominio, casos de uso, validaciones, pantallas y mail
│   ├── 03-diseno/                   # Arquitectura y design system
│   ├── 04-implementacion/           # Plan de implementación y estrategia TDD
│   ├── 05-testing/                  # Análisis de casos de prueba
│   ├── 06-despliegue/               # Despliegue de la demo
│   ├── supuestos.md                 # Supuestos y definiciones de todas las fases
│   └── decisiones-diseno.md         # Entregable: justificación de las decisiones de diseño
└── README.md
```

## Notas

- Los términos y condiciones **no tienen una vista propia** en el frontend: se muestran en un modal dentro del paso de confirmación (D-07), con el texto que llega en `GET /api/actividades`.
- La entrada de Vercel (`api/index.js`) y `vercel.json` se detallan en [configuración y despliegue](08-configuracion-y-despliegue.md).
- El `.env` de cada paquete no se versiona; `.env.example` sí, sin secretos.
