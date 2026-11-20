# Forma de trabajo

## Ramas y pull requests

- Una rama por fase o sub-fase (`feature/fase-1-dominio-calendario`), con pull request a `main` y revisión de otro integrante (Definición de Done).
- El pull request lleva descripción, pruebas agregadas y el checklist de la Definición de Done. Las convenciones de Git están en el [diseño](../03-diseno/09-convenciones-de-desarrollo.md).

## Commits

Uno por paso del ciclo, con la etiqueta del paso ([estrategia TDD](01-estrategia-tdd.md)):

```
test(dominio): [RED] rechaza un turno en lunes
feat(dominio): [GREEN] calendario con días cerrados
refactor(dominio): [REFACTOR] extraer estaAbierto
```

En el commit `[RED]` la prueba falla por la razón correcta (se verifica antes de commitear). El hook de pre-push corre `vitest run`, así que los `[RED]` se commitean pero se pushean junto a su `[GREEN]`.

## Reglas para avanzar

- **De adentro hacia afuera:** dominio, aplicación, infraestructura, HTTP, frontend y E2E.
- El **frontend puede avanzar en paralelo** desde la fase 6, porque trabaja contra MSW con el contrato de la [API](../03-diseno/04-api-rest.md), que ya está definido.
- **La configuración y los estilos no se hacen con TDD**: la fase 0 (andamiaje) y los tokens CSS no tienen comportamiento que probar. Todo lo demás sí.
- Los **textos de los términos y el logo** se mandan al PO para validar en las fases 5 y 6, no al final (RNF-03 y RNF-04).
- Las pruebas fijan siempre el reloj ([datos de referencia](../05-testing/01-datos-de-referencia.md)).
- Cada prueba de aceptación tiene al menos un caso automatizado ([trazabilidad](09-trazabilidad-y-riesgos.md)).
