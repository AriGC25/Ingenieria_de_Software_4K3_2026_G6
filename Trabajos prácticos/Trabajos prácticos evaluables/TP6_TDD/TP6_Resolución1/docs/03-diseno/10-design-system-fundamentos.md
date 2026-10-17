# Design system: fundamentos

Guía de estilos visuales de EcoHarmony Park. Los componentes están en [componentes](12-componentes.md) y la implementación técnica (React, CSS Modules) en la [arquitectura del frontend](06-arquitectura-frontend.md).

## Principios

1. **Natural y calmo:** la identidad remite a un bioparque; se usa la paleta de verdes y crema que definió el PO, sin estridencias.
2. **Mobile first:** el PO pidió una app móvil y aceptó una web responsive (RNF-01). Se diseña para 360 px de ancho y se expande a escritorio.
3. **Un paso a la vez:** la inscripción se divide en pasos cortos para reducir errores.
4. **Claridad en los errores:** cada error dice qué pasó y qué hacer, junto al campo afectado.
5. **Accesible por defecto:** contraste AA, uso con teclado y etiquetas en todos los campos (S-24).

## Design tokens

Se definen como variables CSS en `frontend/src/styles/tokens.css`. Los componentes **solo** usan tokens, nunca valores sueltos.

### Color

La paleta la definió el PO ([coolors](https://coolors.co/palette/386641-6a994e-a7c957-f2e8cf-bc4749), RNF-02). Los tokens que no son de la paleta se **derivan** de ella (más oscuros o más claros) o son neutros. Esta versión es solo de **tema claro**: el modo oscuro queda fuera de alcance.

| Token | Valor | Origen | Uso |
|-------|-------|--------|-----|
| `--color-primario` | `#386641` | Paleta | Botón principal, enlaces, paso activo, encabezado |
| `--color-primario-hover` | `#2A4D31` | Derivado | Hover y foco del primario |
| `--color-secundario` | `#6A994E` | Paleta | Acentos informativos (cupos), íconos y bordes activos |
| `--color-acento` | `#A7C957` | Paleta | Destacados; siempre con texto oscuro |
| `--color-fondo` | `#F2E8CF` | Paleta | Fondo de la página |
| `--color-superficie` | `#FFFFFF` | Neutro | Tarjetas, formularios, modal |
| `--color-borde` | `#D9CDA9` | Derivado | Bordes de inputs y tarjetas |
| `--color-texto` | `#1F2A1F` | Neutro | Texto principal |
| `--color-texto-secundario` | `#4A5A48` | Derivado | Ayudas y descripciones |
| `--color-exito` | `#386641` | Paleta | Confirmación de inscripción |
| `--color-error` | `#BC4749` | Paleta | Errores de validación y de la API |
| `--color-advertencia` | `#9A5B00` | Derivado | Avisos (por ejemplo, un turno no disponible) |
| `--color-deshabilitado` | `#B5AE98` | Derivado | Controles deshabilitados |

Cada combinación texto/fondo debe cumplir contraste **WCAG AA** (4.5:1 para texto normal): texto blanco sobre `--color-primario` y `--color-error`, y texto oscuro sobre `--color-acento`, `--color-secundario` y `--color-fondo`. `--color-secundario` no se usa como color de texto sobre fondos claros. Los valores derivados se verifican con una herramienta de contraste antes de cerrar. El color nunca es la única señal: los estados se acompañan con ícono o texto.

**Color por actividad** (identificación en las tarjetas, siempre junto al nombre; quedan fuera de la paleta del PO porque hacen falta cuatro tonos distintos):

| Actividad | Token | Valor |
|-----------|-------|-------|
| Tirolesa | `--color-tirolesa` | `#6A1B9A` |
| Safari | `--color-safari` | `#8D6E63` |
| Palestra | `--color-palestra` | `#D84315` |
| Jardinería | `--color-jardineria` | `#558B2F` |

### Tipografía

- **Familia:** `"Lato", system-ui, sans-serif` (Google Fonts), la fuente que indicó el PO. Pesos 400, 600 y 700.
- **Base:** 16 px; altura de línea 1.5.

| Token | Tamaño y peso | Uso |
|-------|---------------|-----|
| `--texto-h1` | 28 px / 700 | Título de pantalla |
| `--texto-h2` | 22 px / 700 | Título de paso o sección |
| `--texto-h3` | 18 px / 600 | Título de tarjeta |
| `--texto-cuerpo` | 16 px / 400 | Texto general e inputs |
| `--texto-chico` | 14 px / 400 | Ayudas y mensajes de error |
| `--texto-etiqueta` | 14 px / 600 | Labels de campos |

### Espaciado, bordes y sombras

- **Escala de espaciado (múltiplos de 4):** `--esp-1: 4px`, `--esp-2: 8px`, `--esp-3: 12px`, `--esp-4: 16px`, `--esp-6: 24px`, `--esp-8: 32px`, `--esp-12: 48px`.
- **Radios:** `--radio-chico: 6px` (inputs), `--radio-medio: 12px` (tarjetas, botones, modal), `--radio-total: 999px` (chips).
- **Sombras:** `--sombra-1: 0 1px 3px rgb(0 0 0 / 0.08)` para tarjetas; `--sombra-2: 0 4px 12px rgb(0 0 0 / 0.12)` para elementos elevados (modal).
- **Margen lateral de página:** 16 px en móvil, con el contenido centrado y un ancho máximo de 640 px en escritorio.

### Breakpoints

| Nombre | Desde | Cambio de layout |
|--------|-------|------------------|
| `movil` | 0 | Una columna, botones a ancho completo |
| `tablet` | 600 px | Tarjetas de actividad en 2 columnas |
| `escritorio` | 1024 px | Contenido centrado, resumen lateral fijo en la confirmación |

### Movimiento

Transiciones de 150 ms (`ease-out`) en hover y foco. Se respeta `prefers-reduced-motion`.
