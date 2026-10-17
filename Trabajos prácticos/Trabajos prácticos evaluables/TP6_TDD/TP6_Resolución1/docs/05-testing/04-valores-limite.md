# Valores límite

Cada límite se prueba en el valor exacto y a cada lado, con la menor unidad que tiene sentido (segundos para el reloj, 1 para los enteros, 1 carácter para los textos). Se escriben como pruebas parametrizadas (`it.each`).

## Ventana de inscripción

Turno: miércoles 21/10/2026 09:00. Los extremos cuentan como **dentro** (S-07).

| Ahora | Distancia al inicio | Resultado esperado |
|-------|---------------------|--------------------|
| Martes 20/10 08:59:59 | 24 h 00 m 01 s | Fuera (`todavia_no_abre`) |
| Martes 20/10 09:00:00 | 24 h exactas | Dentro |
| Martes 20/10 09:00:01 | 23 h 59 m 59 s | Dentro |
| Miércoles 21/10 08:44:59 | 15 m 01 s | Dentro |
| Miércoles 21/10 08:45:00 | 15 m exactos | Dentro |
| Miércoles 21/10 08:45:01 | 14 m 59 s | Fuera (`inscripcion_cerrada`) |
| Miércoles 21/10 09:00:00 | 0 (empieza) | Fuera (`ya_empezo`) |

## Turnos que carga el seed

El seed solo carga los turnos de 9:00 a 17:00 en los días abiertos. Un turno que el seed no carga **no existe** para el visitante.

| Inicio del turno | ¿Lo carga el seed? |
|------------------|--------------------|
| 08:00 | No (antes del primer turno) |
| 09:00 | Sí (primer turno) |
| 09:30 | No (no es en punto) |
| 17:00 | Sí (último turno; termina 18:00, antes del cierre de las 19:00) |
| 18:00 | No (cota superior, RN-02) |

## Días del calendario

| Día | Resultado esperado |
|-----|--------------------|
| Domingo 25/10/2026 23:59 ART (en UTC ya es lunes) | Abierto (es domingo en Argentina) |
| Lunes 19/10/2026 00:00 ART | Cerrado |
| Martes 20/10/2026 | Abierto |
| Jueves 24/12/2026 | Abierto |
| Viernes 25/12/2026 | Cerrado (feriado) |
| Sábado 26/12/2026 | Abierto |
| Jueves 31/12/2026 | Abierto |
| Viernes 01/01/2027 | Cerrado (feriado) |
| Sábado 02/01/2027 | Abierto |
| Lunes 25/12/2028 | Cerrado (lunes y feriado a la vez) |

## Cupos (Tirolesa, cupo máximo 10)

| Ocupados | Libres | Personas pedidas | Resultado esperado | Estado del turno antes |
|----------|--------|------------------|--------------------|------------------------|
| 0 | 10 | 10 | Válido; queda agotado | `disponible` |
| 0 | 10 | 11 | `SIN_CUPO` | `disponible` |
| 7 | 3 | 3 | Válido | `disponible` |
| 7 | 3 | 4 | `SIN_CUPO` | `disponible` |
| 9 | 1 | 1 | Válido (último cupo) | `disponible` |
| 9 | 1 | 2 | `SIN_CUPO` | `disponible` |
| 10 | 0 | 1 | `SIN_CUPO` | `agotado` |

Cantidad pedida: 0 participantes → `DATOS_PARTICIPANTE_INVALIDOS`; 1 → válido; 50 → pasa la validación de forma (y luego `SIN_CUPO` si no alcanza el cupo); 51 → 400.

Cupo máximo de cada actividad (una prueba por actividad, pidiendo el máximo y el máximo + 1): Safari 8 y 9, Tirolesa 10 y 11, Palestra 12 y 13, Jardinería 12 y 13.

## Edad

| Edad | Safari y Jardinería | Tirolesa (≥ 8) | Palestra (≥ 12) |
|------|---------------------|----------------|-----------------|
| −1 | `DATOS_PARTICIPANTE_INVALIDOS` | `DATOS_PARTICIPANTE_INVALIDOS` | `DATOS_PARTICIPANTE_INVALIDOS` |
| 0 | Válido | `EDAD_NO_PERMITIDA` | `EDAD_NO_PERMITIDA` |
| 7 | Válido | `EDAD_NO_PERMITIDA` | `EDAD_NO_PERMITIDA` |
| 8 | Válido | Válido | `EDAD_NO_PERMITIDA` |
| 11 | Válido | Válido | `EDAD_NO_PERMITIDA` |
| 12 | Válido | Válido | Válido |
| 100 | Válido | Válido | Válido |
| 101 | `DATOS_PARTICIPANTE_INVALIDOS` | `DATOS_PARTICIPANTE_INVALIDOS` | `DATOS_PARTICIPANTE_INVALIDOS` |

## Textos

| Variable | Valores a probar | Resultado esperado |
|----------|------------------|--------------------|
| DNI (largo) | 6, 7, 8 y 9 dígitos | Inválido, válido, válido, inválido |
| Nombre (largo sin los espacios de los extremos) | 0, 1, 100 y 101 caracteres | Inválido, válido, válido, inválido |
| Nombre con espacios | `"  Ana  "` | Válido; se guarda `"Ana"` |
| Email (largo) | 254 y 255 caracteres | Válido, inválido |
| Contraseña (ingreso) | 0 y 1 caracteres | Inválida, válida |
| Talle (lista ordenada) | `XS` (primero) y `XXL` (último) | Válidos |
| Participantes por solicitud | 50 y 51 | Pasa la forma; 400 |
