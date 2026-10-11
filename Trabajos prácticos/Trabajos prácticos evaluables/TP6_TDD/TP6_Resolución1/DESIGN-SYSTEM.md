# DESIGN-SYSTEM de EcoHarmony Park

Guía de estilos visuales y de interfaz para el frontend de inscripción a actividades. Define los tokens de diseño, los componentes, sus estados, la accesibilidad y el tono de los textos. La implementación técnica (React, CSS Modules) está en [ARCHITECTURE.md](ARCHITECTURE.md).

---

## 1. Principios

1. **Natural y calmo:** la identidad remite a un bioparque; colores de vegetación, agua y tierra, sin estridencias.
2. **Mobile first:** el enunciado plantea una app móvil. Se diseña para 360 px de ancho y se expande a escritorio.
3. **Un paso a la vez:** la inscripción se divide en pasos cortos para reducir errores.
4. **Claridad en los errores:** cada error dice qué pasó y qué hacer, junto al campo afectado.
5. **Accesible por defecto:** contraste AA, navegación con teclado y etiquetas en todos los campos.

---

## 2. Design tokens

Se definen como variables CSS en `frontend/src/styles/tokens.css`. Los componentes **solo** usan tokens, nunca valores sueltos.

### 2.1 Color

| Token | Claro | Oscuro | Uso |
|-------|-------|--------|-----|
| `--color-primario` | `#2E7D32` | `#66BB6A` | Botón principal, enlaces, paso activo |
| `--color-primario-hover` | `#1B5E20` | `#81C784` | Hover / foco del primario |
| `--color-secundario` | `#0277BD` | `#4FC3F7` | Acentos informativos (horarios, cupos) |
| `--color-acento` | `#F9A825` | `#FFD54F` | Destacados ("¡Últimos cupos!") |
| `--color-fondo` | `#F7F9F4` | `#121812` | Fondo de la página |
| `--color-superficie` | `#FFFFFF` | `#1C241C` | Tarjetas, formularios |
| `--color-borde` | `#D5DDD0` | `#33402F` | Bordes de inputs y tarjetas |
| `--color-texto` | `#1F2A1F` | `#E8EFE6` | Texto principal |
| `--color-texto-secundario` | `#5A6B58` | `#A9B8A6` | Ayudas, descripciones |
| `--color-exito` | `#2E7D32` | `#66BB6A` | Confirmación de inscripción |
| `--color-error` | `#C62828` | `#EF9A9A` | Errores de validación y de la API |
| `--color-advertencia` | `#E65100` | `#FFB74D` | Pocos cupos, avisos |
| `--color-deshabilitado` | `#B8C2B5` | `#4A5547` | Controles deshabilitados |

Cada combinación texto/fondo cumple contraste **WCAG AA** (4.5:1 para texto normal). El color nunca es la única señal: los estados se acompañan con ícono o texto.

**Color por actividad** (identificación en tarjetas, siempre junto al nombre):

| Actividad | Token | Valor |
|-----------|-------|-------|
| Tirolesa | `--color-tirolesa` | `#6A1B9A` |
| Safari | `--color-safari` | `#8D6E63` |
| Palestra | `--color-palestra` | `#D84315` |
| Jardinería | `--color-jardineria` | `#558B2F` |

### 2.2 Tipografía

- **Familia:** `"Nunito", system-ui, sans-serif` (Google Fonts). Redondeada y amigable, buena legibilidad en móvil.
- **Base:** 16 px; altura de línea 1.5.

| Token | Tamaño / peso | Uso |
|-------|---------------|-----|
| `--texto-h1` | 28 px / 700 | Título de pantalla |
| `--texto-h2` | 22 px / 700 | Título de paso o sección |
| `--texto-h3` | 18 px / 600 | Título de tarjeta |
| `--texto-cuerpo` | 16 px / 400 | Texto general, inputs |
| `--texto-chico` | 14 px / 400 | Ayudas, mensajes de error |
| `--texto-etiqueta` | 14 px / 600 | Labels de campos |

### 2.3 Espaciado, bordes y sombras

- **Escala de espaciado (múltiplos de 4):** `--esp-1: 4px`, `--esp-2: 8px`, `--esp-3: 12px`, `--esp-4: 16px`, `--esp-6: 24px`, `--esp-8: 32px`, `--esp-12: 48px`.
- **Radios:** `--radio-chico: 6px` (inputs), `--radio-medio: 12px` (tarjetas, botones), `--radio-total: 999px` (chips).
- **Sombras:** `--sombra-1: 0 1px 3px rgb(0 0 0 / 0.08)` para tarjetas; `--sombra-2: 0 4px 12px rgb(0 0 0 / 0.12)` para elementos elevados.
- **Margen lateral de página:** 16 px en móvil, contenido centrado con ancho máximo de 640 px en escritorio.

### 2.4 Breakpoints

| Nombre | Desde | Cambio de layout |
|--------|-------|------------------|
| `movil` | 0 | Una columna, botones a ancho completo |
| `tablet` | 600 px | Tarjetas de actividad en 2 columnas |
| `escritorio` | 1024 px | Contenido centrado, resumen lateral fijo |

### 2.5 Movimiento

Transiciones de 150 ms (`ease-out`) en hover y foco. Se respeta `prefers-reduced-motion`.

