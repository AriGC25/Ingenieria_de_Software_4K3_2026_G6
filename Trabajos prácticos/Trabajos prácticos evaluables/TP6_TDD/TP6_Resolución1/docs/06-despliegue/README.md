# Despliegue de la demo

Cómo se despliega el sistema para la demo con los PO, qué se validó antes de implementar y cómo repetirlo con el sistema real. El diseño está en la [fase de diseño](../03-diseno/08-configuracion-y-despliegue.md) y las pruebas de la demo, en [implementación](../04-implementacion/03-fases.md).

## Documentos de esta fase

| Documento | Contenido |
|-----------|-----------|
| [01-decision-y-prueba.md](01-decision-y-prueba.md) | Servicios elegidos, alternativas descartadas, resultado de la prueba y hallazgos |
| [02-configuracion-de-la-demo.md](02-configuracion-de-la-demo.md) | Variables de entorno, reloj fijo y datos de la demo |
| [03-procedimiento.md](03-procedimiento.md) | Pasos detallados: Gmail, Turso, migraciones, seed, Vercel y prueba |
| [04-riesgos-y-limpieza.md](04-riesgos-y-limpieza.md) | Pendientes por validar, plan B, seguridad y limpieza |
| [05-despliegue-realizado.md](05-despliegue-realizado.md) | URL pública, verificación, hallazgos y cómo fijar el reloj el día de la demo |

## Resumen

| Componente | Servicio |
|------------|----------|
| Frontend (estático) y backend (Express como función) | **Vercel**, plan Hobby |
| Base de datos | **Turso** (libSQL), plan gratuito |
| Correo | **Gmail SMTP** con contraseña de aplicación |
| Plan B | Notebook con túnel de Cloudflare |

La demo está publicada en <https://ecoharmony-park-eight.vercel.app> ([despliegue realizado](05-despliegue-realizado.md)).
