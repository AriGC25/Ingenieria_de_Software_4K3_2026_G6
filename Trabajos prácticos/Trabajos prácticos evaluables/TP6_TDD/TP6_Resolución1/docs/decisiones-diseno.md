# Decisiones de diseño

Entregable del TP 6. Justifica las decisiones de diseño de la implementación de la historia **"Inscribirme a actividad"**: por qué el sistema está construido así y qué alternativas se descartaron. El detalle de cada decisión está en la [fase de diseño](03-diseno/README.md); acá se reúnen las razones, junto con las decisiones que surgieron al implementar.

## 1. Arquitectura

### Puertos y adaptadores en el backend

El backend se divide en cuatro capas: dominio, aplicación, infraestructura e interfaces HTTP ([arquitectura del backend](03-diseno/03-arquitectura-backend.md)). El dominio no depende de nada externo: ni de la base, ni del servidor, ni del correo, **ni siquiera de la hora**, que entra por el puerto `Reloj`.

| Motivo | Consecuencia en el trabajo |
|--------|----------------------------|
| TDD necesita pruebas rápidas y deterministas | Las 120 pruebas del dominio corren en milisegundos, sin base de datos ni servidor, con fechas fijas |
| Las reglas de negocio son la parte con más casos (ventana de 24 h y 15 min, cupos, edades, talles, superposición) | Viven en un solo lugar (`dominio/`) y se prueban con todos sus valores límite |
| Hay tres entornos con adaptadores distintos (pruebas, desarrollo y demo) | El mismo caso de uso funciona con un notificador en memoria, con Mailpit o con Gmail, y con SQLite o con Turso, sin cambios |

Alternativa descartada: un backend en capas "clásico", con la lógica en los controladores o en los modelos de Prisma. Mezclaba las reglas con el framework y obligaba a probar todo con base de datos.

### Puertos como contratos JSDoc

JavaScript no tiene interfaces. Cada puerto es un contrato documentado en `aplicacion/puertos.js`, y cualquier objeto con esos métodos lo cumple: los adaptadores reales y los dobles de prueba (fakes de repositorios, spy del notificador, stubs del reloj, del QR y del código). Así, los casos de uso se probaron con dobles antes de que existiera la infraestructura.

### Frontend sin reglas de negocio

El frontend valida la forma de los datos para dar una buena experiencia: todos los errores de un paso a la vez y el foco en el primero. Pero **no decide** nada del negocio: el cupo, la ventana, las fechas que se ofrecen y el envío del mail los resuelve el backend ([arquitectura del frontend](03-diseno/06-arquitectura-frontend.md)). Por eso existe `GET /api/fechas` (DD-01): con la demo en una fecha fija, el navegador no puede calcular "hoy".

## 2. Proceso: TDD

- **De adentro hacia afuera:** dominio, aplicación, infraestructura, HTTP y frontend. Cada capa se construyó sobre otra ya probada.
- **Evidencia en Git:** cada ciclo tiene sus commits `[RED]`, `[GREEN]` y `[REFACTOR]`. En total hay 35 ciclos con RED y GREEN y 30 refactorizaciones (los ciclos de configuración inicial y algunos de componentes muy chicos no tuvieron nada que refactorizar).
- **Los RED fallan por la razón correcta:** antes de cada commit `[RED]` se verificó que la prueba fallara por el comportamiento faltante. Las fallas por un error de la propia prueba se corrigieron antes de seguir.
- **Ciclos agrupados:** cada ciclo cubre un comportamiento con varios casos (`it.each` con los valores límite), en lugar de un commit por cada fila de la tabla de casos. El historial queda legible y cada ciclo sigue siendo chico.
- **Lo que no se hizo con TDD:** la configuración (fase 0), los tokens y estilos CSS, y el logo, como define la [forma de trabajo](04-implementacion/02-forma-de-trabajo.md). Las pruebas de concurrencia y de falla del mail en la API (HTTP-50 a HTTP-52) y las E2E pasaron en verde desde el primer momento: verifican de punta a punta comportamientos ya construidos en las capas internas, y se commitearon como `test(...)`, sin la etiqueta `[RED]`.

### Resultado

