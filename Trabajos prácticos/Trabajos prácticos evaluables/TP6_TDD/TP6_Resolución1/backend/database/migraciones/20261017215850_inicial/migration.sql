-- CreateTable
CREATE TABLE "Actividad" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "requiereTalle" BOOLEAN NOT NULL,
    "edadMinima" INTEGER,
    "cupoPorTurno" INTEGER NOT NULL,
    "terminos" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Turno" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actividadId" TEXT NOT NULL,
    "inicio" DATETIME NOT NULL,
    "cupoMaximo" INTEGER NOT NULL,
    "cupoOcupado" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Turno_actividadId_fkey" FOREIGN KEY ("actividadId") REFERENCES "Actividad" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Inscripcion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codigo" TEXT NOT NULL,
    "turnoId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "terminosAceptadosEn" DATETIME NOT NULL,
    "creadaEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Inscripcion_turnoId_fkey" FOREIGN KEY ("turnoId") REFERENCES "Turno" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Participante" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "inscripcionId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "edad" INTEGER NOT NULL,
    "talle" TEXT,
    CONSTRAINT "Participante_inscripcionId_fkey" FOREIGN KEY ("inscripcionId") REFERENCES "Inscripcion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Actividad_nombre_key" ON "Actividad"("nombre");

-- CreateIndex
CREATE INDEX "Turno_inicio_idx" ON "Turno"("inicio");

-- CreateIndex
CREATE UNIQUE INDEX "Turno_actividadId_inicio_key" ON "Turno"("actividadId", "inicio");

-- CreateIndex
CREATE UNIQUE INDEX "Inscripcion_codigo_key" ON "Inscripcion"("codigo");

-- CreateIndex
CREATE INDEX "Participante_dni_idx" ON "Participante"("dni");
