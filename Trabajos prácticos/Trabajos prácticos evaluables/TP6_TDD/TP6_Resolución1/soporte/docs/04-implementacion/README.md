# Implementación: Inscribirme a actividad

Plan para construir la historia con TDD, fase por fase, respetando el [diseño](../03-diseno/README.md) y el [análisis funcional](../02-analisis/README.md). Incluye el catálogo de casos de prueba automatizados por capa. El diseño de las pruebas (clases de equivalencia, límites y casos derivados) está en la [fase de testing](../05-testing/README.md).

## Documentos de esta fase

| Documento | Contenido |
|-----------|-----------|
| [01-estrategia-tdd.md](01-estrategia-tdd.md) | Ciclo Red-Green-Refactor, evidencia en Git, tipos de prueba y convenciones |
| [02-forma-de-trabajo.md](02-forma-de-trabajo.md) | Ramas, commits y reglas para avanzar |
| [03-fases.md](03-fases.md) | Las diez fases de construcción, de la configuración inicial a la entrega |
| [04-casos-dominio.md](04-casos-dominio.md) | Casos de prueba del dominio |
| [05-casos-aplicacion.md](05-casos-aplicacion.md) | Casos de prueba de los casos de uso |
| [06-casos-infraestructura.md](06-casos-infraestructura.md) | Casos de prueba de la infraestructura |
| [07-casos-http.md](07-casos-http.md) | Casos de prueba de la API (integración) |
| [08-casos-frontend.md](08-casos-frontend.md) | Casos de prueba del frontend y de punta a punta |
| [09-trazabilidad-y-riesgos.md](09-trazabilidad-y-riesgos.md) | Pruebas de aceptación contra los casos automatizados, y riesgos |

## Resumen de las fases

| Fase | Contenido | Resultado verificable |
|------|-----------|-----------------------|
| 0 | Configuración inicial y esqueleto desplegable | `npm test`, `npm run lint` y `npm run dev` funcionan; `GET /api/salud` responde en Vercel |
| 1 | Dominio | Reglas con pruebas unitarias; ≥ 90% de cobertura |
| 2 | Aplicación | Casos de uso con dobles de prueba; ≥ 90% de cobertura |
| 3 | Infraestructura | Configuración, reloj, código, QR, plantilla, notificadores, repositorios y seed |
| 4 | HTTP y composición | Los cuatro endpoints con Supertest sobre SQLite real; mapeo completo de errores |
| 5 | Diseño visual base | Tokens, Lato, logo y componentes con pruebas |
| 6 | Frontend: sesión, rutas y pantallas auxiliares | Ingreso simulado, encabezado, validación simulada |
| 7 | Frontend: flujo de inscripción | Los pasos de actividad, horario, participantes, confirmación (con el modal de términos) y resultado, contra MSW |
| 8 | Integración completa y E2E | PA-01 a PA-06 con Playwright sobre la aplicación corriendo |
| 9 | Despliegue de la demo y entrega | Demo en Vercel y Turso; documentación y Definición de Done completas |
