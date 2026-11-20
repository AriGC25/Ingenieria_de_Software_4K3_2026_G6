# Estrategia TDD

Cómo se aplica Red-Green-Refactor en el proyecto. El orden de construcción está en las [fases](03-fases.md) y los casos de prueba, en los documentos de casos de esta fase; las reglas de estilo, en las [convenciones de desarrollo](../03-diseno/09-convenciones-de-desarrollo.md). El diseño de las pruebas (clases de equivalencia y valores límite) está en la [fase de testing](../05-testing/README.md).

## Ciclo

1. **Red:** escribir **una** prueba que exprese un comportamiento todavía no implementado. Ejecutarla y **ver que falla por la razón correcta** (no por un error de compilación ajeno).
2. **Green:** escribir el **código mínimo** para que pase. Se permite hardcodear; la siguiente prueba obliga a generalizar.
3. **Refactor:** mejorar nombres, eliminar duplicación y extraer objetos con todas las pruebas en verde. No se agrega comportamiento en este paso.

Se trabaja con `vitest --watch` abierto durante todo el desarrollo. Se avanza **de adentro hacia afuera**: dominio, aplicación, infraestructura, HTTP y frontend.

## Evidencia del ciclo en Git

Cada paso del ciclo es un commit, para que el historial muestre el proceso:

```
test(dominio): [RED] rechaza un turno en lunes
feat(dominio): [GREEN] calendario con días cerrados
refactor(dominio): [REFACTOR] extraer estaAbierto
```

## Tipos de prueba y dobles

| Tipo | Qué cubre | Dobles |
|------|-----------|--------|
| Unitarias de dominio | Reglas puras | Ninguno |
| Unitarias de aplicación | Orquestación de los casos de uso | **Fakes** en memoria para los repositorios; **spy** para el `Notificador`; **stub** para el `Reloj`, el `GeneradorQR` y el `GeneradorCodigo` |
| Integración | API con la base real (SQLite en archivo temporal) | Notificador en memoria (perfil `pruebas`) que guarda los mails enviados |
| Frontend | Comportamiento de la interfaz | MSW para la API |
| E2E (opcional) | Pruebas de aceptación completas | Mailpit (perfil `desarrollo`) para verificar el mail recibido |

## Convenciones de las pruebas

- Estructura **AAA** (Arrange, Act, Assert) separada por líneas en blanco.
- Nombres en español, describiendo el comportamiento: `it('rechaza la inscripción si no se aceptan los términos')`.
- Un comportamiento por prueba. Varias aserciones están bien si verifican el mismo comportamiento.
- **Builders** de datos de prueba (`unaInscripcion().conParticipantes(2).sinTerminos().build()`) para no repetir objetos largos.
- Las pruebas **no dependen del orden ni de la fecha real**: siempre fijan el reloj.
- **Cobertura mínima:** 90% de líneas en `dominio/` y `aplicacion/`, y 70% global. La cobertura es un indicador, no un objetivo: no se escriben pruebas solo para subirla.