| Paquete | Pruebas | Cobertura de líneas |
|---------|---------|---------------------|
| Backend: dominio y aplicación | 147 unitarias | 100% (mínimo exigido: 90%) |
| Backend completo | 283 (unitarias e integración con SQLite real) | 99,9% (mínimo exigido: 70%) |
| Frontend | 95 (componentes y flujo con MSW) | 98,2% |
| E2E | 8 (Playwright con Mailpit y axe) | — |

Cada prueba de aceptación (PA-01 a PA-31) tiene al menos un caso automatizado ([trazabilidad](04-implementacion/09-trazabilidad-y-riesgos.md)).

## 3. Decisiones del diseño

Se tomaron en la fase de diseño y se mantuvieron en la implementación.

| ID | Decisión | Por qué |
|----|----------|---------|
| DD-01 | `GET /api/fechas` devuelve hoy y mañana según el reloj del servidor | Con `RELOJ_FIJO` en la demo, el frontend no puede calcular "hoy" |
| DD-02 | El turno guarda su propio `cupoMaximo` | Cambiar el cupo de una actividad no altera los turnos ya cargados |
| DD-03 | `@@unique([actividadId, inicio])` en el turno | Evita turnos duplicados y hace repetible el seed |
| DD-04 | El mail se envía después de confirmar la transacción y, si falla, la inscripción se anula | No se bloquean los cupos de un turno mientras responde el servidor de correo, y no quedan inscripciones a medias (INT-05) |
| DD-05 | La forma del request se valida con Zod (400) y las reglas de negocio en el dominio (422 o 409) | Separa un cliente mal hecho de un visitante que cargó un dato inválido; el tope de 50 participantes protege la API pública |
| DD-06 | Hasta 3 reintentos si el código de inscripción ya existe | Una colisión es muy improbable; no se justifica un bucle sin límite |
| DD-07 | Un único formulario compartido por los pasos | Volver a un paso conserva los datos (S-33) |
| DD-08 | Una ruta por paso, y `/validar-inscripcion` pública | Permite recargar un paso y abrir el QR sin sesión |
| DD-09 | Mensajes específicos por campo cuando el código es genérico | El visitante necesita saber qué dato corregir |

### Concurrencia de cupos

La reserva es una actualización condicional dentro de una transacción:

```sql
UPDATE Turno SET cupoOcupado = cupoOcupado + :n
WHERE id = :turnoId AND cupoOcupado + :n <= cupoMaximo
```

Si no actualiza ninguna fila, no había cupo (`SIN_CUPO`). Se eligió en lugar de "leer, comparar y escribir" porque esa secuencia permite que dos visitantes tomen el último lugar a la vez. Lo verifican REPO-04 (20 reservas simultáneas sobre 8 cupos: 8 exitosas y el cupo final exacto) y HTTP-50.

## 4. Decisiones tomadas al implementar

Surgieron durante la construcción y no estaban definidas en el diseño.

