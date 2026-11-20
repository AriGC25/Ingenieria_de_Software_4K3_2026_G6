# API REST

Todas las rutas están bajo `/api`, usan JSON y no requieren autenticación (la sesión es simulada y vive solo en el navegador).

## Endpoints

| Método | Ruta | Descripción | Caso de uso |
|--------|------|-------------|-------------|
| `GET` | `/api/actividades` | Lista las actividades con su disponibilidad actual | `ListarActividades` |
| `GET` | `/api/fechas` | Fechas elegibles para inscribirse, según el reloj del servidor | `ConsultarFechas` |
| `GET` | `/api/actividades/:id/turnos?fecha=YYYY-MM-DD` | Turnos de la actividad en esa fecha, con cupos y estado | `ConsultarTurnos` |
| `POST` | `/api/inscripciones` | Crea una inscripción y envía la confirmación | `InscribirseActividad` |

## `GET /api/actividades`

```json
[
  {
    "id": "tirolesa",
    "nombre": "Tirolesa",
    "requiereTalle": true,
    "edadMinima": 8,
    "cupoPorTurno": 10,
    "disponible": true,
    "terminos": "Texto completo de los términos..."
  }
]
```

`disponible` es `false` si la actividad no tiene ningún turno disponible en este momento (la pantalla la muestra deshabilitada, S-08). `edadMinima` es `null` si no hay mínimo.

## `GET /api/fechas`

```json
[
  { "fecha": "2026-10-20", "abierta": true },
  { "fecha": "2026-10-21", "abierta": true }
]
```

Devuelve hoy y mañana (S-31), según el reloj del servidor y en hora argentina. Si el parque está cerrado ese día, `abierta` es `false` y trae el `motivo` (`lunes` o `feriado`); la pantalla lo muestra deshabilitado (P2). El frontend **no** calcula "hoy" por su cuenta: así la demo funciona con una fecha fijada.

## `GET /api/actividades/:id/turnos?fecha=YYYY-MM-DD`

```json
{
  "fecha": "2026-10-20",
  "abierta": true,
  "turnos": [
    { "id": "t-tirolesa-2026-10-20-09", "hora": "09:00", "cuposDisponibles": 10, "estado": "no_disponible", "motivo": "ya_empezo" },
    { "id": "t-tirolesa-2026-10-20-10", "hora": "10:00", "cuposDisponibles": 7, "estado": "disponible" },
    { "id": "t-tirolesa-2026-10-20-11", "hora": "11:00", "cuposDisponibles": 0, "estado": "agotado" }
  ]
}
```

- `estado`: `disponible`, `agotado` o `no_disponible`. En este último caso trae `motivo`: `todavia_no_abre`, `inscripcion_cerrada` o `ya_empezo`.
- Los turnos van ordenados por hora.
- Si el día está cerrado: `abierta: false`, el `motivo` y `turnos: []`.
- Si la actividad no existe: `404 ACTIVIDAD_INEXISTENTE`. Si `fecha` falta o tiene otro formato: `400 SOLICITUD_INVALIDA`.

## `POST /api/inscripciones`

Solicitud:

```json
{
  "turnoId": "t-tirolesa-2026-10-20-10",
  "email": "visitante@mail.com",
  "aceptaTerminos": true,
  "participantes": [
    { "nombre": "Ana Pérez", "dni": "40123456", "edad": 25, "talle": "M" },
    { "nombre": "Juan Pérez", "dni": "42123456", "edad": 22, "talle": "L" }
  ]
}
```

La cantidad de personas se deduce de la longitud de `participantes`. El talle se omite en las actividades que no lo requieren; si llega, se ignora (RN-04, INT-06).

Respuesta `201`:

```json
{
  "codigo": "ECOPARK-7K3M9Q",
  "actividad": "Tirolesa",
  "fecha": "2026-10-20",
  "hora": "10:00",
  "email": "visitante@mail.com",
  "participantes": [
    { "nombre": "Ana Pérez", "dni": "40123456", "edad": 25, "talle": "M" },
    { "nombre": "Juan Pérez", "dni": "42123456", "edad": 22, "talle": "L" }
  ]
}
```

