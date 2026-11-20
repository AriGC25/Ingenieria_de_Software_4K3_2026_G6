# Arquitectura del backend

Estilo **puertos y adaptadores**: el dominio y los casos de uso no conocen la base de datos, el servidor HTTP, el correo ni el reloj. Todo lo externo entra por puertos (contratos) que la infraestructura implementa.

## Capas

| Capa | Responsabilidad | Puede depender de |
|------|-----------------|-------------------|
| **Dominio** | Entidades y reglas: estado de un turno (calendario, ventana de inscripción y cupo), edad mínima y máxima, talle según la actividad, datos válidos de cada participante, DNI repetido, términos aceptados. Lanza errores de dominio | Nada |
| **Aplicación** | Casos de uso: orquestan el dominio y los puertos. Definen los **puertos** | Dominio |
| **Infraestructura** | Implementa los puertos: repositorios Prisma, notificadores, QR, generador de código y reloj | Aplicación, dominio, librerías externas |
| **Interfaces (HTTP)** | Recibe requests, valida la forma con Zod, invoca el caso de uso y traduce los errores de dominio a respuestas HTTP | Aplicación |

## Dominio

| Módulo | Contenido |
|--------|-----------|
| `constantes.js` | Los valores de la sección [constantes](08-configuracion-y-despliegue.md): turnos, ventana, talles, formato de DNI, edad máxima, largos máximos |
| `calendarioParque.js` | `estaAbierto(fecha)`: false los días cerrados y los feriados cerrados (RN-01). Recibe la configuración |
| `ventanaInscripcion.js` | `dentroDeLaVentana(inicioDelTurno, ahora)`: `inicio − 24 h ≤ ahora ≤ inicio − 15 min`, con extremos incluidos (S-07) |
| `turno.js` | `cuposDisponibles()`; `estado(ahora, calendario)` devuelve `disponible`, `agotado` o `no_disponible` (con motivo); `reservar(cantidad)` |
| `actividad.js` | `requiereTalle`, `edadMinima`; valida la edad de un participante contra el rango (RN-05 y RN-12) y la presencia del talle |
| `participante.js` | Crea un participante validando nombre, DNI, edad y talle (formatos de las [reglas de validación](../02-analisis/04-reglas-de-validacion.md)) |
| `inscripcion.js` | La regla completa de inscripción, con el [orden de validación](../02-analisis/04-reglas-de-validacion.md) |
| `errores.js` | Clases que extienden `ErrorDominio` con un `codigo` y, si corresponde, un `campo` |

### Estado de un turno

El estado se evalúa en este orden y **no se guarda**:

| Estado | Condición |
|--------|-----------|
| `no_disponible` | El momento actual está fuera de la ventana, con el motivo `todavia_no_abre`, `inscripcion_cerrada` o `ya_empezo` |
| `agotado` | Los cupos ocupados igualan el cupo máximo |
| `disponible` | Ninguna de las anteriores |

Los **días cerrados** no tienen turnos (el seed no los carga) y se informan a nivel de fecha (`abierta: false`). Si un turno no está en la base, no existe para el visitante.

## Aplicación

### Casos de uso

| Caso de uso | Entrada | Salida |
|-------------|---------|--------|
| `ListarActividades` | — | Las cuatro actividades con su edad mínima, talle, términos y si tienen algún turno disponible ahora |
| `ConsultarFechas` | — | Las fechas elegibles (hoy y mañana) con `abierta` y motivo si no lo está |
| `ConsultarTurnos` | Actividad, fecha | Los turnos de esa fecha con hora, cupos disponibles y estado. Falla con `ACTIVIDAD_INEXISTENTE` |
| `InscribirseActividad` | Turno, email, términos, participantes | La inscripción confirmada, o un error de dominio |

### Puertos (`aplicacion/puertos.js`)

JavaScript no tiene interfaces: cada puerto es un contrato documentado con JSDoc. Cualquier objeto con esos métodos lo cumple, tanto los adaptadores reales como los fakes de las pruebas.

| Puerto | Métodos |
|--------|---------|
| `RepositorioActividades` | `listar()`, `obtenerPorId(id)` |
| `RepositorioTurnos` | `obtenerPorId(id)` (con su actividad), `listarPorActividadYFecha(actividadId, fecha)`, `listarDisponiblesEntre(desde, hasta)` |
| `RepositorioInscripciones` | `dnisInscriptosEnInicio(inicio, dnis)`, `registrarConReserva(inscripcion)`, `anular(inscripcionId)` |
| `Notificador` | `enviarConfirmacion({ inscripcion, qr })` |
| `GeneradorQR` | `generar()` devuelve la imagen PNG del QR |
| `GeneradorCodigo` | `generar()` devuelve un código de inscripción |
| `Reloj` | `ahora()` |

Las dependencias se inyectan por constructor: `new InscribirseActividad({ repositorioTurnos, repositorioInscripciones, notificador, generadorQR, generadorCodigo, reloj, calendario })`.

### Flujo de `InscribirseActividad`

1. Carga el turno (con su actividad) y arma la solicitud. Si no existe, `HORARIO_NO_DISPONIBLE`.
2. Valida en el orden de las [reglas de validación](../02-analisis/04-reglas-de-validacion.md): turno y ventana, cantidad, participantes, términos.
3. Consulta los DNI ya inscriptos en un turno con el mismo inicio (`INSCRIPCION_SUPERPUESTA`).
4. Genera el código de inscripción.
5. **`registrarConReserva`**: en una sola transacción reserva los cupos y registra la inscripción con sus participantes. Si otra inscripción ocupó los cupos, `SIN_CUPO`. Si el código ya existe, reintenta con otro (hasta 3 veces).
6. Genera el QR y envía el mail. **El envío se hace después de confirmar la transacción**, no dentro, para no bloquear a otros visitantes mientras se habla con el servidor de correo.
7. Si el envío falla, **`anular`**: borra la inscripción y devuelve los cupos, y lanza `ENVIO_CONFIRMACION_FALLIDO`. Si falla la generación del QR, ocurre lo mismo.
8. Devuelve la inscripción (código, actividad, fecha, hora, participantes y email).

Si el servidor de correo tarda en responder pero igual entrega el mail, el visitante podría recibir la confirmación de una inscripción que se deshizo. Es poco probable y se acepta para el alcance del trabajo.

## Reloj y zona horaria

- El **reloj** se inyecta (`Reloj.ahora()`): el real, o uno fijo con `RELOJ_FIJO` para la demo y las pruebas (D-08).
- Todas las reglas de tiempo se evalúan en `America/Argentina/Buenos_Aires` (D-09): "hoy", "mañana", el día de la semana y la hora de un turno se calculan en esa zona aunque el servidor esté en UTC.
- Un turno se guarda con su instante de inicio en UTC y se interpreta en hora argentina.

## Interfaces HTTP

| Pieza | Responsabilidad |
|-------|-----------------|
| Esquemas Zod | Validan la **forma** del request (campos presentes y de tipo correcto, hasta 50 participantes). No validan reglas de negocio |
| Controladores | Invocan el caso de uso y devuelven la respuesta |
| Mapeo de errores | Convierten cada `ErrorDominio` en estado HTTP, `codigo`, `mensaje` y `campo` (ver [API REST](04-api-rest.md)). Un error inesperado responde 500 sin detalles internos |

## Composición

`main.js` crea los adaptadores según las variables de entorno y los inyecta en los casos de uso: la base (`file:` o `libsql://`), el notificador (`MAIL_PERFIL`), el reloj (real o fijo) y el calendario del parque. Exporta la app de Express; solo llama a `listen` fuera de Vercel.
