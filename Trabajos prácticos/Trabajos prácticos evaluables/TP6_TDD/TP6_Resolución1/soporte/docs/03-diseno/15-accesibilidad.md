# Design system: accesibilidad

La interfaz tiene contraste suficiente y se puede usar con el teclado (S-24). Este checklist se verifica antes de dar la historia por terminada (Definition of Done).

- [x] Contraste AA en todos los textos y estados.
- [x] Todo se puede operar con teclado; el foco es visible (contorno de 2 px `--color-primario`).
- [x] Cada input tiene un `<label>` asociado.
- [x] Los errores usan `aria-invalid` y `aria-describedby`; las alertas, `role="alert"`.
- [x] Al validar un paso, el foco va al primer campo con error; al fallar el envío, al `Alert`.
- [x] El modal de términos atrapa el foco, se cierra con `Esc` y devuelve el foco al enlace que lo abrió.
- [x] Los controles deshabilitados (turnos, actividades, días y el botón de confirmar) indican el motivo con texto, no solo con color.
- [x] Áreas táctiles de al menos 44 × 44 px.
- [x] Las imágenes e íconos informativos tienen texto alternativo; los decorativos, `aria-hidden`.
- [x] Las pruebas de la interfaz buscan los elementos por rol y nombre accesible (`getByRole`), lo que valida la accesibilidad a la vez.

## Verificación

| Punto | Cómo se verificó |
|-------|------------------|
| Contraste, labels, roles y regiones | `e2e/accesibilidad.spec.js`: axe (`wcag2a`, `wcag2aa`, `wcag21aa`) sin violaciones en el ingreso con errores, la actividad, los participantes con errores, la confirmación, el modal de términos y la validación |
| Foco en el primer error y en el `Alert` | PART-UI-06, SES-UI-05, INS-UI-10 e INS-UI-11 |
| Modal | CMP-10 (foco atrapado, `Esc`, "Cerrar", foco devuelto y contenido con scroll enfocable) y E2E-05 |
| Motivo de los controles deshabilitados | CMP-05, CMP-06, CMP-09 e INS-UI-08 |
| Áreas táctiles | Token `--area-tactil: 44px` como alto mínimo de botones, inputs, chips y casillas |

axe encontró un problema durante la revisión: el texto del modal tiene scroll y no se podía recorrer con el teclado. Se corrigió haciendo el contenido una región enfocable (CMP-10).