| ID | Decisión | Por qué |
|----|----------|---------|
| DI-01 | El cliente de Prisma se transpila a JavaScript con esbuild después de `prisma generate` (`backend/scripts/compilarClientePrisma.js`, en el `postinstall`) | Prisma 7 genera el cliente en TypeScript y Node 22 no lo carga sin compilar (`ERR_MODULE_NOT_FOUND`). Transpilarlo una vez sirve igual en local, en las pruebas y en Vercel, sin sumar un compilador al proyecto |
| DI-02 | Las migraciones de Prisma se aplican con una función propia, `aplicarMigraciones`, que registra las aplicadas en `_migraciones` | `prisma migrate` no corre contra Turso. La misma función prepara las bases de las pruebas de integración, así que queda probada (MIG-01 y MIG-02) antes de usarla con Turso |
| DI-03 | La composición vive en `composicion.js`, separada de `main.js` | Las pruebas de integración usan la misma composición que producción (perfil de mail `pruebas`, reloj fijo y base temporal); `main.js` solo lee el entorno y escucha |
| DI-04 | El motivo de un día cerrado es el nombre del día configurado (`lunes`) o `feriado`, y el feriado tiene prioridad | Respeta la API (`lunes` o `feriado`) y sigue funcionando si se configuran otros días cerrados |
| DI-05 | Un turno de un día cerrado está `no_disponible` con el motivo `parque_cerrado` | El seed no carga turnos en días cerrados, pero si se cambia la configuración después de cargarlos, el dominio igual los rechaza (INS-09) |
| DI-06 | `SOLICITUD_INVALIDA` indica el primer campo inválido (por ejemplo, `participantes[0].edad`), con el mismo formato que los errores del dominio | Facilita depurar un cliente mal hecho; el formato es el único de la API |
| DI-07 | Un JSON roto responde `400 SOLICITUD_INVALIDA`; una ruta inexistente, `404 RUTA_INEXISTENTE`; un error inesperado, `500 ERROR_INTERNO`, siempre con el formato `{ codigo, mensaje }` | Ninguna respuesta de la API deja ver detalles internos (HTTP-44 y HTTP-45) |
| DI-08 | El email también se valida en el dominio (`SOLICITUD_INVALIDA`, campo `email`) | La forma ya lo filtra con Zod, pero el dominio no confía en quién lo llama (INS-04) |
| DI-09 | En las actividades sin talle, la respuesta 201 devuelve `talle: null` | Hace visible que el talle enviado se descartó (INT-06) |
| DI-10 | Las actividades se listan por nombre | El esquema no tiene un campo de orden; el orden alfabético es estable y predecible |
| DI-11 | El frontend replica el catálogo de mensajes en lugar de compartir los esquemas con el backend | Lo pide la arquitectura del frontend: sus validaciones son solo de experiencia de uso. El backend sigue siendo la fuente de verdad y su mensaje se muestra tal cual |
| DI-12 | Si la confirmación falla por un dato, la pantalla vuelve al paso de ese campo y lo enfoca; si falla el envío del mail, va al resultado con "Reintentar" | Cumple el manejo de errores del diseño sin perder los datos cargados (S-39) |
| DI-13 | El botón "Confirmar inscripción" deshabilitado dice por qué ("Para confirmar, aceptá los términos y condiciones.") | La regla del design system pide que un control deshabilitado explique el motivo; apareció en la revisión visual |
| DI-14 | El texto del logo SVG lleva `textLength` | Dentro de un `<img>`, el SVG no usa las fuentes de la página y el nombre se cortaba con la fuente de reemplazo |
| DI-15 | El logo PNG del mail se genera desde el SVG con `@resvg/resvg-js` (`scripts/generarLogoPng.js`) | Los clientes de correo no muestran SVG; generarlo desde la misma fuente evita dos logos distintos |
| DI-16 | `.vercelignore` explícito | Garantiza que `backend/.env` y las bases locales no se suban con la CLI de Vercel |
| DI-17 | Husky se instala desde la raíz del repositorio, que es la carpeta de toda la materia | El proyecto vive en una subcarpeta; `scripts/instalar-hooks.js` configura los hooks sin afectar el resto del repositorio |

## 5. Calidad de la interfaz

- **Accesibilidad verificada, no solo declarada:** además de buscar los elementos por rol en las pruebas, un análisis con axe (WCAG 2.1 AA) recorre las pantallas en el E2E. Encontró un problema real: el texto de los términos tenía scroll y no se podía recorrer con el teclado. Se corrigió con un ciclo TDD (CMP-10) ([checklist](03-diseno/15-accesibilidad.md)).
- **Revisión visual en móvil (360 px) y escritorio:** encontró que el turno elegido perdía el contraste al pasar el mouse, que la selección de la actividad era poco visible y que el logo se cortaba. Se corrigieron en los estilos.
- **E2E con el sistema completo:** Playwright recorre el flujo con el backend, el frontend, SQLite, `RELOJ_FIJO` y Mailpit en Docker. Verifica el mail recibido (asunto, detalle, código, logo y QR embebidos, QR adjunto) y decodifica el QR para abrir la pantalla de validación.

## 6. Pendientes

- **Despliegue de la demo en Vercel y Turso (fase 9):** la configuración está lista (`vercel.json`, `.vercelignore`, `api/index.js` y los scripts de migración y seed para Turso). Falta ejecutar el [procedimiento](06-despliegue/03-procedimiento.md) con las credenciales del equipo y la prueba completa desde un celular.
- **Validación del PO:** los textos de los términos (`backend/src/infraestructura/database/datosMaestros.js`) y el logo (`frontend/src/assets/`) se envían al PO (RNF-03 y RNF-04).
- **Revisión de código por otro integrante** (Definición de Done).