---

## 3. Componentes

Todos viven en `frontend/src/components/` y se prueban con Testing Library.

| Componente | Descripción | Variantes / estados |
|------------|-------------|---------------------|
| `Button` | Acción | `primario`, `secundario`, `texto`; estados `hover`, `foco`, `deshabilitado`, `cargando` (spinner + texto "Enviando...") |
| `TextField` | Input con label, ayuda y error | `normal`, `foco`, `error`, `deshabilitado`. Tipos: texto, número, email |
| `Select` | Lista desplegable (talla) | Igual que `TextField` |
| `Checkbox` | Aceptación de términos | `marcado`, `sin marcar`, `error` |
| `ActividadCard` | Tarjeta seleccionable de actividad | `seleccionada`, `sin cupo` (deshabilitada con leyenda "Sin cupos") |
| `HorarioChip` | Botón de horario con cupos restantes | `disponible`, `pocos cupos` (≤ 3, color advertencia), `agotado`, `seleccionado` |
| `Stepper` | Indicador de pasos | Paso actual, completados, pendientes |
| `ParticipanteForm` | Grupo de campos por persona | Muestra `talla` solo si la actividad la requiere |
| `Alert` | Mensaje en la página | `exito`, `error`, `advertencia`, `info`; con ícono y `role="alert"` para errores |
| `ResumenInscripcion` | Resumen final | Actividad, horario, participantes, email de envío |
| `Modal` | Términos y condiciones | Foco atrapado, cierre con `Esc` |

### 3.1 Reglas de uso

- **Un solo botón primario por pantalla.**
- Los labels van **siempre arriba** del campo, nunca como placeholder.
- Campos obligatorios marcados con `*` y explicados una vez al inicio del formulario.
- El mensaje de error aparece **debajo del campo**, en `--color-error`, con ícono, y se asocia con `aria-describedby`.
- El botón "Confirmar inscripción" queda deshabilitado hasta aceptar los términos.
- Al fallar el envío, el foco se mueve al `Alert` de error.

---

## 4. Flujo de pantallas

| Paso | Pantalla | Contenido principal |
|------|----------|---------------------|
| 1 | Elegí la actividad | Grilla de `ActividadCard`. Las que no tienen cupo en ningún horario aparecen deshabilitadas. |
| 2 | Elegí el horario | Selector de fecha + `HorarioChip` con cupos restantes. |
| 3 | ¿Cuántas personas? | Input numérico (mínimo 1, máximo según cupo disponible). |
| 4 | Datos de los participantes | Un `ParticipanteForm` por persona: nombre, DNI, edad y talla si corresponde. |
| 5 | Confirmación | `ResumenInscripcion`, email de contacto, checkbox de términos (con enlace al `Modal`) y botón confirmar. |
| 6 | ¡Listo! | `Alert` de éxito: "Te enviamos la confirmación con el código QR a tu email". |

Se puede volver a pasos anteriores sin perder los datos cargados.

---

## 5. Voz y tono

- Español rioplatense, **voseo** ("Elegí", "Ingresá", "Aceptá"), coherente con el público local.
- Frases cortas y positivas. Se dice qué hacer, no solo qué está mal.

| Situación | Texto |
|-----------|-------|
| Sin cupo | "No quedan cupos para este horario. Probá con otro." |
| Talla faltante | "Ingresá la talla: esta actividad requiere equipo." |
| Términos sin aceptar | "Para continuar, aceptá los términos y condiciones de la actividad." |
| Horario no disponible | "Este horario no está disponible. Elegí otro dentro del horario del parque." |
| DNI inválido | "Ingresá un DNI válido (7 u 8 números, sin puntos)." |
| Éxito | "¡Inscripción confirmada! Te enviamos el detalle y el código QR a {email}." |
| Error inesperado | "Algo salió mal. Intentá de nuevo en unos minutos." |

Los textos de error del backend (`mensaje`) siguen este mismo tono, así el frontend los muestra tal cual.

---

## 6. Accesibilidad (checklist)

- [ ] Contraste AA en todos los textos y estados.
- [ ] Todo se puede operar con teclado; el foco es visible (contorno de 2 px `--color-primario`).
- [ ] Cada input tiene `<label>` asociado.
- [ ] Errores con `aria-invalid` y `aria-describedby`; alertas con `role="alert"`.
- [ ] Áreas táctiles de al menos 44 × 44 px.
- [ ] Imágenes e íconos informativos con texto alternativo; decorativos con `aria-hidden`.
- [ ] Los tests de UI buscan elementos por rol y nombre accesible (`getByRole`), lo que de paso valida la accesibilidad.

---

## 7. Email de confirmación

- Ancho máximo 600 px, maquetado con tablas y estilos en línea (compatibilidad con clientes de correo).
- Encabezado con el nombre del parque sobre `--color-primario`.
- Template: `backend/src/infraestructura/email/templates/confirmacion-inscripcion.html`.
- Contenido: actividad, fecha y hora, lista de participantes, código de inscripción en texto, recordatorio de términos y el **código QR** centrado (200 × 200 px) con el texto "Presentá este código al llegar a la actividad".
- El QR es una **imagen fija** (`qr-placeholder.png`), igual para todas las inscripciones, porque su validación está fuera de alcance.
- Pie con datos de contacto del parque.
