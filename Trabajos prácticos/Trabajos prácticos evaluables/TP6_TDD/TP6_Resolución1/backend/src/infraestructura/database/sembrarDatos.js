import { addDays } from 'date-fns';
import { PRIMER_TURNO, ULTIMO_TURNO } from '../../dominio/constantes.js';
import { fechaArgentina, instanteArgentino } from '../../dominio/fechas.js';
import { ACTIVIDADES } from './datosMaestros.js';

/**
 * Carga las actividades y los turnos de los próximos días (S-28), salteando los días cerrados del
 * calendario. Es repetible: crea solo los turnos que faltan y no toca las inscripciones (S-29).
 * @param {import('../../../generated/client.js').PrismaClient} prisma
 * @param {{ ahora: Date, calendario: object, diasAdelante: number }} opciones
 * @returns {Promise<{ turnosCreados: number }>}
 */
export async function sembrarDatos(prisma, { ahora, calendario, diasAdelante }) {
  await guardarActividades(prisma);
  const fechas = fechasAbiertas(ahora, diasAdelante, calendario);
  const turnos = ACTIVIDADES.flatMap((actividad) =>
    fechas.flatMap((fecha) => turnosDelDia(actividad, fecha)),
  );
  return { turnosCreados: await crearFaltantes(prisma, turnos) };
}

async function guardarActividades(prisma) {
  for (const { id, ...datos } of ACTIVIDADES) {
    await prisma.actividad.upsert({ where: { id }, create: { id, ...datos }, update: datos });
  }
}

function fechasAbiertas(ahora, diasAdelante, calendario) {
  return Array.from({ length: diasAdelante }, (_, i) => fechaArgentina(addDays(ahora, i))).filter(
    (fecha) => calendario.estaAbierto(fecha),
  );
}

function turnosDelDia(actividad, fecha) {
  return horasDeTurno().map((hora) => ({
    id: `t-${actividad.id}-${fecha}-${hora.slice(0, 2)}`,
    actividadId: actividad.id,
    inicio: instanteArgentino(fecha, hora),
    cupoMaximo: actividad.cupoPorTurno,
  }));
}

/** De 09:00 a 17:00, una por hora (RN-02). */
function horasDeTurno() {
  const desde = Number(PRIMER_TURNO.slice(0, 2));
  const hasta = Number(ULTIMO_TURNO.slice(0, 2));
  return Array.from(
    { length: hasta - desde + 1 },
    (_, i) => `${String(desde + i).padStart(2, '0')}:00`,
  );
}

async function crearFaltantes(prisma, turnos) {
  const existentes = await prisma.turno.findMany({
    where: { id: { in: turnos.map((t) => t.id) } },
    select: { id: true },
  });
  const ids = new Set(existentes.map((t) => t.id));
  const nuevos = turnos.filter((t) => !ids.has(t.id));
  if (nuevos.length > 0) await prisma.turno.createMany({ data: nuevos });
  return nuevos.length;
}
