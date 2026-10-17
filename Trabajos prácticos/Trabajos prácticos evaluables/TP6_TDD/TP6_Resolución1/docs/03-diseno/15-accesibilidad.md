# Design system: accesibilidad

La interfaz tiene contraste suficiente y se puede usar con el teclado (S-24). Este checklist se verifica antes de dar la historia por terminada (Definition of Done).

- [ ] Contraste AA en todos los textos y estados.
- [ ] Todo se puede operar con teclado; el foco es visible (contorno de 2 px `--color-primario`).
- [ ] Cada input tiene un `<label>` asociado.
- [ ] Los errores usan `aria-invalid` y `aria-describedby`; las alertas, `role="alert"`.
- [ ] Al validar un paso, el foco va al primer campo con error; al fallar el envío, al `Alert`.
- [ ] El modal de términos atrapa el foco, se cierra con `Esc` y devuelve el foco al enlace que lo abrió.
- [ ] Los controles deshabilitados (turnos, actividades, días) indican el motivo con texto, no solo con color.
- [ ] Áreas táctiles de al menos 44 × 44 px.
- [ ] Las imágenes e íconos informativos tienen texto alternativo; los decorativos, `aria-hidden`.
- [ ] Las pruebas de la interfaz buscan los elementos por rol y nombre accesible (`getByRole`), lo que valida la accesibilidad a la vez.
