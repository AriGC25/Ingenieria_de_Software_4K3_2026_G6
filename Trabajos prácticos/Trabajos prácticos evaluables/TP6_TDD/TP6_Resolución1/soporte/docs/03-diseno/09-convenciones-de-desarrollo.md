# Convenciones de desarrollo

## Código

- **Idioma:** los términos del dominio van en **español** (`Inscripcion`, `Participante`, `Turno`, `cuposDisponibles`), igual que en la historia de usuario y el análisis. Los roles técnicos también, cuando suena natural (`RepositorioTurnos`, `Notificador`). Lo que viene de librerías o del framework queda en inglés. Se usa **talle**, no "talla".
- **Nombres:** `PascalCase` para clases y componentes; `camelCase` para variables y funciones; `UPPER_SNAKE_CASE` para constantes y códigos de error; archivos en `camelCase.js` y componentes en `PascalCase.jsx`.
- **Módulos ES:** `"type": "module"` en cada `package.json`; siempre `import`/`export`, nunca `require`. Los imports relativos llevan la extensión `.js`.
- **JSDoc** en clases y funciones públicas del dominio y la aplicación (parámetros, retorno y errores que lanza).
- `const` por defecto, `let` solo si se reasigna, nunca `var`. Comparaciones con `===`.
- Validar los datos de entrada en los bordes (Zod en HTTP, constructores en el dominio), ya que no hay chequeo de tipos.
- Funciones cortas (idealmente menos de 20 líneas) y con una sola responsabilidad.
- Sin números mágicos: todo valor del negocio sale de `constantes.js` o de la configuración.
- Los errores de dominio son clases que extienden `ErrorDominio` con un `codigo`. Nunca se lanza un `Error` genérico desde el dominio.
- Comentarios solo para explicar el **por qué**, no el qué.
- Sin código comentado ni `console.log` de depuración.
- **Formato:** Prettier (2 espacios, comillas simples, `;`, ancho 100). **Lint:** ESLint con `eslint:recommended`, `eslint-plugin-react`, `eslint-plugin-react-hooks` y `eslint-plugin-jsdoc`.

## Git

- Rama principal `main`, protegida. Trabajo en ramas `feature/<descripcion>` o `test/<descripcion>`.
- **Conventional Commits** con la etiqueta del paso TDD (ver la [estrategia TDD](../04-implementacion/01-estrategia-tdd.md)).
- Pull request con descripción, pruebas agregadas y checklist de la Definición de Done, con revisión de otro integrante.
- Hooks de Husky: `lint-staged` (lint y formato) en pre-commit; `vitest run` en pre-push.
- Los secretos (`.env`) nunca se versionan.
