# Casos de prueba del dominio

Pruebas unitarias, sin dobles. Cada fila es al menos un ciclo Red-Green-Refactor; los casos con varias entradas se escriben con `it.each`. Los valores y límites salen de las [reglas de validación](../02-analisis/04-reglas-de-validacion.md) y de los [valores límite](../05-testing/04-valores-limite.md).

## Calendario del parque (`calendarioParque.js`)

Configuración por defecto, salvo indicación.

| ID | Caso |
|----|------|
| CAL-01 | Un martes no feriado está abierto |
| CAL-02 | Un lunes está cerrado |
| CAL-03 | El 25 de diciembre está cerrado aunque no sea lunes |
| CAL-04 | El 1 de enero está cerrado |
| CAL-05 | Los feriados se repiten todos los años (el 25/12 de dos años distintos) |
| CAL-06 | Con otra configuración de días cerrados, se respeta (por ejemplo, cerrar los domingos) |
| CAL-07 | Se evalúa en hora argentina: el domingo 23:30 ART sigue siendo domingo aunque en UTC ya sea lunes |
| CAL-08 | Un lunes que además es feriado (25/12/2028) está cerrado |

## Ventana de inscripción (`ventanaInscripcion.js`)

`ahora` fijo en cada caso.

| ID | Caso |
|----|------|
| VEN-01 | Exactamente 24 h antes del inicio: dentro de la ventana |
| VEN-02 | 24 h y 1 segundo antes: fuera, con motivo `todavia_no_abre` |
| VEN-03 | Exactamente 15 min antes: dentro |
| VEN-04 | 14 min 59 s antes: fuera, con motivo `inscripcion_cerrada` |
| VEN-05 | Turno ya iniciado o pasado: fuera, con motivo `ya_empezo` |
| VEN-06 | Turno del día siguiente cuando faltan menos de 24 h: dentro (la ventana es móvil, no por día) |

## Participante (`participante.js`)

| ID | Caso |
|----|------|
| PAR-01 | Con nombre, DNI de 8 dígitos, edad válida y talle válido se crea correctamente |
| PAR-02 | DNI de 7 dígitos es válido |
| PAR-03 | DNI inválido lanza `DATOS_PARTICIPANTE_INVALIDOS`: 6 dígitos, 9 dígitos, con letras, con puntos, con espacios, vacío |
| PAR-04 | Nombre vacío o solo espacios lanza `DATOS_PARTICIPANTE_INVALIDOS` |
| PAR-05 | El nombre se guarda sin espacios al principio ni al final |
| PAR-06 | Edad inválida lanza `DATOS_PARTICIPANTE_INVALIDOS`: negativa, decimal, mayor a `EDAD_MAXIMA`, no numérica |
| PAR-07 | Edad 0 y edad `EDAD_MAXIMA` (100) son válidas |
| PAR-08 | Talle fuera de `TALLES` lanza `DATOS_PARTICIPANTE_INVALIDOS` |
| PAR-09 | El error indica el campo inválido, para mostrarlo junto al campo |
| PAR-10 | Un participante con varios datos inválidos informa solo el primero, en el orden nombre, DNI, edad, talle |
| PAR-11 | Nombre de 1 y de 100 caracteres es válido; de 101, inválido |
| PAR-12 | Nombre con tildes, `ñ`, apóstrofo y guion es válido; con dígitos o símbolos, inválido |
| PAR-13 | DNI con ceros a la izquierda (`0123456`) es válido y se conserva como texto |
| PAR-14 | Talle en minúsculas (`m`) es inválido |

## Actividad (`actividad.js`)

| ID | Caso |
|----|------|
| ACT-01 | Actividad que requiere talle rechaza un participante sin talle (`TALLE_REQUERIDO`) |
| ACT-02 | Actividad que no requiere talle acepta un participante sin talle |
| ACT-03 | Actividad que no requiere talle acepta un participante con talle y lo descarta (queda sin talle) |
| ACT-04 | Participante con edad menor a la mínima lanza `EDAD_NO_PERMITIDA` (Tirolesa, 7 años; Palestra, 11 años) |
| ACT-05 | Participante con la edad mínima exacta es aceptado (Tirolesa 8, Palestra 12) |
| ACT-06 | Actividad sin edad mínima acepta cualquier edad válida (Safari, 0 años) |
| ACT-07 | La edad máxima de 100 años rige para todas las actividades: 100 es válida y 101 es inválida |

## Turno (`turno.js`)

| ID | Caso |
|----|------|
| TUR-01 | `cuposDisponibles` es el cupo máximo menos el ocupado |
| TUR-02 | Reservar descuenta los cupos |
| TUR-03 | Reservar exactamente los cupos restantes deja 0 disponibles |
| TUR-04 | Reservar más de los disponibles lanza `SIN_CUPO` y no modifica el turno |
| TUR-05 | Estado `no_disponible` con su motivo cuando el momento actual está fuera de la ventana |
| TUR-06 | Estado `agotado` cuando no quedan cupos |
| TUR-07 | Estado `disponible` cuando está dentro de la ventana y tiene cupo |
| TUR-08 | Si el turno está fuera de la ventana y además agotado, el estado es `no_disponible` (la ventana se evalúa primero) |

## Inscripción (`inscripcion.js`, regla completa)

| ID | Caso |
|----|------|
| INS-01 | Inscripción válida con varios participantes reserva los cupos y queda con el email, los participantes y los términos aceptados |
| INS-02 | Sin aceptar los términos lanza `TERMINOS_NO_ACEPTADOS` |
| INS-03 | Sin participantes lanza `DATOS_PARTICIPANTE_INVALIDOS` en el campo `participantes` |
| INS-04 | Email inválido lanza un error de dominio (defensa; la forma ya la filtra Zod) |
| INS-05 | DNI repetido dentro de la misma inscripción lanza `DNI_REPETIDO` en el campo `dni` del segundo participante |
| INS-06 | DNI ya inscripto en otro turno con el mismo inicio lanza `INSCRIPCION_SUPERPUESTA` |
| INS-07 | DNI inscripto en un turno de otro horario no impide la inscripción |
| INS-08 | Grupo más grande que los cupos disponibles se rechaza completo (sin inscripción parcial) |
| INS-09 | Turno en día cerrado o fuera de la ventana lanza `HORARIO_NO_DISPONIBLE` |
| INS-10 | Turno no disponible y datos inválidos: gana `HORARIO_NO_DISPONIBLE` (el turno se valida primero) |
| INS-11 | Más personas que cupos y datos inválidos: gana `SIN_CUPO` (la cantidad se valida antes que los participantes) |
| INS-12 | Errores en el participante 1 y en el 2: se informa el del participante 1; dentro de un participante, nombre, DNI, DNI repetido, edad, edad mínima, talle |
| INS-13 | Datos inválidos y términos sin aceptar: gana el error de datos |
| INS-14 | Términos sin aceptar y DNI superpuesto con otra inscripción: gana `TERMINOS_NO_ACEPTADOS` (la superposición se consulta después) |
| INS-15 | Cada error de un dato indica su `campo` (`participantes[1].talle`, `aceptaTerminos`) |
| INS-16 | La inscripción registra la fecha y hora de aceptación de los términos |