La respuesta solo existe si el mail ya se envió (RF-19): no hay un campo de "mail pendiente" ni de "mail no enviado".

### Validación de la forma (Zod)

| Campo | Regla de forma | Si no se cumple |
|-------|----------------|-----------------|
| `turnoId` | texto no vacío | `400 SOLICITUD_INVALIDA` |
| `email` | texto con formato de email, hasta 254 caracteres | `400 SOLICITUD_INVALIDA` |
| `aceptaTerminos` | booleano presente | `400 SOLICITUD_INVALIDA` |
| `participantes` | lista de **0 a 50** elementos | `400 SOLICITUD_INVALIDA` si no es una lista o supera 50 |
| `participantes[].nombre`, `.dni` | texto | `400 SOLICITUD_INVALIDA` |
| `participantes[].edad` | número | `400 SOLICITUD_INVALIDA` |
| `participantes[].talle` | texto, opcional | `400 SOLICITUD_INVALIDA` |

Una lista **vacía** pasa la forma y la rechaza el dominio (`DATOS_PARTICIPANTE_INVALIDOS`, campo `participantes`), porque es una regla de negocio. Que `aceptaTerminos` sea `false` también lo decide el dominio (`TERMINOS_NO_ACEPTADOS`).

**Tope de 50 participantes.** Es una protección técnica de la API pública: rechaza solicitudes abusivas en el borde, sin leer la base ni recorrer participantes, y hace explícito el contrato en lugar de depender del límite de tamaño del cuerpo de Express. No es una regla de negocio: 50 es más de cuatro veces el cupo máximo (12), así que nunca rechaza una inscripción legítima ni depende de los cupos del seed.

## Errores

Formato único. Los errores de un dato incluyen `campo`, para que la pantalla los muestre junto a ese campo:

```json
{ "codigo": "TALLE_REQUERIDO", "mensaje": "Ingresá el talle.", "campo": "participantes[0].talle" }
```

El backend **valida de a un error**: corta en el primero que encuentra, en el [orden de validación](../02-analisis/04-reglas-de-validacion.md). El `mensaje` es el del [catálogo de mensajes](14-contenido-y-mensajes.md), así la pantalla lo muestra tal cual.

| Código | HTTP | Cuándo | Prueba de aceptación |
|--------|------|--------|----------------------|
| `SOLICITUD_INVALIDA` | 400 | Forma incorrecta del request o de los parámetros | — |
| `ACTIVIDAD_INEXISTENTE` | 404 | Actividad fuera del listado | — |
| `HORARIO_NO_DISPONIBLE` | 422 | Turno inexistente, parque cerrado o fuera de la ventana de inscripción | PA-04, PA-08, PA-09, PA-14, PA-23 |
| `DATOS_PARTICIPANTE_INVALIDOS` | 422 | Nombre, DNI, edad o talle inválidos; lista de participantes vacía | PA-13, PA-18, PA-20, PA-22 |
| `DNI_REPETIDO` | 422 | El mismo DNI aparece dos veces en la inscripción | PA-26 |
| `EDAD_NO_PERMITIDA` | 422 | Edad menor a la mínima de la actividad | PA-10, PA-24 |
| `TALLE_REQUERIDO` | 422 | Falta el talle en una actividad que lo requiere | PA-06 |
| `TERMINOS_NO_ACEPTADOS` | 422 | Términos sin aceptar | PA-05 |
| `INSCRIPCION_SUPERPUESTA` | 409 | DNI ya inscripto en otro turno del mismo horario | PA-12 |
| `SIN_CUPO` | 409 | El turno no tiene cupo para todo el grupo | PA-02, PA-07, PA-30 |
| `ENVIO_CONFIRMACION_FALLIDO` | 503 | No se pudo enviar el mail: la inscripción no se registra | PA-16 |

`EMAIL_INVALIDO` y `CONTRASENA_VACIA` (login) **no existen en la API**: el ingreso es solo del frontend y simulado.
