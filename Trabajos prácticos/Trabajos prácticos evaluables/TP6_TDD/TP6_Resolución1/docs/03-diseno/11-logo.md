# Logo

Marca propia de "EcoHarmony Park": una hoja cuyas nervaduras se leen como una onda, para unir naturaleza y armonía. Usa los colores de la [paleta del PO](10-design-system-fundamentos.md). El equipo lo diseña y lo manda al PO para su validación (RNF-03).

| Versión | Archivo | Uso |
|---------|---------|-----|
| Horizontal (símbolo y nombre en Lato) | `frontend/src/assets/logo.svg` | Encabezado de la aplicación |
| Símbolo | `frontend/src/assets/logo-simbolo.svg` | Favicon y espacios chicos |
| PNG | `backend/src/infraestructura/email/templates/logo.png` | Encabezado del mail (los clientes de correo no soportan SVG) |

## Reglas de uso

- Altura mínima de 32 px en pantalla.
- Espacio libre alrededor igual a la altura de la hoja.
- Sobre un fondo oscuro se usa la versión con el nombre en `#F2E8CF`.
- Se incluye el texto alternativo "EcoHarmony Park" cuando el logo es informativo (encabezado) y se oculta a los lectores de pantalla cuando es decorativo.
