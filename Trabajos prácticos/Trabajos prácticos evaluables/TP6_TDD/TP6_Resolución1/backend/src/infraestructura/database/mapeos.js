import { Actividad } from '../../dominio/actividad.js';
import { Turno } from '../../dominio/turno.js';

/** Convierte una fila de Prisma en una actividad del dominio. */
export const aActividad = (fila) => new Actividad(fila);

/** Convierte una fila de Prisma (con su actividad) en un turno del dominio. */
export const aTurno = ({ actividad, ...fila }) =>
  new Turno({ ...fila, actividad: aActividad(actividad) });

export const CON_ACTIVIDAD = Object.freeze({ include: { actividad: true } });
