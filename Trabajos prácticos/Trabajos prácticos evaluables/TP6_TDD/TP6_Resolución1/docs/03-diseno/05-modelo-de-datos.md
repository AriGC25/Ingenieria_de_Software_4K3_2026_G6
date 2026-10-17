# Modelo de datos

Implementa las entidades del [modelo de dominio](../02-analisis/01-modelo-de-dominio.md). El esquema y el seed viven en `backend/database/`.

## Esquema

```prisma
generator client {
  provider            = "prisma-client"
  output              = "../generated"
  moduleFormat        = "esm"
  importFileExtension = "js"
}

datasource db {
  provider = "sqlite"
}

model Actividad {
  id            String  @id               // tirolesa, safari, palestra, jardineria
  nombre        String  @unique
  requiereTalle Boolean
  edadMinima    Int?                      // null si no hay edad mínima
  cupoPorTurno  Int
  terminos      String                    // texto completo de los términos
  turnos        Turno[]
}

model Turno {
  id            String        @id         // t-<actividad>-<fecha>-<hora>
  actividadId   String
  actividad     Actividad     @relation(fields: [actividadId], references: [id])
  inicio        DateTime                  // instante de inicio (UTC); dura una hora
  cupoMaximo    Int
  cupoOcupado   Int           @default(0)
  inscripciones Inscripcion[]

  @@unique([actividadId, inicio])
  @@index([inicio])
}

model Inscripcion {
  id                   String         @id @default(uuid())
  codigo               String         @unique   // ECOPARK-XXXXXX
  turnoId              String
  turno                Turno          @relation(fields: [turnoId], references: [id])
  email                String
  terminosAceptadosEn  DateTime
  creadaEn             DateTime       @default(now())
  participantes        Participante[]
}

model Participante {
  id            String      @id @default(uuid())
  inscripcionId String
  inscripcion   Inscripcion @relation(fields: [inscripcionId], references: [id], onDelete: Cascade)
  nombre        String
  dni           String                    // texto: conserva los ceros iniciales
  edad          Int
  talle         String?                   // vacío si la actividad no lo requiere

  @@index([dni])
}
```

### Decisiones del esquema

| Decisión | Justificación |
|----------|---------------|
| El nombre de la entidad es **Turno** (no "horario") | Es el término del dominio y del análisis |
| **No hay un campo "habilitado"** en el turno | No existe un deshabilitado manual: la disponibilidad se calcula con la ventana, el calendario y el cupo (RN-11) |
| `cupoMaximo` en el turno, además de `cupoPorTurno` en la actividad | El turno guarda su propio máximo desde que nace; cambiar el cupo de una actividad no altera los turnos ya cargados |
| `terminosAceptadosEn` en lugar de un booleano | Deja constancia de cuándo se aceptaron (S-17); una inscripción solo existe si se aceptaron |
| **No hay estado de la inscripción** | Solo existen inscripciones confirmadas: si algo falla, no se registra (INT-05) |
| `dni` como texto con índice | Conserva los ceros iniciales (RN-13) y acelera la consulta de superposición |
| `@@unique([actividadId, inicio])` | Evita turnos duplicados y hace que el seed sea repetible (S-29) |
| `onDelete: Cascade` en el participante | Anular una inscripción borra sus participantes |

## Reglas de integridad en la base

| Regla | Cómo se garantiza |
|-------|-------------------|
| INT-01 Los cupos ocupados no superan el máximo | La reserva usa una actualización condicional (ver abajo) |
| INT-02 Toda inscripción tiene al menos un participante | La crea el repositorio con sus participantes en la misma transacción |
| INT-03 El código es único | `@unique` en `codigo` |
| INT-04 Un DNI no está en dos turnos con el mismo inicio | Se consulta antes de reservar (la regla es del dominio, no de la base) |
| INT-05 No hay inscripciones a medias | Reserva y registro en una transacción; `anular` si falla el mail |

## Concurrencia de cupos

La reserva se hace en una **transacción** con una actualización condicional:

```
UPDATE Turno
SET cupoOcupado = cupoOcupado + :n
WHERE id = :turnoId AND cupoOcupado + :n <= cupoMaximo
```

Si no actualiza ninguna fila, se lanza `SIN_CUPO`. Así, si dos visitantes reservan el último lugar a la vez, solo uno lo obtiene (D-02, S-25, PA-30). Con 20 reservas simultáneas sobre 8 cupos, 8 tienen éxito, 12 reciben `SIN_CUPO` y el cupo final es exactamente el máximo (verificado en la [prueba de despliegue](../06-despliegue/README.md)).

## Superposición de turnos

Antes de reservar se consulta si alguno de los DNI de la solicitud figura en una inscripción de **otro turno con el mismo `inicio`**, de cualquier actividad e inscripta por cualquier visitante (S-12, S-13). Si existe, se lanza `INSCRIPCION_SUPERPUESTA`. La comparación es por DNI exacto (texto).

## Anulación

`anular(inscripcionId)`, en una transacción: borra la inscripción con sus participantes y resta sus participantes de `cupoOcupado` del turno. Se usa cuando falla el envío del mail.

## Calendario del parque

El calendario (días y horario de apertura, feriados) **no es una tabla**: es configuración (ver [configuración](08-configuracion-y-despliegue.md)). Define qué fechas se muestran deshabilitadas y para qué fechas carga turnos el seed; ambos usan el mismo módulo `calendarioParque`, para que coincidan.

## Seed

`database/seed.js` carga, de forma repetible:

- Las **4 actividades** con su cupo por turno, si requieren talle, edad mínima y términos (tabla de [datos maestros](../02-analisis/02-datos-maestros.md)).
- Los **turnos** de cada actividad, de 9:00 a 17:00, uno por hora, para los **próximos 7 días** desde la ejecución (`SEED_DIAS_ADELANTE`, S-28), **salteando los días cerrados**. Cada turno nace con 0 cupos ocupados.
- Volver a ejecutarlo **no duplica** turnos ni modifica las inscripciones registradas (S-29): crea solo los turnos que faltan.

El instante de inicio de cada turno se calcula en hora argentina y se guarda en UTC.

## Prisma y las migraciones

- **Configuración:** Prisma 7 se configura en `backend/prisma.config.ts` (ruta del esquema, carpeta de migraciones y URL de la base local).
- **Cliente:** el generador usa `moduleFormat = "esm"` e `importFileExtension = "js"`; sin eso el código no carga en Node con módulos ES (`ERR_MODULE_NOT_FOUND`). Se instancia con el adaptador: `new PrismaClient({ adapter: new PrismaLibSql({ url, authToken }) })`, con `file:` en local y `libsql://` en Turso.
- **Migraciones en Turso:** `prisma migrate` no corre contra Turso. Se generan en local y un script (`npm run db:migrate:turso`) aplica los `migration.sql` pendientes sobre Turso.
